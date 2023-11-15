import express from 'express';
export const projectRouter = express.Router();
import { User } from '../models/User.js';
import { authHandler, unableToFindAccount } from '../util.js';
import { Project } from '../models/Project.js';
import { Message } from '../models/Message.js';
import { ProjectMessage } from '../models/ProjectMessage.js';
import { upload } from './testRoute.js';
import { Photo } from '../models/Photo.js';
import { MongoClient } from 'mongodb';
const mongoURL = process.env.MONGO_URL
projectRouter.use(authHandler)

// Route to search existing projects
projectRouter.get('/search', async (req, res) => {
    
    try {
        const client = new MongoClient(mongoURL);
        await client.connect();
        // Get the search term from query parameters
        const { searchString } = req.query;
        if (!searchString || !searchString.length) {
            const projects = await Project.find({}).sort({createdAt: 'desc'}).exec()
            res.status(200).send(projects);
            return;
        }
        //query default search index
        const pipeline = [
            {
                $search: {
                    text: {
                    query: searchString,
                    path: ["name", "description", "pay"],
                    fuzzy: {}
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    pay: 1,
                    createdAt: 1
                },
            },   
        ];
        
        //create a cursor pointing to a set of query results
        const cursor = await client.db("test").collection("projects").aggregate(pipeline);
        
        //collect all documents from the cursor and put them into an array
        let docArray = [];
        await cursor.forEach((doc) => {docArray.push(doc)});
        await client.close();
        res.status(200).send(docArray);

    } catch (error) {
        res.status(500).send(error.message);
    } 
}
);

// Route to create a new project
projectRouter.post('/', async (req, res) => {
    // Pull out the user ID
    const { id } = req.session.passport.user;

    const user = await User.findById(id).populate('client').exec();
    if (user === null) {
        res.status(400).send({"message": "Unable to locate account"});
        return;
    }

    if (!user.client) {
        res.status(400).send({"message": "Not a client account"});
        return;
    }


    // Pull out the payload fields
    const { title, description, pay, startDate, endDate } = req.body;
    if (!title || !description || !pay || !startDate || !endDate) {
        res.status(400).send("Please fill out all fields");
        return;
    }

    const project = new Project({
        client: user.client._id,
        name: title,
        description: description,
        pay: pay,
        startDate: startDate,
        endDate: endDate
    })

    const projectMessage = new ProjectMessage({
        project: project._id,
        messages: []
    })

    project.projectMessages = projectMessage._id

    await projectMessage.save();
    await project.save();

    res.status(200).send({
        "message": "Successfully created post!",
        "postId": project._id
    });
    return;
})

projectRouter.delete("/:projectId", async (req, res) => {
    const {projectId} = req.params;
    const {id} = req.session.passport.user;

    const user = await User.findById(id).populate('client').exec();
    if (user === null) {
        res.status(400).send({"message": "Unable to locate account"});
        return;
    }

    const project = await Project.findById(projectId).exec();

    if (!user.client || user.client._id.toString() !== project.client._id.toString()) {
        res.status(400).send({"message": "Cannot delete project you didn't create"});
        return;
    }

    await ProjectMessage.deleteOne({_id: project.projectMessages._id}).exec()
    await Project.deleteOne({_id: project._id}).exec()
    res.status(200).send({"message": "Successfully deleted project"});
})

// Route to get all projects
projectRouter.get('/', async (req, res) => {
    const {id} = req.session.passport.user;

    const user = await User.findById(id).populate('client').exec();
    if (user === null) {
        unableToFindAccount(res)
    }

    const projects = await Project.find({}).sort({createdAt: 'desc'}).exec()
    res.status(200).send(projects);
    return;
})

// Route to get an existing project
projectRouter.get('/:projectId', async (req, res) => {
    // Pull out the user ID
    const { id } = req.session.passport.user;

    const user = await User.findById(id).populate('client').exec();
    if (user === null) {
        unableToFindAccount(res)
        return;
    }

    // Pull out the projectId
    const { projectId } = req.params;
    let project;
    try {
    project = await Project.findById(projectId)
        .populate('client')
        .populate({
            path: 'projectMessages',
            populate: {
                path: 'messages',
                populate: {
                    path: 'photos'
                },

            }
        })
        .populate('clientReview')
        .populate('lancerReview')
        .exec();
    } catch {
        res.status(400).send({"message": "Inavlid projectId"})
        return;
    }
    
    
    if (project === null) {
        res.status(404).send({"message": "Unable to locate project"});
        return;
    }

    for (let i = 0; i < project.projectMessages.messages.length; i++) {
        await project.projectMessages.messages[i].populate('creator')
    }
    let isPostCreator = false;
    if (user.client && project.client._id.toString() === user.client._id.toString()) {
        isPostCreator = true;
    }

    const {
        client, 
        lancer, 
        name,
        projectMessages,
        description,
        pay,
        startDate,
        endDate,
        createdAt,
        updatedAt,
        clientReview,
        lancerReview,
        _id
    } = project;

    const payload = {
        client: client,
        lancer: lancer,
        title: name,
        projectMessage: projectMessages,
        description: description,
        pay: pay,
        startDate: startDate,
        endDate: endDate,
        createdAt: createdAt,
        updatedAt: updatedAt,
        clientReviews: clientReview,
        lancerReviews: lancerReview,
        isPostCreator: isPostCreator,
        _id: _id
    }

    res.status(200).send(payload);
    return;
})

// Route to add a message to a project
projectRouter.post('/message', upload.single('photo'), async (req, res) => {
    // Pull out the user ID
    const { id } = req.session.passport.user;

    const user = await User.findById(id).populate('client').exec();
    if (user === null) {
        unableToFindAccount(res)
        return;
    }

    let photo;
    if (req.file) {
        const file = req.file;
        photo = new Photo({
            url: file.location,
            filename: file.originalname
        })
        await photo.save()
    }

    const { message, projectId } = req.body;
    if (!message || !projectId) {
        res.status(400).send({"message": "Please fill out all fields"});
        return;
    }

    let project;
    try {
        project = await Project.findById(projectId).exec()
    } catch {
        res.status(400).send({"message": "Invalid projectId"});
        return;
    }
    const msg = new Message({
        messageContents: message,
        creator: user._id,
        photos: [photo]
    })
    await msg.save()

    let projectMessages = await ProjectMessage.findOne({project: project})
        .populate('messages')
        .exec()
    if (projectMessages === null) {
        projectMessages = new ProjectMessage({
            project: project._id,
            messages: [msg._id]
        })
    } else {
        projectMessages.messages.push(msg._id);
    }

    await projectMessages.save();

    project.projectMessages = projectMessages._id
    await project.save();

    res.status(200).send({"message": "Successfully added message to the project"})
})

// Route to delete a message
projectRouter.delete('/message/:id', async (req, res) => {
    const {id} = req.params
    const userId = req.session.passport.user.id
    try {
        const msg = Message.findById(id).exec();
        if (msg.creator._id.toString() != userId.toString()) {
            res.status(400).send({"message": "Unable to delete a message you didn't write"})
            return;
        }
        await Message.deleteOne({_id: id}).exec()
    } catch {
        res.status(400).send({"message": "Invalid messageId"})
        return;
    }
    return res.status(200).send({"message": "Successfully deleted message"})
})

// Route to update a message
projectRouter.put('/message', async (req, res) => {
    const userId = req.session.passport.user.id;
    const {id, message} = req.body;
    if (!message || !id) {
        res.status(400).send({"message": "Please fill out all fields"});
        return;
    }

    let msg;
    try {
        msg = await Message.findById(id).exec()
        if (msg.creator._id.toString() != userId.toString()) {
            res.status(400).send({"message": "Cannot update a message you didn't create"});
            return;
        }
        msg.messageContents = message;
        msg.updatedAt = Date.now()
        await msg.save()
    } catch {
        res.status(400).send({"message": "Invalid messageId"})
        return;
    }

    return res.status(200).send({"message": "Successfully updated message"})
})

// Route to update a Project
projectRouter.post('/update', async (req, res) => {
    // Pull out the user ID
    const { id } = req.session.passport.user;

    const user = await User.findById(id).populate('client').exec();
    if (user === null) {
        unableToFindAccount(res)
        return;
    }

    if (!user.client) {
        res.status(400).send({"message": "Unable to update, you're not registered as a client"})
    }

    const { projectId } = req.body;
    let project;
    try {
        project = await Project.findById(projectId)
            .populate('client')
            .populate('projectMessages')
            .populate('clientReview')
            .populate('lancerReview')
            .exec();
    } catch {
        res.status(400).send({"message": "Invalid projectId"});
        return;
    }

    if (project === null) {
        res.status(404).send({"message": "Unable to locate project"});
        return;
    }

    if (project.client._id.toString() != user.client._id.toString()) {
        res.status(400).send({"message": "Unable to edit as you are not the creator"});
        return;
    }

    const {name, description, pay, startDate, endDate} = req.body;
    if (name && description && pay && startDate && endDate) {
        project.name = name;
        project.description = description;
        project.pay = pay;
        project.startDate = startDate;
        project.endDate = endDate;
        await project.save()

        res.status(200).send({"message": "Successfully updated project details"})
        return;
    } else {
        res.status(400).send({"message": "Missing some fields"});
        return;
    }

})

// Route to assign a Lancer to a Project
projectRouter.patch('/assign', async(req, res) =>{
    // Pull out the user ID
    const { id } = req.session.passport.user;

    // User should be a lancer, instead of a client
    const user = await User.findById(id).populate('lancer').exec();
    if (user === null) {
        unableToFindAccount(res)
        return;
    }

    if (!user.lancer) {
        res.status(400).send({"message": "Not a lancer account"});
        return;
    }

    const { projectId } = req.body;
    const project = await Project.findById(projectId)
        .populate('name')
        .populate('lancer')
        .exec();

    if (project === null) {
        res.status(404).send({"message": "Unable to locate project"});
        return;
    }

    if (project.lancer != null)
    {
        res.status(500).send({"message": "Project already has an assigned Lancer"});
        return;
    }

    project.lancer = user.lancer;
    await project.save();
    
    res.status(200).send({"message": "Lancer sucessfully assigned to project"});
    return;
})

// Route to assign a Lancer to a Project
projectRouter.patch('/unassign', async(req, res) =>{
    // Pull out the user ID
    const { id } = req.session.passport.user;

    // User should be a lancer, instead of a client
    const user = await User.findById(id).populate('lancer').exec();
    if (user === null) {
        unableToFindAccount(res)
        return;
    }

    if (!user.lancer) {
        res.status(400).send({"message": "Not a lancer account"});
        return;
    }

    const { projectId } = req.body;
    const project = await Project.findById(projectId)
        .populate('lancer')
        .exec();

    if (project === null) {
        res.status(404).send({"message": "Unable to locate project"});
        return;
    }

    if (user.lancer.ObjectId != project.lancer.ObjectId)
    {
        res.status(500).send({"message": "Cannot unassign another Lancer from a project"});
        return;
    }

    project.lancer = null;
    await project.save();
    
    res.status(200).send({"message": "Lancer sucessfully unassigned from project"});
    return;
})

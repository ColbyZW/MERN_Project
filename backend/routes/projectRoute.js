import express from 'express';
export const projectRouter = express.Router();
import { User } from '../models/User.js';
import { authHandler, unableToFindAccount } from '../util.js';
import { Project } from '../models/Project.js';
import { Message } from '../models/Message.js';
import { ProjectMessage } from '../models/ProjectMessage.js';
import { upload } from './testRoute.js';
import { Photo } from '../models/Photo.js';

projectRouter.use(authHandler)

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

    const project = await Project.findById(projectId)
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
    const project = await Project.findById(projectId).exec()
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
    await Message.deleteOne({_id: id}).exec()
    return res.status(200).send({"message": "Successfully deleted message"})
})

// Route to update a message
projectRouter.put('/message', async (req, res) => {
    const {id, message} = req.body;
    const msg = await Message.findById(id).exec()
    msg.messageContents = message;
    msg.updatedAt = Date.now()
    await msg.save()

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
    const project = await Project.findById(projectId)
        .populate('client')
        .populate('projectMessages')
        .populate('clientReview')
        .populate('lancerReview')
        .exec();

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

    const { projectId } = req.body;
    const project = await Project.findById(projectId)
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

    project.lancer = user;
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

    const { projectId } = req.body;
    const project = await Project.findById(projectId)
        .populate('lancer')
        .exec();

    if (project === null) {
        res.status(404).send({"message": "Unable to locate project"});
        return;
    }

    if (user != project.lancer)
    {
        res.status(500).send({"message": "Cannot unassign another Lancer from a project"});
        return;
    }

    project.lancer = null;
    await project.save();
    
    res.status(200).send({"message": "Lancer sucessfully unassigned from project"});
    return;
})

import express from 'express';
export const projectRouter = express.Router();
import { User } from '../models/User.js';
import { authHandler, unableToFindAccount } from '../util.js';
import { Project } from '../models/Project.js';
import { Message } from '../models/Message.js';
import { ProjectMessage } from '../models/ProjectMessage.js';

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

    await project.save();

    res.status(200).send({
        "message": "Successfully created post!",
        "postId": project._id
    });
    return;
})

projectRouter.get('/', async (req, res) => {
    const {id} = req.session.passport.user;

    const user = await User.findById(id).populate('client').exec();
    if (user === null) {
        unableToFindAccount(res)
    }

    const projects = await Project.find({}).sort({dateCreated: 'desc'}).exec()
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
                }
            }
        })
        .populate('clientReview')
        .populate('lancerReview')
        .exec();
    
        console.log(project.projectMessages)
    if (project === null) {
        res.status(404).send({"message": "Unable to locate project"});
        return;
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
        lancerReview
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
        isPostCreator: isPostCreator
    }

    res.status(200).send(payload);
    return;
})

// Route to add a message to a project
projectRouter.post('/message', async (req, res) => {
    // Pull out the user ID
    const { id } = req.session.passport.user;

    const user = await User.findById(id).populate('client').exec();
    if (user === null) {
        unableToFindAccount(res)
        return;
    }

    // image handling done here (probably want to extract this out into a standalone
    // function that we can call within other routes as well)
    // for now I'm just setting the photos to empty

    const { message, projectId } = req.body;
    const project = await Project.findById(projectId).exec()
    const msg = new Message({
        messageContents: message,
        creator: user._id
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

// Search Endpoint
projectRouter.get('/projectSearch', async (req, res) => {
    try {
        const query = {};

        // Add search criteria to the query object based on the request query parameters
        for (const key in req.query) {
            if (req.query[key]) {
                // For simplicity, using direct assignment. Customize as needed.
                query[key] = req.query[key];
            }
        }

        const results = await Project.find(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
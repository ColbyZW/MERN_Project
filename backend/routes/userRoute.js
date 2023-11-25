import express from 'express';
import mongoose from 'mongoose';
export const userRouter = express.Router();
import { User } from '../models/User.js';
import { Photo } from '../models/Photo.js';
import { Lancer } from '../models/Lancer.js';
import { LancerAccount } from '../models/LancerAccount.js';
import { Client } from '../models/Client.js';
import { Project } from '../models/Project.js';
import { ClientAccount } from '../models/ClientAccount.js';
import { authHandler } from '../util.js';
import { upload } from './testRoute.js';

// Comment this out if you want to test locally with postman
userRouter.use(authHandler)

// Route to logout
userRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            res.status(400).send({"message": "Unknown Error Occurred"});
            return;
        }
        res.status(200).send({"message": "Successfully logged out!"});
    })
})

// Route to create a new Lancer
userRouter.post('/lancer', async (req, res) => {
    const {company, name} = req.body
    const {id} = req.session.passport.user
    const user = await User.findById(id).exec()

    if (user === null) {
        res.status(400).send({"message": "Unable to find account"})
        return
    }

    const lancer = new Lancer({
        company: company,
        enabled: true
    })
    await lancer.save()

    const lancerAccount = new LancerAccount(
        {
            lancer: lancer,
            balance: 0
        }
    )
    await lancerAccount.save()

    user.lancer = lancer._id;
    user.name = name;
    user.fullyRegistered = true;
    await user.save()

    res.status(200).send({"message": "Successfully created Lancer account"})
    return
})

// Route to create a new Client
userRouter.post('/client', async (req, res) => {
    const {company, name} = req.body
    const {id} = req.session.passport.user
    const user = await User.findById(id).exec()

    if (user === null) {
        res.status(400).send({"message": "Unable to find account"})
        return
    }

    const client = new Client({
        company: company,
        enabled: true
    })
    await client.save()

    const clientAccount = new ClientAccount(
        {
            client: client,
            balance: 0
        }
    )
    await clientAccount.save()

    user.client = client._id;
    user.name = name;
    user.fullyRegistered = true;
    await user.save()

    res.status(200).send({"message": "Successfully created Client account"})
    return
})

// Route to return all of a users information
userRouter.get("/", async (req, res) => {
    const {id} = req.session.passport.user;
    const user = await User.findById(id)
        .populate('client')
        .populate('lancer')
        .populate('photo')
        .exec()

    if (user === null) {
        res.status(400).send({"message": "Unable to find account"})
        return;
    }

    res.status(200).send(user)
})


userRouter.post("/", upload.single('photo'), async (req, res) => {
    const {id} = req.session.passport.user;
    const user = await User.findById(id)
        .populate('client')
        .populate('lancer')
        .populate('photo')
        .exec();
    

    if (req.file) {
        const file = req.file;
        const photo = new Photo({
            url: file.location,
            filename: file.originalname
        })
        user.photo = photo;
        await photo.save()
    }

    const {name, company} = req.body;

    user.name = name;
    if (user.client) {
        user.client.company = company;
        await user.client.save();
    } else {
        user.lancer.company = company;
        await user.lancer.save();
    }
    await user.save();

    res.status(200).send({"message": "Successfully updated profile information"});
})

userRouter.get('/name', (req, res) => {
    res.status(200).send({"name": req.session.passport.user.name})
})

// Utility route to call on every page to ensure user is logged in
userRouter.get("/isLoggedIn", async (req, res) => {
    const {id} = req.session.passport.user;
    const user = await User.findById(id).exec();
    if (!user.fullyRegistered) {
        res.status(403).send({"redirect": "/register"})
        return;
    }

    const userId = user.lancer ? user.lancer._id : user.client._id;
    res.status(200).send({
        "message": "User logged in",
        "id": userId,
        "uid": user._id
    });
})

// Route to return a specific users information
userRouter.get("/:id", async (req, res) => {
    const {id} = req.params;

    let acc = await Client.findById(id).exec();
    let user;
    // handle client flow
    if (acc) {
        user = await User.find({ "client": acc}).populate('client').populate('photo').exec();
    } else {
        //handle lancer flow
        acc = await Lancer.findById(id).exec();
        user = await User.find({ "lancer": acc}).populate('lancer').populate('photo').exec();
    }

    res.status(200).send(user[0])
})

userRouter.get("/projects/:id", async (req, res) => {
    const {id} = req.params;
    let acc = await Client.findById(id).exec();
    let user;
    let usersProjects = [];
    // handle client flow
    if (acc) {
        user = await User.find({ "client": acc }).populate('client').populate('photo').exec();
        usersProjects = await Project.find({"client": acc}).exec();
    } else {
        //handle lancer flow
        acc = await Lancer.findById(id).exec();
        user = await User.find({ "lancer": acc }).populate('lancer').populate('photo').exec();
        usersProjects = await Project.find({"lancer": acc}).exec();
    }

    res.status(200).send(usersProjects);
})
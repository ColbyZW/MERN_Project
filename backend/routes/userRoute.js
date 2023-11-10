import express from 'express';
export const userRouter = express.Router();
import { User } from '../models/User.js';
import { Lancer } from '../models/Lancer.js';
import { LancerAccount } from '../models/LancerAccount.js';
import { Client } from '../models/Client.js';
import { ClientAccount } from '../models/ClientAccount.js';
import { authHandler } from '../util.js';

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
    const {company} = req.body
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
    user.fullyRegistered = true;
    await user.save()

    res.status(200).send({"message": "Successfully created Lancer account"})
    return
})

// Route to create a new Client
userRouter.post('/client', async (req, res) => {
    const {company} = req.body
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

userRouter.get('/name', (req, res) => {
    res.status(200).send({"name": req.session.passport.user.name})
})

// Utility route to call on every page to ensure user is logged in
userRouter.get("/isLoggedIn", (req, res) => {
    res.status(200).send({"message": "User logged in"});
})

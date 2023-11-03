import express from 'express';
export const userRouter = express.Router();
import { User } from '../models/User.js';
import { Lancer } from '../models/Lancer.js';
import { Client } from '../models/Client.js';

userRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            res.status(400).send({"message": "Unknown Error Occurred"});
            return;
        }
        res.status(200).send({"message": "Successfully logged out!"});
    })
})

userRouter.post('/lancer', async (req, res) => {
    const {userId, company} = req.body
    const user = await User.findById(userId)

    if (user === null) {
        res.status(400).send({"message": "Unable to find account"})
        return
    }

    const lancer = new Lancer({
        company: company,
        enabled: true
    })
    await lancer.save()

    user.lancer = lancer._id;
    await user.save()

    res.status(200).send({"message": "Successfully created Lancer account"})
    return
})

userRouter.post('/client', async (req, res) => {
    const {userId, company} = req.body
    const user = await User.findById(userId)

    if (user === null) {
        res.status(400).send({"message": "Unable to find account"})
        return
    }

    const client = new Client({
        company: company,
        enabled: true
    })
    await client.save()

    user.client = client._id;
    await user.save()

    res.status(200).send({"message": "Successfully created Client account"})
    return
})
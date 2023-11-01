import express from 'express';
export const userRouter = express.Router();

userRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            res.status(400).send({"message": "Unknown Error Occurred"});
            return;
        }
        res.status(200).send({"message": "Successfully logged out!"});
    })
})

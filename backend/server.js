import express from 'express'
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth2'
import session from 'express-session'
import { userRouter } from './routes/userRoute.js';
import mongoose from 'mongoose'
import { User } from './models/User.js'

const app = express()
const port = 8000

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const callbackURL = process.env.CALLBACK_URL
const mongoURL = process.env.MONGO_URL

// Connect to the DB
main().catch(err => {
    console.log("Error connecting to DB");
    console.log(err)
})
async function main() {
    await mongoose.connect(mongoURL)
}

// Setup the OAUTH middleware
passport.use(new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: callbackURL,
    passReqToCallback: true
    },
    async function (request, accessToken, refreshToken, profile, done) {
        // We need to use this to create a new user in the database
        const userId = profile.id
        const userEmail = profile.email
        const userName = profile.displayName
        const user = new User({
            name: userName,
            userId: userId,
            email: userEmail
        })
        await user.save()

        // The second argument of done is the user from the database
        return done(null, user)
    }
))

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

// Set up the express middleware
app.use(session({
    secret: "supersecret",
}))
app.use(express.json())
app.use(express.urlencoded())
app.use(passport.initialize())
app.use(passport.authenticate('session'))

app.use("/user", userRouter)

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})

// Initial google auth route
app.get("/auth/google", 
    passport.authenticate('google', {scope: ['email', 'profile']})
)

// Callback to handle OAUTH Responses
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}))

app.get('/auth/google/success', (req, res) => {
    res.status(200).send("SUCCESS")
})

app.get('/auth/google/failure', (req, res) => {
    res.status(400).send("FAILURE")
})
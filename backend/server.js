import express from 'express'
import passport from 'passport'
import cors from 'cors'
import MongoStore from 'connect-mongo'
import GoogleStrategy from 'passport-google-oauth2'
import session from 'express-session'
import { userRouter } from './routes/userRoute.js';
import { projectRouter } from './routes/projectRoute.js'
import mongoose, {Schema} from 'mongoose'
import { User } from './models/User.js'
import fs from 'fs'

fs.readdirSync('./models').forEach((file) => {
    if (~file.indexOf('.js')) {
        import('./models/' + file)
    }
})

const app = express()
const port = 8000

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const callbackURL = process.env.CALLBACK_URL
const mongoURL = process.env.MONGO_URL
const redirectURL = process.env.REDIRECT_URL
const baseURL = process.env.BASE_URL

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
    async function verify(request, accessToken, refreshToken, profile, done) {
        // We need to use this to create a new user in the database
        const userId = profile.id
        const userEmail = profile.email
        const userName = profile.displayName
        let user = await User.findOne({googleId: userId});
        if (user === null) {
            console.log("No user found, making a new one")
            user = new User({
                name: userName,
                googleId: userId,
                email: userEmail
            })
            await user.save()
        }

        return done(null, user)
    }
))

passport.serializeUser((user, done) => {
    console.log("SERIALIZING")
    process.nextTick(() => {
        done(null, { id: user._id, email: user.email, name: user.name, registered: user.fullyRegistered })
    })
})

passport.deserializeUser((user, done) => {
    console.log("DESERIALIZING")
    process.nextTick(() => {
       done(null, user)
    })
})



// Set up the express middleware
app.use(session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoURL }),
}))
app.use(cors({
    credentials: true, 
    origin: baseURL,
    methods: "GET,POST,PUT,DELETE"
}))
app.use(express.json())
app.use(express.urlencoded())
app.use(passport.authenticate('session'))

// Initialize extra routes
app.use("/user", userRouter)
app.use("/project", projectRouter)


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
        failureRedirect: '/auth/google/failure',
        successRedirect: '/auth/google/success'
    }))

app.get('/auth/google/success', (req, res) => {
    if (req.session.passport.user.registered) {
        // If they are registered redirect them to the home screen
        res.status(301).redirect(redirectURL + "home")
    } else {
        // Otherwise we redirect them to the registration screen
        res.status(301).redirect(redirectURL + "register")
    }
})

app.get('/auth/google/failure', (req, res) => {
    res.status(400).send("FAILURE")
})
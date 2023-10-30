const express = require('express')
const app = express()
const postmark = require('postmark')
const crypto = require('crypto')
const port = 8000
const postmarkApiKey = process.env.POSTMARK_API
const postmarkEmail = process.env.POSTMARK_EMAIL

// Set up the express middleware
app.use(express.json())
app.use(express.urlencoded())

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})

app.post("/register", async (request, response) => {
    let postBody = request.body;

    // Generate a pseudorandom code to use for verification
    // We'll have to store this in the user profile object as well
    const randomCode = crypto.randomBytes(64).toString('hex').slice(0,6).toUpperCase();

    const emailTemplate = `\
    <div>\
        <h1>Welcome to Lancelot!</h1><br/>\
        <div>Please enter this code to verify your account on our website: ${randomCode}</div><br/>\
    </div>\
    `

    let client = new postmark.ServerClient(postmarkApiKey);
    let res = await client.sendEmail({
        "From": postmarkEmail,
        "To": postBody.email,
        "Subject": "Please Verify Your Email With Lancelot",
        "HtmlBody": emailTemplate,
        "MessageStream": "outbound"
    })

    if (res.ErrorCode === 0 && res.Message === "OK") {
        response.status(200).send({
            "message": "Account created, email sent for verification.",
        });
    } else {
        response.status(400).send({
            "message": "There was an issue creating the account, please try again."
        })
    }

})
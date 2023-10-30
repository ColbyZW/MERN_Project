# MERN_Project
COP4331 Large MERN Project

## Running the Project in Docker
Make sure you have Docker installed on your computer.  After that navigate into the project directory and run  
`docker-compose up`.  Once everything completes go to your browser and type in `localhost:3000`

## Environment Variables
We're going to use a remote MongoDB cluster so we have to pass that url into the server.  To do that go into the 
`.env-template` file and copy it over to a new file called `.env` and replace the `REPLACE ME` text with the URL 
for the MongoDB cluster.  
You'll need to make a PostMark account if you want to test the email API. Once you make an account you'll be given an API key, replace that in the `.env` file under `POSTMARK_API`. Also insert your email into the `.env` file under `POSTMARK_EMAIL`.
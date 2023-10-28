# MERN_Project
COP4331 Large MERN Project

## Running the Project in Docker
Make sure you have Docker installed on your computer.  After that navigate into the project directory and run  
`docker-compose up`.  Once everything completes go to your browser and type in `localhost:3000`

## Environment Variables
We're going to use a remote MongoDB cluster so we have to pass that url into the server.  To do that go into the 
`.env-template` file and copy it over to a new file called `.env` and replace the `REPLACE ME` text with the URL 
for the MongoDB cluster.
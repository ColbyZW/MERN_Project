import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import express from 'express'
export const testRouter = express.Router();

// Configure AWS with your access and secret key.
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1' // Choose the right region.
});

// Create an S3 instance that you will use for uploading the file.
const s3 = new AWS.S3();

// Set up the multer-s3 configuration.
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'freelancelot', // Replace with your bucket name.
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now().toString()}-${file.originalname}`);
    }
  })
});

// Create an API endpoint to handle the file upload.
testRouter.post('/upload', upload.single('photo'), function (req, res) {
  res.send({
    message: 'File uploaded successfully',
    data: req.file
  });
});
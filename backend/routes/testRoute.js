const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

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
    bucket: 'your-bucket-name', // Replace with your bucket name.
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now().toString()}-${file.originalname}`);
    }
  })
});

// Create an API endpoint to handle the file upload.
app.post('/upload', upload.single('file'), function (req, res) {
  res.send({
    message: 'File uploaded successfully',
    data: req.file
  });
});
const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const port = 3000;

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

// File Upload Configuration
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.static("public"));

// Upload File to S3
app.post("/upload", upload.single("file"), (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ fileUrl: data.Location });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

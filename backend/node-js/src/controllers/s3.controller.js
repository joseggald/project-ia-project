require("dotenv").config();
const aws = require("aws-sdk");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { findSession } = require("../services/auth.service");
const { findUserById } = require("../services/user.service");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const upload = multer({ storage: multer.memoryStorage() }).single("file");

exports.uploadPhoto = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({
        status: "Fail",
        message: "Error uploading rekognition photo",
      });
    }

    const file = req.file;
    const token = req.body.token;
    if (!file || !token) {
      return res.status(400).json({
        status: "Fail",
        message: "Did not receive file or token",
      });
    }

    // getting username from token for file name
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const foundSession = await findSession(decoded.id, token);

    if (!foundSession)
      return res.status(401).json({
        status: "Fail",
        message: "Invalid session",
      });

    const foundUser = await findUserById(foundSession.user_id);

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${foundUser.username}/fotos/${file.originalname}`,
      Body: file.buffer,
      ContentType: "image/jpeg",
    };

    try {
      s3.upload(params, (err, data) => {
        if (err) {
          return res.status(400).json({
            status: "Fail",
            message: err.message,
          });
        }
        res.status(201).json({
          status: "Success",
          url: data.Location,
        });
      });
    } catch (error) {
      res.status(400).json({
        status: "Fail",
        message: error.message,
      });
    }
  });
};

exports.uploadVideo = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
        return res.status(400).json({
            status: "Fail",
            message: "Error uploading rekognition video",
        });
        }
    
        const file = req.file;
        const token = req.body.token;
        if (!file || !token) {
        return res.status(400).json({
            status: "Fail",
            message: "Did not receive file or token",
        });
        }
    
        // getting username from token for file name
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foundSession = await findSession(decoded.id, token);
    
        if (!foundSession)
        return res.status(401).json({
            status: "Fail",
            message: "Invalid session",
        });
    
        const foundUser = await findUserById(foundSession.user_id);
    
        const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${foundUser.username}/videos/${file.originalname}`,
        Body: file.buffer,
        ContentType: "video/mp4",
        };
    
        try {
        s3.upload(params, (err, data) => {
            if (err) {
            return res.status(400).json({
                status: "Fail",
                message: err.message,
            });
            }
            res.status(201).json({
            status: "Success",
            url: data.Location,
            });
        });
        } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message,
        });
        }
    });
};

exports.uploadAudio = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
        return res.status(400).json({
            status: "Fail",
            message: "Error uploading rekognition audio",
        });
        }
    
        const file = req.file;
        const token = req.body.token;
        if (!file || !token) {
        return res.status(400).json({
            status: "Fail",
            message: "Did not receive file or token",
        });
        }
    
        // getting username from token for file name
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foundSession = await findSession(decoded.id, token);
    
        if (!foundSession)
        return res.status(401).json({
            status: "Fail",
            message: "Invalid session",
        });
    
        const foundUser = await findUserById(foundSession.user_id);

        const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${foundUser.username}/audios/${file.originalname}`,
        Body: file.buffer,
        ContentType: "audio/mp3",
        };
    
        try {
        s3.upload(params, (err, data) => {
            if (err) {
            return res.status(400).json({
                status: "Fail",
                message: err.message,
            });
            }
            res.status(201).json({
            status: "Success",
            url: data.Location,
            });
        });
        } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message,
        });
        }
    });
};

exports.uploadDocument = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
        return res.status(400).json({
            status: "Fail",
            message: "Error uploading rekognition document",
        });
        }
    
        const file = req.file;
        const token = req.body.token;
        if (!file || !token) {
        return res.status(400).json({
            status: "Fail",
            message: "Did not receive file or token",
        });
        }
    
        // getting username from token for file name
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foundSession = await findSession(decoded.id, token);
    
        if (!foundSession)
        return res.status(401).json({
            status: "Fail",
            message: "Invalid session",
        });
    
        const foundUser = await findUserById(foundSession.user_id);
        const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${foundUser.username}/documents/${file.originalname}`,
        Body: file.buffer,
        ContentType: "application/pdf",
        };
    
        try {
        s3.upload(params, (err, data) => {
            if (err) {
            return res.status(400).json({
                status: "Fail",
                message: err.message,
            });
            }
            res.status(201).json({
            status: "Success",
            url: data.Location,
            });
        });
        } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: error.message,
        });
        }
    });
}; 
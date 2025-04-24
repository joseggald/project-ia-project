import dotenv from 'dotenv';
import aws from 'aws-sdk';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { Request, Response } from 'express';
import { findSession } from '../services/auth.service';
import { findUserById } from '../services/user.service';

dotenv.config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

const upload = multer({ storage: multer.memoryStorage() }).single("file");

interface JwtPayload {
  id: number;
}

export const uploadPhoto = async (req: Request, res: Response): Promise<void> => {
  upload(req, res, async function (err: any) {
    if (err) {
      return res.status(400).json({
        status: "Fail",
        message: "Error uploading rekognition photo",
      });
    }

    const file = req.file as Express.Multer.File;
    const token = req.body.token;
    if (!file || !token) {
      return res.status(400).json({
        status: "Fail",
        message: "Did not receive file or token",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const foundSession = await findSession(decoded.id, token);

      if (!foundSession) {
        return res.status(401).json({
          status: "Fail",
          message: "Invalid session",
        });
      }

      const foundUser = await findUserById(foundSession.user_id);

      if (!foundUser) {
        return res.status(404).json({
          status: "Fail",
          message: "User not found",
        });
      }

      const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${foundUser.username}/fotos/${file.originalname}`,
        Body: file.buffer,
        ContentType: "image/jpeg",
      };

      s3.upload(params, (err: Error, data: aws.S3.ManagedUpload.SendData) => {
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
    } catch (error: any) {
      res.status(400).json({
        status: "Fail",
        message: error.message,
      });
    }
  });
};

export const uploadVideo = async (req: Request, res: Response): Promise<void> => {
  upload(req, res, async function (err: any) {
    if (err) {
      return res.status(400).json({
        status: "Fail",
        message: "Error uploading rekognition video",
      });
    }

    const file = req.file as Express.Multer.File;
    const token = req.body.token;
    if (!file || !token) {
      return res.status(400).json({
        status: "Fail",
        message: "Did not receive file or token",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const foundSession = await findSession(decoded.id, token);

      if (!foundSession) {
        return res.status(401).json({
          status: "Fail",
          message: "Invalid session",
        });
      }

      const foundUser = await findUserById(foundSession.user_id);

      if (!foundUser) {
        return res.status(404).json({
          status: "Fail",
          message: "User not found",
        });
      }

      const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${foundUser.username}/videos/${file.originalname}`,
        Body: file.buffer,
        ContentType: "video/mp4",
      };

      s3.upload(params, (err: Error, data: aws.S3.ManagedUpload.SendData) => {
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
    } catch (error: any) {
      res.status(400).json({
        status: "Fail",
        message: error.message,
      });
    }
  });
};

export const uploadAudio = async (req: Request, res: Response): Promise<void> => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({
        status: "Fail",
        message: "Error uploading rekognition audio",
      });
    }

    const file = req.file as Express.Multer.File;
    const token = req.body.token;
    if (!file || !token) {
      return res.status(400).json({
        status: "Fail",
        message: "Did not receive file or token",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const foundSession = await findSession(decoded.id, token);

      if (!foundSession) {
        return res.status(401).json({
          status: "Fail",
          message: "Invalid session",
        });
      }

      const foundUser = await findUserById(foundSession.user_id);

      if (!foundUser) {
        return res.status(404).json({
          status: "Fail",
          message: "User not found",
        });
      }

      const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${foundUser.username}/audios/${file.originalname}`,
        Body: file.buffer,
        ContentType: "audio/mp3",
      };

      s3.upload(params, (err: Error, data: aws.S3.ManagedUpload.SendData) => {
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
    } catch (error: any) {
      res.status(400).json({
        status: "Fail",
        message: error.message,
      });
    }
  });
};

export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({
        status: "Fail",
        message: "Error uploading rekognition document",
      });
    }

    const file = req.file as Express.Multer.File;
    const token = req.body.token;
    if (!file || !token) {
      return res.status(400).json({
        status: "Fail",
        message: "Did not receive file or token",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const foundSession = await findSession(decoded.id, token);

      if (!foundSession) {
        return res.status(401).json({
          status: "Fail",
          message: "Invalid session",
        });
      }

      const foundUser = await findUserById(foundSession.user_id);

      if (!foundUser) {
        return res.status(404).json({
          status: "Fail",
          message: "User not found",
        });
      }

      const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${foundUser.username}/documents/${file.originalname}`,
        Body: file.buffer,
        ContentType: "application/pdf",
      };

      s3.upload(params, (err: Error, data: aws.S3.ManagedUpload.SendData) => {
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
    } catch (error: any) {
      res.status(400).json({
        status: "Fail",
        message: error.message,
      });
    }
  });
};
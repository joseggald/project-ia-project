import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import {
  createFile,
  findFileById,
  findAllFilesByUserId,
  findFilesByUserIdAndFileType,
  deleteFileById,
} from '../services/file.service';
import { findSession } from '../services/auth.service';
import { findUserById } from '../services/user.service';

interface JwtPayload {
  id: number;
}

export const createFileController = async (req: Request, res: Response): Promise<void> => {
  const { token, file_name, file_type, s3_path } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const foundSession = await findSession(decoded.id, token);

    const foundUser = await findUserById(foundSession.user_id);

    if (foundUser) {
      const file = await createFile(foundUser.id, file_name, file_type, s3_path, new Date());
      res.status(201).json({ message: 'File created successfully', file });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getFileByIdController = async (req: Request, res: Response): Promise<void> => {
  const { fileId } = req.body;

  try {
    const file = await findFileById(fileId);
    if (file) {
      res.status(200).json({ file });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getFilesByUserIdController = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const foundSession = await findSession(decoded.id, token);
    const userId = foundSession.user_id;
    const files = await findAllFilesByUserId(userId);
    res.status(200).json({ files });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getFilesByUserIdAndFileTypeController = async (req: Request, res: Response): Promise<void> => {
  const { token, fileType } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const foundSession = await findSession(decoded.id, token);
    const userId = foundSession.user_id;
    const files = await findFilesByUserIdAndFileType(userId, fileType);

    res.status(200).json({ files });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteFileByIdController = async (req: Request, res: Response): Promise<void> => {
  const { fileId } = req.body;
  try {
    const file = await deleteFileById(fileId);
    res.status(200).json({ message: 'File deleted successfully', file });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

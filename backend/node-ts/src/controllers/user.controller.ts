import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { findUserById } from '../services/user.service';

export const getUserByToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, email: string, cognito_id: string };
    const user = await findUserById(Number(decoded.id));
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

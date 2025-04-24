import { pool } from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

interface User {
    id: number;
    name: string;
    last_name: string;
    username: string;
    email: string;
    cognito_id: string;
}

export const findUserById = async (id: number): Promise<User | null> => {
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [id];
  
    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null; 
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching user by ID: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  };

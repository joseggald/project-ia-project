import jwt from 'jsonwebtoken';
import { pool } from '../config/db'; // Importamos el pool desde db
import bcrypt from 'bcrypt';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { QueryResult } from 'pg';

dotenv.config();

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});

interface User {
  id: number;
  name: string;
  last_name: string;
  username: string;
  email: string;
  cognito_id: string;
}

interface Session {
  id: number;
  user_id: number;
  token: string;
  created_at: Date;
}

export const createSession = async (userId: number, token: string): Promise<Session> => {
  const query = `
    INSERT INTO user_sessions (user_id, token)
    VALUES ($1, $2)
    RETURNING id, user_id, token, created_at
  `;
  const values = [userId, token];

  try {
    const result: QueryResult = await pool.query(query, values);
    return result.rows[0] as Session;
  } catch (error: any) {
    throw new Error('Error creating session: ' + error.message);
  }
};

export const findSession = async (userId: number, token: string): Promise<Session> => {
  const query = `
    SELECT *
    FROM user_sessions
    WHERE user_id = $1 AND token = $2
  `;
  const values = [userId, token];

  try {
    const result: QueryResult = await pool.query(query, values);
    return result.rows[0] as Session;
  } catch (error: any) {
    throw new Error('Error finding session: ' + error.message);
  }
};

export const registerUser = async (
  name: string,
  last_name: string,
  username: string,
  email: string,
  password: string
): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const cognitoParams = {
    ClientId: process.env.COGNITO_APP_CLIENT_ID!,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  };

  try {
    const cognitoResult = await cognito.signUp(cognitoParams).promise();
    const cognitoId = cognitoResult.UserSub;

    const query = `
      INSERT INTO users (name, last_name, username, email, password, cognito_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, last_name, username, email, cognito_id
    `;
    const values = [name, last_name, username, email, hashedPassword, cognitoId];
    const result: QueryResult = await pool.query(query, values);

    return result.rows[0] as User;
  } catch (error: any) {
    throw new Error(`Error registering user: ${error.message}`);
  }
};

export const loginUser = async (username: string, password: string): Promise<{ token: string; session: Session }> => {
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.COGNITO_APP_CLIENT_ID!,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const authResult = await cognito.initiateAuth(params).promise();

    const userQuery = 'SELECT id, email, username, cognito_id FROM users WHERE username = $1';
    const userResult: QueryResult = await pool.query(userQuery, [username]);

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = userResult.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, cognito_id: user.cognito_id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    const session = await createSession(user.id, token);

    return { token, session };
  } catch (error: any) {
    throw new Error(`Error logging in user: ${error.message}`);
  }
};

export const verifySessionService = async (token: string): Promise<{ message: string}> => {
  try {
    const sessionQuery = 'SELECT * FROM user_sessions WHERE token = $1';
    const sessionResult: QueryResult = await pool.query(sessionQuery, [token]);

    if (sessionResult.rows.length === 0) {
      throw new Error('Session not found');
    }
    return { message: 'Session verified' };
  } catch (error: any) {
    throw new Error(`Error verifying session: ${error.message}`);
  }
};

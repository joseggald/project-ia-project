  import { Request, Response } from 'express';
  import { registerUser, loginUser } from '../services/auth.service';
  import { verifySessionService } from '../services/auth.service';
  import AWS from 'aws-sdk';

  const cognito = new AWS.CognitoIdentityServiceProvider({
    region: process.env.AWS_REGION,
  });

  export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
      const { token } = await loginUser(username, password);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, last_name, username, email, password } = req.body;
    try {
      const newUser = await registerUser(name, last_name, username, email, password);
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  export const confirmUser = async (req: Request, res: Response): Promise<void> => {
    const { username, confirmationCode } = req.body;

    const confirmParams: AWS.CognitoIdentityServiceProvider.ConfirmSignUpRequest = {
      ClientId: process.env.COGNITO_APP_CLIENT_ID!,
      Username: username,
      ConfirmationCode: confirmationCode,
    };

    try {
      await cognito.confirmSignUp(confirmParams).promise();
      res.status(200).json({ message: 'User confirmed successfully!' });
    } catch (error: any) {
      res.status(400).json({ error: `Error confirming user: ${error.message}` });
    }
  };

  export const verifySession = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;
    try {
      const session = await verifySessionService(token);
      res.status(200).json({ message: 'Session verified' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

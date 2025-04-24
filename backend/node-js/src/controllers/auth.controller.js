const { registerUser } = require('../services/auth.service');
const { loginUser, verifySessionService} = require('../services/auth.service');
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider({ region: process.env.AWS_REGION });

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { token } = await loginUser(username, password);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  const { name, last_name, username, email, password } = req.body;

  try {
    const newUser = await registerUser(name, last_name, username, email, password);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.confirmUser = async (req, res) => {
  const { username, confirmationCode } = req.body;

  const confirmParams = {
    ClientId: process.env.COGNITO_APP_CLIENT_ID,
    Username: username,
    ConfirmationCode: confirmationCode
  };

  try {
    await cognito.confirmSignUp(confirmParams).promise();
    res.status(200).json({ message: 'User confirmed successfully!' });
  } catch (error) {
    res.status(400).json({ error: `Error confirming user: ${error.message}` });
  }
};

exports.verifySession = async (req, res) => {
  const { token } = req.body;
  try {
    await verifySessionService(token);
    res.status(200).json({ message: 'Session verified' });
  } catch (error) {
    res.status(400).json({ error: `Error verifying session: ${error.message}` });
  }
}
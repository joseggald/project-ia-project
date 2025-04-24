const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const bcrypt = require("bcrypt");
const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});

// Crear una nueva sesión
const createSession = async (userId, token) => {
  const query = `
    INSERT INTO user_sessions (user_id, token)
    VALUES ($1, $2)
    RETURNING id, user_id, token, created_at
  `;
  const values = [userId, token];

  try {
    const result = await pool.query(query, values); // Usamos pool.query
    return result.rows[0];
  } catch (error) {
    throw new Error("Error creating session: " + error.message);
  }
};

// buscar sesion
const findSession = async (userId, token) => {
  const query = "SELECT * FROM user_sessions WHERE user_id = $1 AND token = $2";
  const values = [userId, token];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

// Registro de usuarios
const registerUser = async (name, last_name, username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const cognitoParams = {
    ClientId: process.env.COGNITO_APP_CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
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
    const values = [
      name,
      last_name,
      username,
      email,
      hashedPassword,
      cognitoId,
    ];
    const result = await pool.query(query, values); // Usamos pool.query

    return result.rows[0];
  } catch (error) {
    throw new Error(`Error registering user: ${error.message}`);
  }
};

// Inicio de sesión
const loginUser = async (username, password) => {
  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_APP_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const authResult = await cognito.initiateAuth(params).promise();

    const userQuery =
      "SELECT id, email, username ,cognito_id FROM users WHERE username = $1";
    const userResult = await pool.query(userQuery, [username]); // Usamos pool.query

    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = userResult.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, cognito_id: user.cognito_id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const session = await createSession(user.id, token);

    return { token, session };
  } catch (error) {
    throw new Error(`Error logging in user: ${error.message}`);
  }
};

const verifySessionService = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await findSession(decoded.id, token);

    if (!session) {
      throw new Error("Session not found");
    }

    return true;
  } catch (error) {
    throw new Error(`Error verifying session: ${error.message}`);
  }
}

module.exports = { registerUser, loginUser, findSession, verifySessionService };

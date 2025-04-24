const { pool } = require("../config/db");
const dotenv = require("dotenv");

dotenv.config();

// find user by id
const findUserById = async (id) => {
  const query = "SELECT * FROM users WHERE id = $1";
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};


module.exports = { findUserById };
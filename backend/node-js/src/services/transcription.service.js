const { pool } = require("../config/db");
const dotenv = require("dotenv");

dotenv.config();

// find transcription by id
exports.findTranscriptionById = async (id) => {
  const query = "SELECT * FROM transcriptions WHERE id = $1";
  const values = [id];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

// find transcription by file id
exports.findTranscriptionByFileId = async (fileId) => {
  const query = "SELECT * FROM transcriptions WHERE file_id = $1";
  const values = [fileId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

exports.createTranscription = async (fileId, content, language) => {
    const query = `INSERT INTO transcriptions (file_id, content, language, created_at) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [fileId, content, language, new Date()];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(error);
    }
};


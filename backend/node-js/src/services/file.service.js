const { pool } = require("../config/db");

exports.createFile = async (user_id, file_name, file_type, s3_path, uploaded_at) => {
  const query = "INSERT INTO files (user_id, file_name, file_type, s3_path, uploaded_at) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const values = [user_id, file_name, file_type, s3_path, uploaded_at];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
}

exports.getFile = async (fileId) => {
  const query = "SELECT * FROM files WHERE id = $1";
  const values = [fileId];

  try {
    const result = await pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

exports.findFileById = async (fileId) => {
  const query = `
    SELECT f.*, t.id AS transcription_id, t.content AS transcription_content, t.language AS transcription_language 
    FROM files AS f 
    INNER JOIN transcriptions AS t ON t.file_id = f.id  
    WHERE f.id = $1`;
  const values = [fileId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
    } catch (error) {
    throw new Error(error);
    }
}

exports.findAllFilesByUserId = async (userId) => {
  const query = `
    SELECT f.*, t.id AS transcription_id, t.content AS transcription_content, t.language AS transcription_language
    FROM files AS f
    LEFT JOIN transcriptions AS t ON t.file_id = f.id
    WHERE f.user_id = $1`;
  const values = [userId];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw new Error(error);
  }
}

exports.findFilesByUserIdAndFileType = async (userId, fileType) => {
  const query = `
    SELECT f.*, t.id AS transcription_id, t.content AS transcription_content, t.language AS transcription_language
    FROM files AS f
    LEFT JOIN transcriptions AS t ON t.file_id = f.id
    WHERE f.user_id = $1 AND f.file_type = $2`;
  const values = [userId, fileType];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw new Error(error);
  }
}

exports.deleteFileById = async (fileId) => {
  const query = "DELETE FROM files WHERE id = $1";
  const values = [fileId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
    }
    catch (error) {
    throw new Error(error);
    }
}


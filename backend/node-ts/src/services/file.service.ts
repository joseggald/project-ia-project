import { pool } from '../config/db';

interface File {
  id: number;
  user_id: number;
  file_name: string;
  file_type: string;
  s3_path: string;
  uploaded_at: Date;
}

export const createFile = async (
  user_id: number,
  file_name: string,
  file_type: string,
  s3_path: string,
  uploaded_at: Date
): Promise<File> => {
  const query = `
    INSERT INTO files (user_id, file_name, file_type, s3_path, uploaded_at) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *`;
  const values = [user_id, file_name, file_type, s3_path, uploaded_at];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error: any) {
    throw new Error(`Error inserting file: ${error.message}`);
  }
};

export const findFileById = async (fileId: number): Promise<File | null> => {
  const query = `
    SELECT f.*, t.id AS transcription_id, t.content AS transcription_content, t.language AS transcription_language 
    FROM files AS f 
    INNER JOIN transcriptions AS t ON t.file_id = f.id  
    WHERE f.id = $1`;
  const values = [fileId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error: any) {
    throw new Error(`Error finding file by ID: ${error.message}`);
  }
};

export const getFile = async (fileId: number): Promise<File | null> => {
  const query = "SELECT * FROM files WHERE id = $1";
  const values = [fileId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }catch (error: any) {
    throw new Error(`Error finding file by ID: ${error.message}`);
  }
};

export const findAllFilesByUserId = async (userId: number): Promise<File[]> => {
  const query = `
    SELECT f.*, t.id AS transcription_id, t.content AS transcription_content, t.language AS transcription_language
    FROM files AS f
    LEFT JOIN transcriptions AS t ON t.file_id = f.id
    WHERE f.user_id = $1`;
  const values = [userId];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error: any) {
    throw new Error(`Error finding files by user ID: ${error.message}`);
  }
};

export const findFilesByUserIdAndFileType = async (
  userId: number,
  fileType: string
): Promise<File[]> => {
  const query = `
    SELECT f.*, t.id AS transcription_id, t.content AS transcription_content, t.language AS transcription_language
    FROM files AS f
    LEFT JOIN transcriptions AS t ON t.file_id = f.id
    WHERE f.user_id = $1 AND f.file_type = $2`;
  const values = [userId, fileType];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error: any) {
    throw new Error(`Error finding files by user ID and file type: ${error.message}`);
  }
};

export const deleteFileById = async (fileId: number): Promise<void> => {
  const query = "DELETE FROM files WHERE id = $1";
  const values = [fileId];

  try {
    await pool.query(query, values);
  } catch (error: any) {
    throw new Error(`Error deleting file by ID: ${error.message}`);
  }
};

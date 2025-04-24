const { pool } = require("../config/db");
const dotenv = require("dotenv");

dotenv.config();

exports.getTranslationTranscription = async (id) => {
    const query = `SELECT * FROM translations WHERE transcription_id = $1`;
    const values = [id];
    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error(error);
    }
}

exports.createTranslation = async (transcription_id, translated_content, target_language) => {
    const query = `INSERT INTO translations (transcription_id, translated_content, target_language, created_at) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [transcription_id, translated_content, target_language, new Date()];

    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error(error);
    }
};
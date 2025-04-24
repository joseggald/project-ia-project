const { pool } = require("../config/db");

exports.createPolly = async (transcription_id, audio_file, voice) => {
    const query = "INSERT INTO audio_readings (transcription_id, audio_file, voice, created_at) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [transcription_id, audio_file, voice, new Date()];
    
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(error);
    }
}

exports.getAudiosByTranscriptionId = async (transcription_id) => {
    const query = "SELECT * FROM audio_readings WHERE transcription_id = $1";
    const values = [transcription_id];

    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error(error);
    }
}
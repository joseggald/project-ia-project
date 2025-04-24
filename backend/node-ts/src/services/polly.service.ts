import { pool } from "../config/db";

// Definición de la interfaz para el resultado de la inserción
interface AudioReading {
    id: number;
    transcription_id: number;
    audio_file: string;
    voice: string;
    created_at: Date;
}

export const createPolly = async (
    transcription_id: number,
    audio_file: string,
    voice: string
): Promise<AudioReading> => {
    const query = "INSERT INTO audio_readings (transcription_id, audio_file, voice, created_at) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [transcription_id, audio_file, voice, new Date()];

    try {
        const result = await pool.query(query, values);
        return result.rows[0] as AudioReading;
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const getAudioReadingsByTranscriptionId = async (
    transcription_id: number
): Promise<AudioReading[]> => {
    const query = "SELECT * FROM audio_readings WHERE transcription_id = $1";
    const values = [transcription_id];

    try {
        const result = await pool.query(query, values);
        return result.rows as AudioReading[];
    } catch (error) {
        throw new Error((error as Error).message);
    }
};
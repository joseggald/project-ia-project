import { pool } from "../config/db";
import * as dotenv from "dotenv";

dotenv.config();

// Define los tipos para las transcripciones
interface Transcription {
    id: number;
    file_id: number;
    content: string;
    language: string;
    created_at: Date;
}

// Encuentra la transcripción por id
export const findTranscriptionById = async (id: number): Promise<Transcription | null> => {
    const query = "SELECT * FROM transcriptions WHERE id = $1";
    const values = [id];

    try {
        const result = await pool.query(query, values);
        return result.rows[0] || null; // Retorna null si no se encuentra
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

// Encuentra la transcripción por id de archivo
export const findTranscriptionByFileId = async (fileId: number): Promise<Transcription | null> => {
    const query = "SELECT * FROM transcriptions WHERE file_id = $1";
    const values = [fileId];

    try {
        const result = await pool.query(query, values);
        return result.rows[0] || null; // Retorna null si no se encuentra
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

// Crea una nueva transcripción
export const createTranscription = async (
    fileId: number,
    content: string,
    language: string
): Promise<Transcription> => {
    const query = `INSERT INTO transcriptions (file_id, content, language, created_at) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [fileId, content, language, new Date()];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

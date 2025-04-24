import { pool } from "../config/db"; // Asegúrate de que este módulo exporte 'pool'
import * as dotenv from "dotenv";

dotenv.config();

export const findTranslationsByFileId = async (
    transcription_id: number // Cambia el tipo según sea necesario
): Promise<any[]> => { // Cambia 'any[]' por el tipo de retorno adecuado
    const query = `SELECT * FROM translations WHERE transcription_id = $1`;
    const values = [transcription_id];

    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error((error as Error).message); // Asegúrate de que el error tenga el tipo correcto
    }
};

export const createTranslation = async (
    transcription_id: number,          // Cambia el tipo según sea necesario
    translated_content: string,
    target_language: string
): Promise<any> => { // Cambia 'any' por el tipo de retorno adecuado
    const query = `INSERT INTO translations (transcription_id, translated_content, target_language, created_at) VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [transcription_id, translated_content, target_language, new Date()];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error((error as Error).message); // Asegúrate de que el error tenga el tipo correcto
    }
};

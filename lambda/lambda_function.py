import openai
import os
import boto3
import urllib.parse
import json
import logging

# Configura el logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

openai.api_key = ""
s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        # Asegúrate de que 's3_url' está presente en el evento
        s3_url = event.get('s3_url')
        if not s3_url:
            raise ValueError("El evento no contiene el campo 's3_url'")

        # Parsear la URL de S3
        parsed_url = urllib.parse.urlparse(s3_url)
        bucket_name = parsed_url.netloc.split('.')[0]
        object_key = urllib.parse.unquote(parsed_url.path.lstrip('/'))

        # Ruta temporal para el archivo descargado
        download_path = f"/tmp/{object_key.split('/')[-1]}"

        # Descargar el archivo de S3
        s3.download_file(bucket_name, object_key, download_path)
        logger.info(f"Archivo descargado desde S3: {download_path}")

        # Llamada a OpenAI para traducir el audio
        with open(download_path, "rb") as audio_file:
            transcript_response = openai.Audio.translate(
                file=audio_file,
                model="whisper-1",
                response_format="text"
            )

        # Registrar la transcripción en los logs
        logger.info(f"Respuesta de OpenAI: {transcript_response}")

        # Retornar la respuesta como JSON (no como string escapado)
        return {
            'statusCode': 200,
            'body': {'transcription': transcript_response}
        }

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': {'error': str(e)}
        }
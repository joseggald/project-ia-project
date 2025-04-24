import openai
import os
import boto3
import urllib.parse
import logging

# Configura el logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Inicializa la API Key de OpenAI como variable de entorno
openai.api_key = ""

# Cliente de S3
s3 = boto3.client('s3')

def lambda_handler(event, context):
    try:
        # Asegúrate de que 's3_url' está presente en el evento
        s3_url = event.get('s3_url')
        if not s3_url:
            raise ValueError("El evento no contiene el campo 's3_url'.")

        # Parsear la URL de S3 para obtener bucket y objeto
        parsed_url = urllib.parse.urlparse(s3_url)
        bucket_name = parsed_url.netloc.split('.')[0]
        object_key = urllib.parse.unquote(parsed_url.path.lstrip('/'))

        # Ruta temporal en Lambda para guardar el archivo descargado
        download_path = f"/tmp/{object_key.split('/')[-1]}"

        # Descargar el archivo .txt de S3
        s3.download_file(bucket_name, object_key, download_path)
        logger.info(f"Archivo descargado desde S3: {download_path}")

        # Leer el contenido del archivo .txt
        with open(download_path, "r", encoding="utf-8") as file:
            content = file.read()

        logger.info(f"Contenido del archivo: {content[:100]}...")  # Log parcial del contenido

        # Llamada a OpenAI para resumir el texto
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "Eres un asistente que resume textos largos en español de manera breve y clara y me dices opinion con resumen del texto."
                },
                {
                    "role": "user",
                    "content": f"Por favor, resume este texto y explicalo de forma breve: {content}"
                }
            ],
            temperature=0.7,
            max_tokens=100
        )

        # Extraer el resumen de la respuesta
        summary = response.choices[0].message["content"].strip()
        logger.info(f"Resumen generado: {summary}")

        # Retornar el resumen
        return {
            'statusCode': 200,
            'body': {'summary': summary}
        }

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': {'error': str(e)}
        }

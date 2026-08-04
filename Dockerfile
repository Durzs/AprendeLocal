# Imagen de la API (FastAPI). Railway la detecta automáticamente.
FROM python:3.12-slim

WORKDIR /app

# Se instalan solo las dependencias de runtime (ver requirements-api.txt).
COPY requirements-api.txt .
RUN pip install --no-cache-dir -r requirements-api.txt

COPY src/ ./src/

# Railway inyecta PORT; 8000 es el valor por defecto en local.
ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn src.api.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

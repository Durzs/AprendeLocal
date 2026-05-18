import os
from pathlib import Path
from dotenv import load_dotenv

# Cargar .env desde la raíz del proyecto
_ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(_ENV_FILE, override=True)


class Settings:
    """Configuración cargada desde variables de entorno (.env)."""

    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.supabase_key = os.getenv("SUPABASE_KEY", "")
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY", "")
        self.database_url = os.getenv("DATABASE_URL", "")
        self.redis_url = os.getenv("REDIS_URL", "")


settings = Settings()

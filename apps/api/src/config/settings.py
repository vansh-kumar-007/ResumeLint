from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "ResumeLint API"
    debug: bool = True
    database_url: str = "sqlite+aiosqlite:///./resumelint.db"
    storage_root: str = "./storage/uploads"
    max_upload_size_bytes: int = 5 * 1024 * 1024

    groq_api_key: str | None = None
    groq_model: str = "llama-3.3-70b-versatile"
    openrouter_api_key: str | None = None
    openrouter_model: str = "meta-llama/llama-3.3-70b-instruct:free"

    class Config:
        env_file = ".env"


settings = Settings()
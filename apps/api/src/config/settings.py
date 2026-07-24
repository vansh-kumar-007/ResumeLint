from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "ResumeLint API"
    debug: bool = True
    database_url: str = "sqlite+aiosqlite:///./resumelint.db"
    storage_root: str = "./storage/uploads"
    max_upload_size_bytes: int = 5 * 1024 * 1024  # 5 MB

    class Config:
        env_file = ".env"


settings = Settings()
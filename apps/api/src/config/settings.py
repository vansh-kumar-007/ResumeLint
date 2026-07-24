from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "ResumeLint API"
    debug: bool = True
    database_url: str = "sqlite+aiosqlite:///./resumelint.db"

    class Config:
        env_file = ".env"


settings = Settings()
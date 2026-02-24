from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "RegIntel API"
    api_prefix: str = "/api"
    cors_origins: str = "http://localhost:5173"
    max_upload_mb: int = 20
    storage_dir: str = "./storage/uploads"

    model_config = SettingsConfigDict(
        env_file="backend/.env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()

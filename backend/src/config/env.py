from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    PORT: int = 8000
    JWT_SECRET: str
    DB_CONNECT_TIMEOUT: int = 5

    class Config:
        env_file = ".env"


settings = Settings()

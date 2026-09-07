from urllib.parse import quote_plus

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str | None = None
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "airbnb_db"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "postgres"
    PORT: int = 8000
    JWT_SECRET: str
    DB_CONNECT_TIMEOUT: int = 5

    class Config:
        env_file = ".env"

    @property
    def database_url(self) -> str:
        """Usa DATABASE_URL si existe; si no, compone una URL segura desde DB_* ."""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql://{quote_plus(self.DB_USER)}:{quote_plus(self.DB_PASSWORD)}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


settings = Settings()

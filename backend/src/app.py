import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from src.middlewares.error_middleware import app_error_handler
from src.routers import (
    auth_router,
    user_router,
    pasajero_router,
    conductores_router,
    propiedad_router,
    airbnb_router,
)
from src.utils.errors import AppError
from src.db.connection import Base, engine


app = FastAPI(title="Initial Structure API")
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_exception_handler(AppError, app_error_handler)


@app.on_event("startup")
def ensure_database_schema() -> None:
    """Crea tablas nuevas y actualiza columnas requeridas en instalaciones previas."""
    try:
        Base.metadata.create_all(bind=engine)
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)"))
            connection.execute(
                text(
                    "UPDATE usuarios SET password_hash = :password_hash "
                    "WHERE password_hash IS NULL OR password_hash = :invalid_legacy_hash"
                ),
                # Hash bcrypt de la clave de demostración "password123". La
                # segunda condición repara el valor de transición inválido que
                # pudo haberse aplicado en una versión anterior del proyecto.
                {
                    "password_hash": "$2b$12$DC18nKHQgDt3OXzcoN/C.OpsWH2.awkyRKCoPE/CHkq0/3C.7te3i",
                    "invalid_legacy_hash": "$2b$12$SXZ9OpjT6Kcn5iSu0PC3DO57V5Y8wEwCz3Kq2rZUpFjuY7mSl4W3K",
                },
            )
            connection.execute(text("ALTER TABLE usuarios ALTER COLUMN password_hash SET NOT NULL"))
            # Instalaciones previas pueden haber creado propiedades antes de que
            # estos dos campos formaran parte del modelo de publicación.
            connection.execute(text("ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS descripcion VARCHAR(1000)"))
            connection.execute(text("ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS imagen_url VARCHAR(500)"))
    except OperationalError:
        # La aplicación mantiene /health y devuelve 503 en rutas de datos.
        logger.warning("PostgreSQL no está disponible durante el arranque.")


@app.exception_handler(OperationalError)
async def database_unavailable_handler(request, exc):
    return JSONResponse(
        status_code=503,
        content={"detail": "La base de datos no está disponible. Verificá PostgreSQL y DATABASE_URL."},
    )


app.include_router(airbnb_router.router, prefix="/api")
app.include_router(user_router.router, prefix="/api")
app.include_router(auth_router.router, prefix="/api")
app.include_router(pasajero_router.router, prefix="/api")
app.include_router(conductores_router.router, prefix="/api")
app.include_router(propiedad_router.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}

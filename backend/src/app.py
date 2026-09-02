from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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


app = FastAPI(title="Initial Structure API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_exception_handler(AppError, app_error_handler)


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

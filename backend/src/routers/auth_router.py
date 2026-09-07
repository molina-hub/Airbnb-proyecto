from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from fastapi import HTTPException, status

from src.db.connection import get_db
from src.dtos.auth_dto import LoginDTO, TokenDTO
from src.schemas.auth_schema import LoginSchema, TokenSchema
from src.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenSchema)
def login(payload: LoginSchema, db: Session = Depends(get_db)):
    try:
        dto = LoginDTO(**payload.model_dump())
        token: TokenDTO = AuthService(db).login(dto)
        return TokenSchema(**token.model_dump())
    except OperationalError:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="No se pudo conectar a la base de datos. Intentá nuevamente.")

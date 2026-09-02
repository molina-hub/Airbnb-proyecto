from datetime import datetime

from pydantic import BaseModel, EmailStr


class CreateUserDTO(BaseModel):
    email: EmailStr
    nombre: str
    es_anfitrion: bool = False
    password: str


class UpdateUserDTO(BaseModel):
    email: EmailStr | None = None
    nombre: str | None = None
    es_anfitrion: bool | None = None


class UserResponseDTO(BaseModel):
    id: int
    email: EmailStr
    nombre: str
    fecha_registro: datetime
    es_anfitrion: bool

    model_config = {"from_attributes": True}

from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class CreatePropiedadDTO(BaseModel):
    titulo: str
    direccion: str
    ciudad: str
    precio_noche: Decimal
    capacidad: int
    anfitrion_id: int


class UpdatePropiedadDTO(BaseModel):
    titulo: str | None = None
    direccion: str | None = None
    ciudad: str | None = None
    precio_noche: Decimal | None = None
    capacidad: int | None = None


class PropiedadResponseDTO(BaseModel):
    id: int
    titulo: str
    direccion: str
    ciudad: str
    precio_noche: Decimal
    capacidad: int
    anfitrion_id: int

    model_config = ConfigDict(from_attributes=True)
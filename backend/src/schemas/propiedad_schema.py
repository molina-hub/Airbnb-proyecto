from decimal import Decimal

from pydantic import BaseModel, Field


class CreatePropiedadSchema(BaseModel):
    titulo: str = Field(min_length=1, max_length=150)
    direccion: str = Field(min_length=1, max_length=200)
    ciudad: str = Field(min_length=1, max_length=100)
    precio_noche: Decimal = Field(gt=0)
    capacidad: int = Field(gt=0)
    anfitrion_id: int = Field(gt=0)


class UpdatePropiedadSchema(BaseModel):
    titulo: str | None = Field(default=None, min_length=1, max_length=150)
    direccion: str | None = Field(default=None, min_length=1, max_length=200)
    ciudad: str | None = Field(default=None, min_length=1, max_length=100)
    precio_noche: Decimal | None = Field(default=None, gt=0)
    capacidad: int | None = Field(default=None, gt=0)
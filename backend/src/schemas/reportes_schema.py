from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field


class DiaDisponibilidadSchema(BaseModel):
    fecha: date
    estado: str = Field(pattern="^(libre|ocupado)$")


class DisponibilidadSchema(BaseModel):
    propiedad_id: int
    mes: str
    dias: list[DiaDisponibilidadSchema]


class IngresoPropiedadSchema(BaseModel):
    propiedad_id: int
    titulo: str
    total_facturado: Decimal
    cantidad_reservas: int


class IngresosAnfitrionSchema(BaseModel):
    anfitrion_id: int
    desde: date
    hasta: date
    total_facturado: Decimal
    detalle: list[IngresoPropiedadSchema]


class PropiedadTopSchema(BaseModel):
    id: int
    titulo: str
    ciudad: str
    precio_noche: Decimal
    promedio: Decimal
    cantidad_resenas: int

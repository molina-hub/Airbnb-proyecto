from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class DiaDisponibilidadDTO(BaseModel):
    fecha: date
    estado: str


class DisponibilidadDTO(BaseModel):
    propiedad_id: int
    mes: str
    dias: list[DiaDisponibilidadDTO]


class IngresoPropiedadDTO(BaseModel):
    propiedad_id: int
    titulo: str
    total_facturado: Decimal
    cantidad_reservas: int


class IngresosAnfitrionDTO(BaseModel):
    anfitrion_id: int
    desde: date
    hasta: date
    total_facturado: Decimal
    detalle: list[IngresoPropiedadDTO]


class PropiedadTopDTO(BaseModel):
    id: int
    titulo: str
    ciudad: str
    precio_noche: Decimal
    promedio: Decimal
    cantidad_resenas: int

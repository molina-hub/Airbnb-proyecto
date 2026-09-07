from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from src.db.models.propiedad_model import Propiedad
from src.db.models.resena_model import Resena
from src.db.models.reserva_model import Reserva


class ReportesRepository:
    def __init__(self, db: Session):
        self.db = db

    def propiedad_existe(self, propiedad_id: int) -> bool:
        return self.db.query(Propiedad.id).filter(Propiedad.id == propiedad_id).first() is not None

    def reservas_confirmadas_en_mes(self, propiedad_id: int, inicio: date, fin: date) -> list[Reserva]:
        return self.db.query(Reserva).filter(
            Reserva.propiedad_id == propiedad_id,
            Reserva.estado == "confirmada",
            Reserva.fecha_inicio <= fin,
            Reserva.fecha_fin > inicio,
        ).all()

    def ingresos_confirmados(self, anfitrion_id: int, desde: date, hasta: date):
        return self.db.query(Reserva, Propiedad).join(Propiedad).filter(
            Propiedad.anfitrion_id == anfitrion_id,
            Reserva.estado == "confirmada",
            Reserva.fecha_fin.between(desde, hasta),
        ).all()

    def top_propiedades_por_ciudad(self, ciudad: str):
        promedio = func.avg(Resena.puntaje).label("promedio")
        cantidad = func.count(Resena.id).label("cantidad_resenas")
        return self.db.query(Propiedad, promedio, cantidad).join(
            Reserva, Reserva.propiedad_id == Propiedad.id
        ).join(
            Resena, Resena.reserva_id == Reserva.id
        ).filter(
            func.lower(Propiedad.ciudad) == ciudad.strip().lower()
        ).group_by(Propiedad.id).having(
            func.count(Resena.id) >= 3
        ).order_by(
            promedio.desc(), cantidad.desc()
        ).limit(10).all()

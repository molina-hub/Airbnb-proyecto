from datetime import date

from sqlalchemy.orm import Session

from src.repositories.resena_repository import ResenaRepository


class ResenaService:
    def __init__(self, db: Session):
        self.repo = ResenaRepository(db)

    def crear(self, propiedad_id: int, reserva_id: int, autor_id: int, puntaje: int, comentario: str | None):
        reserva = self.repo.buscar_reserva(reserva_id)
        if not reserva or reserva.propiedad_id != propiedad_id:
            raise LookupError("Reserva no encontrada para la propiedad")
        if reserva.huesped_id != autor_id:
            raise PermissionError("Solo el huésped de la reserva puede reseñar")
        if reserva.estado != "confirmada" or reserva.fecha_fin >= date.today():
            raise ValueError("Solo se puede reseñar una reserva confirmada cuya estancia ya finalizó")
        if self.repo.existe_por_reserva(reserva_id):
            raise ValueError("Ya existe una reseña para esta reserva")
        return self.repo.crear(reserva_id, autor_id, puntaje, comentario)

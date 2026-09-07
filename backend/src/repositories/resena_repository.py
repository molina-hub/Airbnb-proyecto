from sqlalchemy.orm import Session

from src.db.models.resena_model import Resena
from src.db.models.reserva_model import Reserva


class ResenaRepository:
    def __init__(self, db: Session):
        self.db = db

    def buscar_reserva(self, reserva_id: int) -> Reserva | None:
        return self.db.get(Reserva, reserva_id)

    def existe_por_reserva(self, reserva_id: int) -> bool:
        return self.db.query(Resena.id).filter(Resena.reserva_id == reserva_id).first() is not None

    def crear(self, reserva_id: int, autor_id: int, puntaje: int, comentario: str | None) -> Resena:
        resena = Resena(reserva_id=reserva_id, autor_id=autor_id, puntaje=puntaje, comentario=comentario)
        self.db.add(resena)
        self.db.commit()
        self.db.refresh(resena)
        return resena

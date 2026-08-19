from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func

from src.db.connection import Base


class Resena(Base):
    __tablename__ = "resenas"

    id = Column(Integer, primary_key=True)
    reserva_id = Column(Integer, ForeignKey("reservas.id"), nullable=False, unique=True)
    autor_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    puntaje = Column(Integer, nullable=False)
    comentario = Column(Text)
    fecha = Column(DateTime, server_default=func.now(), nullable=False)
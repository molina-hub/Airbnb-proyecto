from sqlalchemy import Column, Integer, Date, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship

from src.db.connection import Base


class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True)
    propiedad_id = Column(Integer, ForeignKey("propiedades.id"), nullable=False)
    huesped_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    estado = Column(String(20), nullable=False, default="pendiente")
    total = Column(Numeric(10, 2), nullable=False)

    propiedad = relationship("Propiedad", back_populates="reservas")
    huesped = relationship("Usuario", foreign_keys=[huesped_id], back_populates="reservas")
    resena = relationship("Resena", back_populates="reserva", uselist=False, cascade="all, delete-orphan")

from sqlalchemy import Column, Integer, Date, String, Numeric, ForeignKey

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
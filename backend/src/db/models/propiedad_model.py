from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship

from src.db.connection import Base


class Propiedad(Base):
    __tablename__ = "propiedades"

    id = Column(Integer, primary_key=True)
    titulo = Column(String(150), nullable=False)
    direccion = Column(String(200), nullable=False)
    ciudad = Column(String(100), nullable=False)
    precio_noche = Column(Numeric(10, 2), nullable=False)
    capacidad = Column(Integer, nullable=False)
    descripcion = Column(String(1000), nullable=True)
    imagen_url = Column(String(500), nullable=True)
    anfitrion_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    anfitrion = relationship("Usuario", back_populates="propiedades")
    reservas = relationship("Reserva", back_populates="propiedad", cascade="all, delete-orphan")
    amenidades = relationship("Amenidad", secondary="propiedad_amenidades", back_populates="propiedades")

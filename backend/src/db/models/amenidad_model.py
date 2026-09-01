from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from src.db.connection import Base


class Amenidad(Base):
    __tablename__ = "amenidades"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(50), unique=True, nullable=False)
    propiedades = relationship("Propiedad", secondary="propiedad_amenidades", back_populates="amenidades")

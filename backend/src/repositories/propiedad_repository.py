from sqlalchemy.orm import Session

from src.db.models.propiedad_model import Propiedad


class PropiedadRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, **fields) -> Propiedad:
        propiedad = Propiedad(**fields)

        self.db.add(propiedad)
        self.db.commit()
        self.db.refresh(propiedad)

        return propiedad

    def find_by_id(self, propiedad_id: int) -> Propiedad | None:
        return (
            self.db.query(Propiedad)
            .filter(Propiedad.id == propiedad_id)
            .first()
        )

    def list_all(self) -> list[Propiedad]:
        return self.db.query(Propiedad).all()

    def list_by_anfitrion(self, anfitrion_id: int) -> list[Propiedad]:
        return (
            self.db.query(Propiedad)
            .filter(Propiedad.anfitrion_id == anfitrion_id)
            .all()
        )

    def update(self, propiedad_id: int, **fields) -> Propiedad | None:
        propiedad = self.find_by_id(propiedad_id)

        if propiedad is None:
            return None

        for field, value in fields.items():
            setattr(propiedad, field, value)

        self.db.commit()
        self.db.refresh(propiedad)

        return propiedad

    def delete(self, propiedad_id: int) -> bool:
        propiedad = self.find_by_id(propiedad_id)

        if propiedad is None:
            return False

        self.db.delete(propiedad)
        self.db.commit()

        return True
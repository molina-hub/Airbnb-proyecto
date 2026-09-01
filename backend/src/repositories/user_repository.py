from sqlalchemy.orm import Session

from src.db.models.usuario_model import Usuario


class UserRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        email: str,
        nombre: str,
        es_anfitrion: bool
    ) -> Usuario:

        usuario = Usuario(
            email=email,
            nombre=nombre,
            es_anfitrion=es_anfitrion
        )

        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)

        return usuario

    def find_by_id(
        self,
        user_id: int
    ) -> Usuario | None:

        return (
            self.db.query(Usuario)
            .filter(Usuario.id == user_id)
            .first()
        )

    def find_by_email(
        self,
        email: str
    ) -> Usuario | None:

        return (
            self.db.query(Usuario)
            .filter(Usuario.email == email)
            .first()
        )

    def list_all(self) -> list[Usuario]:

        return (
            self.db.query(Usuario)
            .order_by(Usuario.id)
            .all()
        )

    def update(
        self,
        user_id: int,
        **fields
    ) -> Usuario | None:

        usuario = self.find_by_id(user_id)

        if usuario is None:
            return None

        for field, value in fields.items():
            setattr(usuario, field, value)

        self.db.commit()
        self.db.refresh(usuario)

        return usuario

    def delete(
        self,
        user_id: int
    ) -> bool:

        usuario = self.find_by_id(user_id)

        if usuario is None:
            return False

        self.db.delete(usuario)
        self.db.commit()

        return True
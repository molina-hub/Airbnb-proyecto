from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from src.dtos.user_dto import (
    CreateUserDTO,
    UpdateUserDTO,
    UserResponseDTO
)
from src.mappers.user_mapper import to_user_response
from src.repositories.user_repository import UserRepository
from src.utils.hash import hash_password


class UserService:

    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def create(
        self,
        dto: CreateUserDTO
    ) -> UserResponseDTO:

        existing_user = self.repo.find_by_email(
            str(dto.email)
        )

        if existing_user is not None:
            raise ValueError(
                "El email ya está registrado"
            )

        try:
            usuario = self.repo.create(
                email=str(dto.email),
                nombre=dto.nombre,
                es_anfitrion=dto.es_anfitrion,
                password_hash=hash_password(dto.password),
            )

            return to_user_response(usuario)

        except IntegrityError:
            self.repo.db.rollback()

            raise ValueError(
                "El email ya está registrado"
            )

    def get_by_id(
        self,
        user_id: int
    ) -> UserResponseDTO:

        usuario = self.repo.find_by_id(user_id)

        if usuario is None:
            raise ValueError(
                "Usuario no encontrado"
            )

        return to_user_response(usuario)

    def list_all(
        self
    ) -> list[UserResponseDTO]:

        usuarios = self.repo.list_all()

        return [
            to_user_response(usuario)
            for usuario in usuarios
        ]

    def update(
        self,
        user_id: int,
        dto: UpdateUserDTO
    ) -> UserResponseDTO:

        usuario = self.repo.find_by_id(user_id)

        if usuario is None:
            raise ValueError(
                "Usuario no encontrado"
            )

        fields = dto.model_dump(
            exclude_unset=True,
            exclude_none=True
        )

        if "email" in fields:

            existing_user = self.repo.find_by_email(
                str(fields["email"])
            )

            if (
                existing_user is not None
                and existing_user.id != user_id
            ):
                raise ValueError(
                    "El email ya está registrado"
                )

            fields["email"] = str(fields["email"])

        try:
            usuario_actualizado = self.repo.update(
                user_id,
                **fields
            )

            if usuario_actualizado is None:
                raise ValueError(
                    "Usuario no encontrado"
                )

            return to_user_response(
                usuario_actualizado
            )

        except IntegrityError:
            self.repo.db.rollback()

            raise ValueError(
                "No se pudo actualizar el usuario"
            )

    def delete(
        self,
        user_id: int
    ) -> None:

        eliminado = self.repo.delete(user_id)

        if not eliminado:
            raise ValueError(
                "Usuario no encontrado"
            )

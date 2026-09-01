from sqlalchemy.orm import Session

from src.db.models.usuario_model import Usuario
from src.dtos.propiedad_dto import (
    CreatePropiedadDTO,
    PropiedadResponseDTO,
    UpdatePropiedadDTO,
)
from src.repositories.propiedad_repository import PropiedadRepository


class PropiedadService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = PropiedadRepository(db)

    def _verificar_anfitrion(self, anfitrion_id: int) -> Usuario:
        usuario = (
            self.db.query(Usuario)
            .filter(Usuario.id == anfitrion_id)
            .first()
        )

        if usuario is None:
            raise ValueError("El usuario anfitrión no existe.")

        if not usuario.es_anfitrion:
            raise ValueError(
                "El usuario no puede publicar propiedades porque no es anfitrión."
            )

        return usuario

    def create(self, dto: CreatePropiedadDTO) -> PropiedadResponseDTO:
        self._verificar_anfitrion(dto.anfitrion_id)

        propiedad = self.repo.create(
            titulo=dto.titulo,
            direccion=dto.direccion,
            ciudad=dto.ciudad,
            precio_noche=dto.precio_noche,
            capacidad=dto.capacidad,
            anfitrion_id=dto.anfitrion_id,
        )

        return PropiedadResponseDTO.model_validate(propiedad)

    def get_by_id(self, propiedad_id: int) -> PropiedadResponseDTO:
        propiedad = self.repo.find_by_id(propiedad_id)

        if propiedad is None:
            raise ValueError("La propiedad no existe.")

        return PropiedadResponseDTO.model_validate(propiedad)

    def list_all(self) -> list[PropiedadResponseDTO]:
        propiedades = self.repo.list_all()

        return [
            PropiedadResponseDTO.model_validate(propiedad)
            for propiedad in propiedades
        ]

    def list_by_anfitrion(
        self,
        anfitrion_id: int,
    ) -> list[PropiedadResponseDTO]:
        self._verificar_anfitrion(anfitrion_id)

        propiedades = self.repo.list_by_anfitrion(anfitrion_id)

        return [
            PropiedadResponseDTO.model_validate(propiedad)
            for propiedad in propiedades
        ]

    def update(
        self,
        propiedad_id: int,
        dto: UpdatePropiedadDTO,
    ) -> PropiedadResponseDTO:
        propiedad = self.repo.find_by_id(propiedad_id)

        if propiedad is None:
            raise ValueError("La propiedad no existe.")

        fields = dto.model_dump(exclude_none=True)

        if not fields:
            return PropiedadResponseDTO.model_validate(propiedad)

        propiedad_actualizada = self.repo.update(
            propiedad_id,
            **fields,
        )

        return PropiedadResponseDTO.model_validate(propiedad_actualizada)

    def delete(self, propiedad_id: int) -> None:
        deleted = self.repo.delete(propiedad_id)

        if not deleted:
            raise ValueError("La propiedad no existe.")
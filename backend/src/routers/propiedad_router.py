from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.propiedad_dto import (
    CreatePropiedadDTO,
    PropiedadResponseDTO,
    UpdatePropiedadDTO,
)
from src.schemas.propiedad_schema import (
    CreatePropiedadSchema,
    UpdatePropiedadSchema,
)
from src.services.propiedad_service import PropiedadService


router = APIRouter(
    prefix="/propiedades",
    tags=["propiedades"],
)


@router.post(
    "",
    response_model=PropiedadResponseDTO,
    status_code=status.HTTP_201_CREATED,
)
def create_propiedad(
    payload: CreatePropiedadSchema,
    db: Session = Depends(get_db),
):
    try:
        dto = CreatePropiedadDTO(**payload.model_dump())
        return PropiedadService(db).create(dto)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.get(
    "/",
    response_model=list[PropiedadResponseDTO],
)
def list_propiedades(
    db: Session = Depends(get_db),
):
    return PropiedadService(db).list_all()


@router.get(
    "/anfitriones/{anfitrion_id}/propiedades",
    response_model=list[PropiedadResponseDTO],
)
def list_propiedades_anfitrion(
    anfitrion_id: int,
    db: Session = Depends(get_db),
):
    try:
        return PropiedadService(db).list_by_anfitrion(anfitrion_id)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )


@router.get(
    "/{propiedad_id}",
    response_model=PropiedadResponseDTO,
)
def get_propiedad(
    propiedad_id: int,
    db: Session = Depends(get_db),
):
    try:
        return PropiedadService(db).get_by_id(propiedad_id)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.put(
    "/{propiedad_id}",
    response_model=PropiedadResponseDTO,
)
def update_propiedad(
    propiedad_id: int,
    payload: UpdatePropiedadSchema,
    db: Session = Depends(get_db),
):
    try:
        dto = UpdatePropiedadDTO(**payload.model_dump())

        return PropiedadService(db).update(
            propiedad_id,
            dto,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.delete(
    "/{propiedad_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_propiedad(
    propiedad_id: int,
    db: Session = Depends(get_db),
):
    try:
        PropiedadService(db).delete(propiedad_id)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )

    return None

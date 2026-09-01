from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.connection import get_db
from src.dtos.user_dto import (
    CreateUserDTO,
    UpdateUserDTO,
    UserResponseDTO
)
from src.schemas.user_schema import (
    CreateUserSchema,
    UpdateUserSchema
)
from src.services.user_service import UserService


router = APIRouter(
    prefix="/usuarios",
    tags=["usuarios"]
)


@router.post(
    "",
    response_model=UserResponseDTO,
    status_code=status.HTTP_201_CREATED
)
def create_user(
    payload: CreateUserSchema,
    db: Session = Depends(get_db)
):

    dto = CreateUserDTO(
        **payload.model_dump()
    )

    try:
        return UserService(db).create(dto)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error))


@router.get(
    "/{user_id}",
    response_model=UserResponseDTO
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    try:
        return UserService(db).get_by_id(user_id)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))


@router.get(
    "",
    response_model=list[UserResponseDTO]
)
def list_users(
    db: Session = Depends(get_db)
):

    return UserService(db).list_all()


@router.put(
    "/{user_id}",
    response_model=UserResponseDTO
)
def update_user(
    user_id: int,
    payload: UpdateUserSchema,
    db: Session = Depends(get_db)
):

    dto = UpdateUserDTO(
        **payload.model_dump()
    )

    try:
        return UserService(db).update(user_id, dto)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    try:
        UserService(db).delete(user_id)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error))

    return None

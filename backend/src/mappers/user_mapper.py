from src.db.models.usuario_model import Usuario
from src.dtos.user_dto import UserResponseDTO


def to_user_response(
    usuario: Usuario
) -> UserResponseDTO:

    return UserResponseDTO.model_validate(usuario)
from pydantic import BaseModel, EmailStr, Field


class CreateUserSchema(BaseModel):

    email: EmailStr

    nombre: str = Field(
        min_length=1,
        max_length=100
    )

    es_anfitrion: bool = False


class UpdateUserSchema(BaseModel):

    email: EmailStr | None = None

    nombre: str | None = Field(
        default=None,
        min_length=1,
        max_length=100
    )

    es_anfitrion: bool | None = None
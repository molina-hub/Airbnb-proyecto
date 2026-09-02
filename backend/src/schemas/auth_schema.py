from pydantic import BaseModel, EmailStr, Field


class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: dict

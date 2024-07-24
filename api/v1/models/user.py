from pydantic import ConfigDict, BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator

from typing import Optional, List
from typing_extensions import Annotated

from bson import ObjectId


PyObjectId = Annotated[str, BeforeValidator(str)]

class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    username: str = Field(...)
    first_name: str = Field(...)
    last_name: str = Field(...)
    email: str = Field(...)
    hashed_password: str = Field(default="")
    disabled: bool = Field(default=True)
    profile_photo: str = Field(default="")
    model_config = ConfigDict(
        populate_by_name = True,
        arbitrary_types_allowed = True,
        json_schema_extra = {
            "example": {
                "username": "lizard_king",
                "first_name": "Jim",
                "last_name": "Morrison",
                "email": "li.king@thedoors.com",
                "hashed_password": "latuyaporsiacaso",
                "disabled": False,
                "profile_photo": "base64 string",
            }
        },
    )

class CreateUser(UserModel):
    password: str

class UpdateUserModel(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    hashed_password: Optional[List[str]] = None
    profile_photo: Optional[str] = None
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders = {ObjectId: str},
        json_schema_extra = {
            "example": {
                "username": "lizard_king",
                "first_name": "Jim",
                "last_name": "Morrison",
                "email": "li.king@thedoors.com",
                "hashed_password": "latuyaporsiacaso",
                "disabled": False,
                "profile_photo": "base64 string",
            }
        },
    )

class UserCollection(BaseModel):
    users: List[UserModel]
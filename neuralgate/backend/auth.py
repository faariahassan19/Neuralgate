from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pwdlib import PasswordHash
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from database import db

SECRET_KEY  = "change-me-in-production-use-env-var"
ALGORITHM   = "HS256"
EXPIRE_MIN  = 30

pwd_hash   = PasswordHash.recommended()  # Argon2 by default
oauth2     = OAuth2PasswordBearer(tokenUrl="/token")
router     = APIRouter()


# ── Pydantic schemas ─────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str = ""

class Token(BaseModel):
    access_token: str
    token_type: str


# ── Helpers ──────────────────────────────────────────────────────────────────
def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MIN)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(token: str = Depends(oauth2)) -> dict:
    return verify_token(token)


# ── Routes ───────────────────────────────────────────────────────────────────
@router.post("/register", status_code=201)
async def register(user: UserCreate):
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = pwd_hash.hash(user.password)   # Argon2 salted hash
    db.users.insert_one({
        "email":     user.email,
        "password":  hashed,
        "full_name": user.full_name,
        "created":   datetime.utcnow(),
    })
    return {"message": "User registered successfully"}


@router.post("/token", response_model=Token)
async def login(form: OAuth2PasswordRequestForm = Depends()):
    user = db.users.find_one({"email": form.username})
    if not user or not pwd_hash.verify(form.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    token = create_token({"sub": user["email"]})
    return Token(access_token=token, token_type="bearer")

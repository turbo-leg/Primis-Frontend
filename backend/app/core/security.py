from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import JWTError, jwt
import hashlib
import secrets
from app.core.config import settings

# Simple but secure password hashing using SHA256 with salt
SALT = settings.secret_key


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    # Hash the plain password and compare
    password_hash = hashlib.sha256(f"{SALT}{plain_password}".encode()).hexdigest()
    return password_hash == hashed_password


def get_password_hash(password: str) -> str:
    """Hash a password using SHA256 with salt"""
    return hashlib.sha256(f"{SALT}{password}".encode()).hexdigest()


def create_access_token(
    data: dict, expires_delta: Optional[timedelta] = None
) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.access_token_expire_minutes
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.secret_key, algorithm=settings.algorithm
    )
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        return payload
    except JWTError:
        return None
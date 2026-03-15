"""
Authentication router — handles user registration and login.
"""

from fastapi import APIRouter, HTTPException, status
from models.schemas import UserRegister, UserLogin, UserResponse
from services.firebase_service import _get_db
import datetime
import uuid

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=201)
async def register(user: UserRegister):
    """Register a new user and save to Firestore."""
    db = _get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Firebase is not configured")

    try:
        # Check if user already exists
        existing = db.collection("users").where("email", "==", user.email).limit(1).get()
        if existing:
            raise HTTPException(status_code=400, detail="User with this email already exists")

        user_id = str(uuid.uuid4())
        user_data = user.dict()
        user_data["id"] = user_id
        user_data["created_at"] = datetime.datetime.now().isoformat()
        
        # Remove password from response context (just for demo simplicity we store it directly)
        db.collection("users").document(user_id).set(user_data)
        
        return UserResponse(**user_data)
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        if "403" in error_msg and "firestore.googleapis.com" in error_msg:
            print("❌ FIREBASE ERROR: Firestore API is disabled in Google Cloud Console.")
            raise HTTPException(
                status_code=503, 
                detail="Cloud Firestore API is disabled. Please enable it at: https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=datathon-cit"
            )
        print(f"⚠️ Registration error: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)


@router.post("/login", response_model=UserResponse)
async def login(credentials: UserLogin):
    """Login a user (mock authentication)."""
    db = _get_db()
    if db is None:
        raise HTTPException(status_code=503, detail="Firebase is not configured")

    try:
        query = db.collection("users").where("email", "==", credentials.email).limit(1).get()
        if not query:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user_data = query[0].to_dict()
        if user_data.get("password") != credentials.password:
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
        return UserResponse(**user_data)
    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        if "403" in error_msg and "firestore.googleapis.com" in error_msg:
            print("❌ FIREBASE ERROR: Firestore API is disabled in Google Cloud Console.")
            raise HTTPException(
                status_code=503, 
                detail="Cloud Firestore API is disabled. Please enable it at: https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=datathon-cit"
            )
        print(f"⚠️ Login error: {error_msg}")
        raise HTTPException(status_code=500, detail=error_msg)

import sys
import os

try:
    print("Testing imports...")
    from fastapi import FastAPI
    print("FastAPI imported.")
    from config import settings
    print("Settings imported.")
    from services.firebase_service import init_firebase
    print("Firebase service imported.")
    import main
    print("Main module imported.")
    print("SUCCESS: All imports working.")
except Exception as e:
    print(f"FAILURE: {e}")
    import traceback
    traceback.print_exc()

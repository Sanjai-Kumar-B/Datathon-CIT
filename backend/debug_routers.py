import sys
import os

routers = [
    'teacher_assistant', 'translate', 'flashcards', 
    'ecosystem', 'progress', 'resources', 
    'recommendations', 'video', 'auth'
]

print("Starting router diagnostics...")
for r in routers:
    try:
        print(f"Importing routers.{r}...")
        exec(f"from routers import {r}")
        print(f"✅ {r} imported.")
    except Exception as e:
        print(f"❌ Error in {r}: {e}")
        import traceback
        traceback.print_exc()

print("Finished diagnostics.")

import sys
import os

# Add backend directory to python path
backend_path = os.path.join(os.getcwd(), 'backend')
if backend_path not in sys.path:
    sys.path.append(backend_path)

from app.database import init_db

if __name__ == "__main__":
    print("Initializing database tables...")
    init_db()
    print("Database tables initialized successfully.")

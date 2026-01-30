import sqlite3

def migrate():
    conn = sqlite3.connect('backend/data/siem.db')
    cursor = conn.cursor()

    try:
        # Add missing columns to logs table if they don't exist
        # We check by trying to add; ignore error if exists
        cursor.execute("ALTER TABLE logs ADD COLUMN event_type TEXT")
    except: pass
    
    try:
        cursor.execute("ALTER TABLE logs ADD COLUMN severity TEXT")
    except: pass

    try:
        cursor.execute("ALTER TABLE logs ADD COLUMN description TEXT")
    except: pass

    # Ensure nodes table exists with correct schema
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS nodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        group_id INTEGER,
        status TEXT DEFAULT 'offline',
        cpu INTEGER DEFAULT 0,
        memory INTEGER DEFAULT 0,
        last_heartbeat TEXT
    )
    """)

    conn.commit()
    conn.close()
    print("✅ Database Schema Upgraded for Real-World Data.")

if __name__ == "__main__":
    migrate()

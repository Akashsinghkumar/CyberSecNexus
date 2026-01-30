import sqlite3
import threading
import datetime

DB_NAME = "cybersec_nexus.db"
db_lock = threading.Lock()

def get_db_connection():
    conn = sqlite3.connect(DB_NAME, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with db_lock:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Logs Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                ip_address TEXT,
                port INTEGER,
                failed_login BOOLEAN,
                action_taken TEXT
            )
        ''')
        
        # Blocked IPs Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS blocked_ips (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip_address TEXT UNIQUE,
                reason TEXT,
                timestamp TEXT
            )
        ''')

        # Nodes Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS nodes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                ip_address TEXT,
                group_id INTEGER,
                status TEXT,
                cpu INTEGER,
                memory INTEGER,
                last_heartbeat TEXT,
                config_json TEXT
            )
        ''')

        # Rules Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS rules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                description TEXT,
                severity TEXT,
                enabled BOOLEAN,
                conditions_json TEXT,
                trigger_count INTEGER DEFAULT 0,
                last_triggered TEXT
            )
        ''')

        # Groups Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS groups (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                description TEXT
            )
        ''')

        # Settings Table (License, Config)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        ''')

        # Notifications Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT,
                type TEXT,
                timestamp TEXT,
                is_read BOOLEAN DEFAULT 0
            )
        ''')

        # Vulnerabilities Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS vulnerabilities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cve_id TEXT,
                description TEXT,
                severity TEXT,
                affected_component TEXT,
                status TEXT,
                timestamp TEXT
            )
        ''')

        # Threat Intelligence Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS threat_intelligence (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                threat_type TEXT,
                description TEXT,
                severity TEXT,
                confidence_score INTEGER,
                remediation TEXT,
                source TEXT,
                timestamp TEXT
            )
        ''')

        # Third Party Risk Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS third_party_risk (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                vendor_name TEXT UNIQUE,
                risk_score INTEGER,
                status TEXT,
                details_json TEXT,
                last_audit TEXT
            )
        ''')

        # Insider Logs Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS insider_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user TEXT,
                action TEXT,
                severity TEXT,
                details TEXT,
                timestamp TEXT
            )
        ''')

        # Seed Groups
        cursor.execute("SELECT count(*) FROM groups")
        if cursor.fetchone()[0] == 0:
            cursor.executemany('INSERT INTO groups (name, description) VALUES (?, ?)', [
                ('Web Servers', 'Public facing web infrastructure'),
                ('Database Clusters', 'Internal critical data storage'),
                ('Workstations', 'Employee endpoints')
            ])
        
        # Seed Welcome Notification
        cursor.execute("SELECT count(*) FROM notifications")
        if cursor.fetchone()[0] == 0:
            cursor.execute('INSERT INTO notifications (message, type, timestamp) VALUES (?, ?, ?)',
                           ('CyberSec Nexus System Initialized', 'success', datetime.datetime.now().isoformat()))

        # Seed Settings
        cursor.execute("SELECT count(*) FROM settings")
        if cursor.fetchone()[0] == 0:
            cursor.execute('INSERT INTO settings (key, value) VALUES (?, ?)', ('license_tier', 'standard'))

        conn.commit()
        conn.close()

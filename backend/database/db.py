import sqlite3
import datetime
from threading import Lock

DB_NAME = "cybersec_nexus.db"
db_lock = Lock()

def get_db_connection():
    conn = sqlite3.connect(DB_NAME, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with db_lock:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Log Table
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
                ip_address TEXT PRIMARY KEY,
                reason TEXT,
                timestamp TEXT
            )
        ''')
        
        # AI Insights Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ai_insights (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip_address TEXT,
                score REAL,
                details TEXT,
                timestamp TEXT
            )
        ''')

        # Nodes Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS nodes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                ip_address TEXT,
                status TEXT,
                cpu INTEGER,
                memory INTEGER,
                last_seen TEXT
            )
        ''')

        # Rules Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS rules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                description TEXT,
                severity TEXT,
                enabled BOOLEAN
            )
        ''')

        # Seed Rules if empty
        cursor.execute("SELECT count(*) FROM rules")
        if cursor.fetchone()[0] == 0:
            cursor.executemany('''
                INSERT INTO rules (name, description, severity, enabled) VALUES (?, ?, ?, ?)
            ''', [
                ('Port Scan Detection', 'Detect multiple port connections from single IP within 60 seconds.', 'High', True),
                ('Brute Force Prevention', 'Block IP after 10 failed login attempts in 5 minutes.', 'Critical', True),
                ('AI Anomaly Detection', 'Block traffic with anomaly score < -0.5.', 'Critical', True),
                ('Suspicious File Access', 'Alert on access to sensitive file paths.', 'Medium', True)
            ])
            
        # Seed Nodes if empty
        cursor.execute("SELECT count(*) FROM nodes")
        if cursor.fetchone()[0] == 0:
            cursor.executemany('''
                INSERT INTO nodes (name, ip_address, status, cpu, memory, last_seen) VALUES (?, ?, ?, ?, ?, ?)
            ''', [
                ('SRV-DC01', '192.168.1.10', 'active', 45, 60, datetime.datetime.now().isoformat()),
                ('SRV-WEB01', '192.168.1.20', 'warning', 78, 85, datetime.datetime.now().isoformat()),
                ('SRV-DB01', '192.168.1.30', 'active', 22, 40, datetime.datetime.now().isoformat())
            ])

        conn.commit()
        conn.close()

def log_event(ip, port, failed_login, action="MONITOR"):
    with db_lock:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO logs (timestamp, ip_address, port, failed_login, action_taken) VALUES (?, ?, ?, ?, ?)",
                       (datetime.datetime.now().isoformat(), ip, port, failed_login, action))
        conn.commit()
        conn.close()

def get_logs(limit=50):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM logs ORDER BY id DESC LIMIT ?", (limit,))
    logs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return logs

def block_ip_db(ip, reason):
    with db_lock:
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO blocked_ips (ip_address, reason, timestamp) VALUES (?, ?, ?)",
                           (ip, reason, datetime.datetime.now().isoformat()))
            conn.commit()
        except sqlite3.IntegrityError:
            pass # Already blocked
        conn.close()

def get_blocked_ips():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM blocked_ips ORDER BY timestamp DESC")
    blocked = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return blocked

# Node Operations
def get_nodes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM nodes")
    nodes = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return nodes

def add_node(name, ip, status="active"):
    with db_lock:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO nodes (name, ip_address, status, cpu, memory, last_seen) VALUES (?, ?, ?, 0, 0, ?)",
                       (name, ip, status, datetime.datetime.now().isoformat()))
        conn.commit()
        conn.close()

# Rule Operations
def get_rules():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM rules")
    rules = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return rules

def toggle_rule(rule_id, enabled):
    with db_lock:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE rules SET enabled = ? WHERE id = ?", (enabled, rule_id))
        conn.commit()
        conn.close()

def create_rule(name, description, severity, enabled=True):
    with db_lock:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO rules (name, description, severity, enabled) VALUES (?, ?, ?, ?)",
                       (name, description, severity, enabled))
        conn.commit()
        rule_id = cursor.lastrowid
        conn.close()
        return rule_id

def delete_rule(rule_id):
    with db_lock:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM rules WHERE id = ?", (rule_id,))
        conn.commit()
        conn.close()

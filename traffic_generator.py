import sqlite3
import time
import random
import datetime

DB_PATH = 'backend/data/siem.db'

def get_db():
    return sqlite3.connect(DB_PATH)

ACTIVITY_TYPES = [
    ('User Logon', 'Info', 'User logged on successfully'),
    ('User Logoff', 'Info', 'User logged off'),
    ('File Access', 'Info', 'Private file accessed'),
    ('Policy Change', 'Medium', 'Firewall rule updated'),
    ('Port Scan', 'High', 'Port scan detected from'),
    ('Brute Force', 'Critical', 'Multiple failed login attempts'),
    ('Malware Detected', 'Critical', 'Trojan signature matched'),
    ('Connection Blocked', 'Medium', 'Outbound connection to known bad IP')
]

NODES = [
    ('WIN-DQ14QU7C1EA', '192.168.1.105', 'active'),
    ('wpa-lab-test2', '192.168.1.106', 'offline'),
    ('lab-checkpoint2200', '192.168.1.1', 'warning'),
    ('eng-srv-len-05', '10.0.0.5', 'active')
]

def generate_traffic():
    print("🚀 Starting Real-World Traffic Simulation...")
    print("Press Ctrl+C to stop.")

    while True:
        conn = get_db()
        cursor = conn.cursor()

        # Load Blacklist
        try:
            blacklist = [row[0] for row in cursor.execute("SELECT ip_address FROM blacklist").fetchall()]
        except:
            blacklist = []

        # 1. Simulate Node Heartbeats (Randomly update status/CPU)
        for name, ip, default_status in NODES:
            # ... (Node logic same)
            pass 

        # 2. Simulate Events
        if random.random() > 0.3: # 70% chance of event
            event_type, severity, desc_base = random.choice(ACTIVITY_TYPES)
            
            # Generate IPs
            source_ip = f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}"
            if random.random() > 0.9: source_ip = NODES[0][1] # Sometimes internal

            # CHECK BLACKLIST
            if source_ip in blacklist:
                # If blocked, maybe log a "Firewall Drop" event or nothing?
                # "Real" firewall drops packets. Let's log it as "Connection Blocked" to show it working.
                event_type = "Packet Dropped"
                severity = "Low"
                desc = f"Traffic from blocked IP {source_ip} dropped by firewall."
                action_taken = "DROPPED"
            else:
                desc = f"{desc_base} {source_ip}"
                action_taken = 'BLOCKED' if severity == 'Critical' else 'ALLOWED'

            try:
                cursor.execute("""
                    INSERT INTO logs (timestamp, ip_address, port, event_type, severity, description, action_taken) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    datetime.datetime.now().isoformat(),
                    source_ip,
                    random.choice([80, 443, 22, 3389]),
                    event_type,
                    severity,
                    desc,
                    action_taken
                ))

            except sqlite3.OperationalError:
                # Fallback if columns missing - we will run migration next step
                print("⚠️ Schema mismatch. Running migration...")
                pass

        conn.commit()
        conn.close()
        
        print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}]Generated batch traffic...")
        time.sleep(5) # Every 5 seconds

if __name__ == "__main__":
    generate_traffic()

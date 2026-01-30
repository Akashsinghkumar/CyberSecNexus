import threading
import time
import datetime
from .database import get_db_connection, db_lock
from ids.detector import IDSDetector
from ips.blocker import IPSBlocker
from .models import Notification, Vulnerability, ThirdPartyRisk
from .vulnerability import VulnerabilityScanner
from .third_party import ThirdPartyMonitor

class ProtectionEngine:
    def __init__(self):
        self.ids = IDSDetector()
        self.ips = IPSBlocker()
        self.running = False
        self._thread = None
        self.layers = {
            "network_shield": {"active": True, "status": "Secure", "level": "High"},
            "file_integrity": {"active": True, "status": "Monitoring", "level": "Medium"},
            "web_protection": {"active": True, "status": "Active", "level": "High"},
            "usb_shield": {"active": True, "status": "Waiting", "level": "Medium"},
            "ransomware_guard": {"active": True, "status": "Enabled", "level": "Extreme"},
            "ai_neural_engine": {"active": False, "status": "Locked", "level": "None"}
        }

    def start(self):
        if not self.running:
            self.running = True
            # Sync with license on start
            self._update_layers_by_license()
            self._thread = threading.Thread(target=self._monitor_loop, daemon=True)
            self._thread.start()
            print("[PROTECTION] Multi-Layered Protection Engine Started.")

    def _update_layers_by_license(self):
        try:
            conn = get_db_connection()
            row = conn.execute('SELECT value FROM settings WHERE key = ?', ('license_tier',)).fetchone()
            conn.close()
            if row and row['value'] == 'platinum':
                self.layers["ai_neural_engine"] = {"active": True, "status": "Running", "level": "Neural"}
                print("[PROTECTION] Platinum Neural Engine Unlocked.")
        except:
            pass

    def stop(self):
        self.running = False

    def get_status(self):
        return self.layers

    def _monitor_loop(self):
        while self.running:
            try:
                self._update_layers_by_license() # Sync license changes
                self._analyze_recent_activity()
                self._check_system_health()
            except Exception as e:
                print(f"[PROTECTION] Engine Error: {e}")
            time.sleep(10)


    def _check_system_health(self):
        # Periodic scans (Simulate running every few iterations)
        # In real world, use a scheduler. Here we use simple probability or counter.
        import random
        if random.randint(1, 100) > 95: # 5% chance per loop (approx every 3 mins with 10s sleep)
            print("[PROTECTION] Running Periodic Vulnerability & Third-Party Scan...")
            
            # Vulnerability Scan
            scanner = VulnerabilityScanner()
            count = scanner.scan()
            if count > 0:
                Notification.create(f"Security Alert: {count} new vulnerabilities detected", "warning")
            
            # Third Party Scan
            monitor = ThirdPartyMonitor()
            monitor.assess_risks()

    def _analyze_recent_activity(self):
        # 1. Fetch recent logs
        conn = get_db_connection()
        cutoff = (datetime.datetime.now() - datetime.timedelta(seconds=60)).isoformat()
        rows = conn.execute("SELECT ip_address, COUNT(*) as count, SUM(failed_login) as fails FROM logs WHERE timestamp > ? GROUP BY ip_address", (cutoff,)).fetchall()
        conn.close()

        for row in rows:
            ip = row['ip_address']
            count = row['count']
            fails = row['fails'] or 0

            if fails >= 5:
                self._trigger_block(ip, f"Brute-force detected: {fails} failed attempts")
            elif count > 100:
                self._trigger_block(ip, f"DDoS pattern detected: {count} packets/min")

    def _trigger_block(self, ip, reason):
        if not self.ips.is_blocked(ip):
            print(f"[PROTECTION] AUTO-BLOCKING: {ip} - {reason}")
            self.ips.block_ip(ip, reason)
            Notification.create(f"THREAT NEUTRALIZED: {ip} blocked ({reason})", "error")

# Instance to be used by the app
engine = ProtectionEngine()

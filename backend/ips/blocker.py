import subprocess
import platform
from app.database import get_db_connection, db_lock

def block_ip_db(ip, reason):
    with db_lock:
        conn = get_db_connection()
        try:
            conn.execute("INSERT INTO blocked_ips (ip_address, reason, timestamp) VALUES (?, ?, ?)",
                        (ip, reason, datetime.datetime.now().isoformat()))
            conn.commit()
        except:
            pass
        finally:
            conn.close()

def get_blocked_ips():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM blocked_ips").fetchall()
    conn.close()
    return [dict(row) for row in rows]

import datetime

class IPSBlocker:
    def __init__(self):
        self._refresh_cache()
        self.is_windows = platform.system() == "Windows"

    def _refresh_cache(self):
        self.blocked_ips_cache = {row['ip_address'] for row in get_blocked_ips()}

    def is_blocked(self, ip):
        # Check cache first for speed
        return ip in self.blocked_ips_cache

    def block_ip(self, ip, reason):
        # 1. Update Database
        block_ip_db(ip, reason)
        self.blocked_ips_cache.add(ip)
        
        # 2. Real-World Blocking (Windows Firewall)
        if self.is_windows:
            self._apply_windows_block(ip)
        
        print(f"[IPS] BLOCKED IP: {ip} Reason: {reason}")

    def _apply_windows_block(self, ip):
        """Adds a real block rule to Windows Firewall."""
        rule_name = f"CyberSecNexus_Block_{ip}"
        try:
            # Command to add a block rule
            cmd = f'netsh advfirewall firewall add rule name="{rule_name}" dir=in action=block remoteip={ip}'
            subprocess.run(cmd, shell=True, check=True, capture_output=True)
            print(f"[FIREWALL] Windows Firewall Rule Created: {rule_name}")
        except subprocess.CalledProcessError as e:
            print(f"[FIREWALL] Error applying rule (May need Admin privileges): {e.stderr.decode()}")

    def unblock_ip(self, ip):
        """Removes the block rule from Windows Firewall and database."""
        # Unblock in DB logic would go here if implemented
        if self.is_windows:
            rule_name = f"CyberSecNexus_Block_{ip}"
            try:
                cmd = f'netsh advfirewall firewall delete rule name="{rule_name}"'
                subprocess.run(cmd, shell=True, check=True, capture_output=True)
                print(f"[FIREWALL] Windows Firewall Rule Deleted: {rule_name}")
            except subprocess.CalledProcessError:
                pass
        
        if ip in self.blocked_ips_cache:
            self.blocked_ips_cache.remove(ip)

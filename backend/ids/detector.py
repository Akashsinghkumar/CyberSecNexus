import time
from collections import defaultdict

class IDSDetector:
    def __init__(self):
        self.ip_activity = defaultdict(lambda: {
            "packet_count": 0,
            "failed_attempts": 0,
            "ports": set(),
            "start_time": time.time()
        })

    def log_packet(self, ip, port, failed_login=False):
        data = self.ip_activity[ip]
        data["packet_count"] += 1
        data["ports"].add(port)

        if failed_login:
            data["failed_attempts"] += 1

    def analyze_ip(self, ip):
        data = self.ip_activity[ip]
        duration = max(time.time() - data["start_time"], 1)

        packet_rate = data["packet_count"] / duration
        port_count = len(data["ports"])

        suspicious = False
        reasons = []

        if data["failed_attempts"] > 10:
            suspicious = True
            reasons.append("Possible brute-force attack")

        if port_count > 5:
            suspicious = True
            reasons.append("Possible port scanning")

        if packet_rate > 50:
            suspicious = True
            reasons.append("Abnormal packet rate")

        return {
            "ip": ip,
            "packet_rate": round(packet_rate, 2),
            "failed_attempts": data["failed_attempts"],
            "ports_accessed": list(data["ports"]),
            "suspicious": suspicious,
            "reasons": reasons
        }

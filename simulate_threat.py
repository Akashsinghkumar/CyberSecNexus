import requests
import time
import random

BASE_URL = "http://localhost:5000"

def simulate_threats():
    print("Simulating Cyber Threats...")
    
    # 1. Simulate Brute Force (Generates Notification but maybe not block if threshold high)
    # We will manually inject a notification that LOOKS like a brute force to ensure UI testing
    try:
        attacker_ip = f"192.168.1.{random.randint(50, 200)}"
        print(f"Injecting threat from {attacker_ip}...")
        
        requests.post(f"{BASE_URL}/api/notifications", json={
            "message": f"Brute-force attack detected from {attacker_ip}. Multiple failed logins.",
            "type": "error"
        })
        
        print("Threat notification sent! Check Dashboard Toast (10s) and Incidents Page.")
        
    except Exception as e:
        print(f"Simulation failed: {e}")

if __name__ == "__main__":
    simulate_threats()

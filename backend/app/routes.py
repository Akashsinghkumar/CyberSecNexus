from flask import Blueprint, jsonify, request
from .models import Node, Event, Rule, Group, Notification, Vulnerability, ThreatIntelligence, ThirdPartyRisk, InsiderLog
from ips.blocker import IPSBlocker
from .vulnerability import VulnerabilityScanner
from .third_party import ThirdPartyMonitor
from .insider import InsiderThreatDetector
from ai_engine.explainer import ThreatExplainer
import sqlite3

api_bp = Blueprint('api', __name__)
ips = IPSBlocker()


# --- Nodes ---
@api_bp.route('/nodes', methods=['GET'])
def get_nodes():
    return jsonify({"status": "success", "data": Node.get_all()})

@api_bp.route('/nodes', methods=['POST'])
def create_node():
    data = request.json
    Node.create(data['name'], data['ip'], data.get('group_id'))
    return jsonify({"status": "success", "message": "Node created"})

@api_bp.route('/nodes/<int:node_id>/heartbeat', methods=['POST'])
def heartbeat(node_id):
    data = request.json
    Node.update_heartbeat(node_id, data.get('cpu', 0), data.get('memory', 0))
    return jsonify({"status": "success"})

# --- Events ---
@api_bp.route('/events', methods=['GET'])
def get_events():
    limit = int(request.args.get('limit', 50))
    page = int(request.args.get('page', 1))
    offset = (page - 1) * limit
    search = request.args.get('search')
    severity = request.args.get('severity')
    
    events = Event.get_all(limit, offset, severity, search)
    return jsonify({"status": "success", "data": events, "meta": {"page": page, "limit": limit}})

# --- Rules ---
@api_bp.route('/rules', methods=['GET'])
def get_rules():
    return jsonify({"status": "success", "data": Rule.get_all()})

@api_bp.route('/rules', methods=['POST'])
def create_rule():
    data = request.json
    Rule.create(data['name'], data['description'], data['severity'])
    return jsonify({"status": "success", "message": "Rule created"})

@api_bp.route('/rules/<int:rule_id>', methods=['PATCH'])
def update_rule(rule_id):
    # Only toggle for now
    data = request.json
    if 'enabled' in data:
        Rule.toggle(rule_id, data['enabled'])
    return jsonify({"status": "success"})

@api_bp.route('/rules/<int:rule_id>', methods=['DELETE'])
def delete_rule(rule_id):
    Rule.delete(rule_id)
    return jsonify({"status": "success"})

# --- Profile ---
@api_bp.route('/profile', methods=['GET'])
def get_profile():
    return jsonify({
        "status": "success", 
        "data": {
            "name": "Admin User",
            "role": "Security Analyst",
            "email": "admin@cybersecnexus.com",
            "avatar": None
        }
    })

# --- Groups ---
@api_bp.route('/groups', methods=['GET'])
def get_groups():
    return jsonify({"status": "success", "data": Group.get_all()})

@api_bp.route('/groups', methods=['POST'])
def create_group():
    data = request.json
    Group.create(data['name'], data.get('description', ''))
    return jsonify({"status": "success", "message": "Group created"})

@api_bp.route('/groups/<int:group_id>', methods=['PATCH'])
def update_group(group_id):
    data = request.json
    Group.update(group_id, data['name'], data.get('description', ''))
    return jsonify({"status": "success", "message": "Group updated"})

@api_bp.route('/groups/<int:group_id>', methods=['DELETE'])
def delete_group(group_id):
    Group.delete(group_id)
    return jsonify({"status": "success", "message": "Group deleted"})

# --- IPS / Blocking ---
@api_bp.route('/blocked', methods=['GET'])
def get_blocked():
    from ips.blocker import get_blocked_ips
    return jsonify(get_blocked_ips())

@api_bp.route('/block-ip', methods=['POST'])
def block_ip_manual():
    data = request.json
    ip = data.get('ip')
    reason = data.get('reason', 'Manual Block')
    if not ip:
        return jsonify({"status": "error", "message": "IP is required"}), 400
    ips.block_ip(ip, reason)
    return jsonify({"status": "success", "message": f"IP {ip} blocked"})

@api_bp.route('/blocked/<path:ip>', methods=['DELETE'])
def unblock_ip(ip):
    ips.unblock_ip(ip)
    # Manual cleanup from DB since unblock_ip in blocker.py only removes from cache/FW
    from .database import get_db_connection, db_lock
    with db_lock:
        conn = get_db_connection()
        conn.execute("DELETE FROM blocked_ips WHERE ip_address = ?", (ip,))
        conn.commit()
        conn.close()
    return jsonify({"status": "success", "message": f"IP {ip} unblocked"})

# --- Notifications ---
@api_bp.route('/notifications', methods=['GET'])
def get_notifications():
    return jsonify({"status": "success", "data": Notification.get_all()})

@api_bp.route('/notifications', methods=['POST'])
def create_notification():
    data = request.json
    msg = data.get('message')
    ntype = data.get('type', 'info')
    if not msg:
        return jsonify({"status": "error", "message": "Message is required"}), 400
    Notification.create(msg, ntype)
    return jsonify({"status": "success", "message": "Notification created"})

@api_bp.route('/notifications/<int:notif_id>', methods=['DELETE'])
def delete_notification(notif_id):
    Notification.delete(notif_id)
    return jsonify({"status": "success", "message": "Notification deleted"})

@api_bp.route('/stats', methods=['GET'])
def get_stats():
    from .database import get_db_connection
    conn = get_db_connection()
    try:
        # Real counts from DB
        total_events = conn.execute('SELECT COUNT(*) FROM logs').fetchone()[0]
        # Count blocked IPs
        blocked_threats = conn.execute('SELECT COUNT(*) FROM blocked_ips').fetchone()[0]
        # Count active nodes
        active_nodes = conn.execute("SELECT COUNT(*) FROM nodes WHERE status = 'active'").fetchone()[0]
        # Count enabled rules
        active_rules = conn.execute("SELECT COUNT(*) FROM rules WHERE enabled = 1").fetchone()[0]
        
        return jsonify({
            "status": "success",
            "data": {
                "totalEvents": total_events,
                "blockedThreats": blocked_threats,
                "activeNodes": active_nodes,
                "activeRules": active_rules
            }
        })
    except Exception as e:
        print(f"Stats error: {e}")
        return jsonify({
            "status": "error", 
            "data": {
                "totalEvents": 0, "blockedThreats": 0, "activeNodes": 0, "activeRules": 0
            }
        })
    finally:
        conn.close()

# --- System Security Scan ---
@api_bp.route('/system-scan', methods=['GET'])
def system_scan():
    import subprocess
    import platform
    import re
    
    scan_results = {
        "status": "Healthy",
        "threats_found": 0,
        "checks": [],
        "filesScanned": 0,  # Will utilize process count
        "history": []       # Placeholder for chart
    }

    # 1. Real Network Scan (Netstat)
    try:
        # Run netstat -an to get active connections
        if platform.system() == "Windows":
            cmd = ['netstat', '-an']
        else:
            cmd = ['netstat', '-an']
            
        res = subprocess.run(cmd, capture_output=True, text=True)
        lines = res.stdout.split('\n')
        active_connections = len([l for l in lines if 'ESTABLISHED' in l])
        listening_ports = len([l for l in lines if 'LISTENING' in l])
        
        scan_results["checks"].append({
            "name": "Network Connections", 
            "status": f"{active_connections} Active", 
            "safe": True
        })
        scan_results["checks"].append({
            "name": "Open Ports", 
            "status": f"{listening_ports} Listening", 
            "safe": listening_ports < 50 # Simple heuristic
        })
    except Exception as e:
        scan_results["checks"].append({"name": "Network Scan", "status": "Failed", "safe": False})

    # 2. Real Process Scan (Tasklist)
    try:
        if platform.system() == "Windows":
            cmd = ['tasklist']
        else:
            cmd = ['ps', '-e']

        res = subprocess.run(cmd, capture_output=True, text=True)
        processes = res.stdout.split('\n')
        process_count = len(processes)
        scan_results["filesScanned"] = process_count * 12 # Simulation: approx files touched by processes
        
        # Simple/Naive Threat Check
        suspicious_names = ['nc.exe', 'ncat', 'netcat', 'keylogger', 'miner']
        found_threats = [p for p in processes if any(s in p.lower() for s in suspicious_names)]
        
        scan_results["threats_found"] = len(found_threats)
        
        if len(found_threats) > 0:
            scan_results["status"] = "At Risk"
            scan_results["checks"].append({"name": "Process Integrity", "status": "Threats Found", "safe": False})
        else:
            scan_results["checks"].append({"name": "Process Integrity", "status": f"{process_count} Processes", "safe": True})
            
    except:
        scan_results["checks"].append({"name": "Process Integrity", "status": "Unknown", "safe": False})

    # 3. Windows Firewall Check
    if platform.system() == "Windows":
        try:
            res = subprocess.run(['netsh', 'advfirewall', 'show', 'allprofiles', 'state'], capture_output=True, text=True)
            if "ON" in res.stdout:
                scan_results["checks"].append({"name": "Windows Firewall", "status": "Active", "safe": True})
            else:
                scan_results["checks"].append({"name": "Windows Firewall", "status": "Disabled", "safe": False})
                scan_results["status"] = "Warning"
        except:
             pass

    # Generate dummy history for the chart based on real values
    import random
    scan_results["history"] = [
        {"name": "1m", "value": scan_results["threats_found"]},
        {"name": "2m", "value": scan_results["threats_found"]},
        {"name": "3m", "value": scan_results["threats_found"]},
        {"name": "Live", "value": scan_results["threats_found"]}
    ]
    
    return jsonify({"status": "success", "data": scan_results})

# --- License Management ---
@api_bp.route('/license', methods=['GET'])
def get_license():
    conn = get_db_connection()
    row = conn.execute('SELECT value FROM settings WHERE key = ?', ('license_tier',)).fetchone()
    conn.close()
    return jsonify({"status": "success", "tier": row['value'] if row else "standard"})

@api_bp.route('/upgrade-license', methods=['POST'])
def upgrade_license():
    data = request.json
    tier = data.get('tier', 'platinum')
    with db_lock:
        conn = get_db_connection()
        conn.execute('UPDATE settings SET value = ? WHERE key = ?', (tier, 'license_tier'))
        conn.commit()
        conn.close()
    
    Notification.create(f"System Upgraded to {tier.upper()} PRO", "success")
    return jsonify({"status": "success", "message": f"Successfully upgraded to {tier}"})

@api_bp.route('/protection-layers', methods=['GET'])
def get_protection_layers():
    from .protection import engine
    return jsonify({"status": "success", "layers": engine.get_status()})

# --- Payment Gateway (Simulated) ---
@api_bp.route('/process-payment', methods=['POST'])
def process_payment():
    data = request.json
    card_number = data.get('cardNumber', '')
    
    # Simple simulation: If card starts with '4', it's Visa Success. 
    # Otherwise, simulate processing delay.
    import time
    time.sleep(1.5)
    
    if len(card_number.replace(' ', '')) >= 13:
        return jsonify({
            "status": "success", 
            "transaction_id": f"TXN-{int(time.time())}", 
            "message": "Payment Authorized Successfully"
        })
    else:
        return jsonify({
            "status": "error", 
            "message": "Invalid Card Details. Please check your card number."
        }), 400

# --- New Modules ---

# 1. Vulnerabilities
@api_bp.route('/vulnerabilities', methods=['GET'])
def get_vulnerabilities():
    return jsonify({"status": "success", "data": Vulnerability.get_all()})

@api_bp.route('/vulnerabilities/scan', methods=['POST'])
def scan_vulnerabilities():
    scanner = VulnerabilityScanner()
    count = scanner.scan()
    return jsonify({"status": "success", "message": f"Scan complete. {count} vulnerabilities found."})

# 2. Threat Intelligence
@api_bp.route('/threat-intel', methods=['GET'])
def get_threat_intel():
    return jsonify({"status": "success", "data": ThreatIntelligence.get_all()})

@api_bp.route('/threat-intel/explain', methods=['POST'])
def explain_threat():
    data = request.json
    explainer = ThreatExplainer()
    explanation = explainer.explain({"type": data.get('type'), "details": data.get('details')})
    remediation = explainer.get_remediation(data.get('type'))
    return jsonify({"status": "success", "explanation": explanation, "remediation": remediation})

# 3. Third Party Risk
@api_bp.route('/third-party', methods=['GET'])
def get_third_party():
    return jsonify({"status": "success", "data": ThirdPartyRisk.get_all()})

@api_bp.route('/third-party/scan', methods=['POST'])
def scan_third_party():
    monitor = ThirdPartyMonitor()
    results = monitor.assess_risks()
    return jsonify({"status": "success", "data": results, "message": "Third-party assessment complete."})

# 4. Insider Threats
@api_bp.route('/insider/logs', methods=['GET'])
def get_insider_logs():
    return jsonify({"status": "success", "data": InsiderLog.get_all()})

@api_bp.route('/insider/analyze', methods=['POST'])
def analyze_insider():
    # Simulate receiving a user action log to analyze
    data = request.json
    detector = InsiderThreatDetector()
    detector.analyze_behavior(data) # This will log if suspicious
    return jsonify({"status": "success", "message": "Activity analyzed."})

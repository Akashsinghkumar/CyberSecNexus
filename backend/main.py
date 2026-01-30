from flask import Flask, jsonify, request
from flask_cors import CORS
from ids.detector import IDSDetector
from database.db import init_db, log_event, get_logs, get_blocked_ips, get_nodes, add_node, get_rules, toggle_rule, create_rule, delete_rule
from ai_engine.model import AIThreatModel
from ips.blocker import IPSBlocker
import threading
import time

app = Flask(__name__)
CORS(app)

# Initialize Components
init_db()
ids = IDSDetector()
ai_model = AIThreatModel()
ips = IPSBlocker()

# Background training loop (Mocking continuous learning)
def background_training():
    while True:
        # verify if we have enough data to train
        # In a real scenario, we'd fetch from DB
        time.sleep(60) 

threading.Thread(target=background_training, daemon=True).start()

@app.route("/")
def home():
    return jsonify({
        "status": "CyberSec Nexus Running",
        "modules": {
            "IDS": "Active",
            "IPS": "Active",
            "AI_Engine": "Active",
            "Database": "Connected"
        }
    })

# ... (Previous /simulate route remains unchanged) ...

@app.route("/simulate/<ip>/<int:port>")
def simulate(ip, port):
    # 1. IPS Check
    if ips.is_blocked(ip):
        return jsonify({"status": "BLOCKED", "message": "IP is blocked by IPS"}), 403

    # 2. Log Event
    failed_login = request.args.get('failed', 'false').lower() == 'true'
    log_event(ip, port, failed_login)
    
    # 3. IDS Analysis
    ids.log_packet(ip, port, failed_login=failed_login)
    ids_result = ids.analyze_ip(ip)

    # 4. AI Analysis
    # Feature vector: [packet_rate, failed_attempts, port_count]
    features = [ids_result["packet_rate"], ids_result["failed_attempts"], len(ids_result["ports_accessed"])]
    ai_score = ai_model.analyze(features)
    ai_insight = ai_model.get_details(ai_score)

    # 5. Automated Response
    if ids_result["suspicious"] or ai_score < -0.5:
        reason = ids_result["reasons"][0] if ids_result["reasons"] else "AI Anomaly Detected"
        ips.block_ip(ip, reason)
        action = "BLOCKED"
    else:
        action = "ALLOWED"

    return jsonify({
        "ids_analysis": ids_result,
        "ai_analysis": {
            "score": ai_score,
            "insight": ai_insight
        },
        "action_taken": action
    })

@app.route("/api/logs")
def api_logs():
    return jsonify(get_logs())

@app.route("/api/blocked")
def api_blocked():
    return jsonify(get_blocked_ips())

@app.route("/api/block-ip", methods=['POST'])
def api_block_manual():
    data = request.json
    ip = data.get('ip')
    reason = data.get('reason', 'Manual Block')
    if not ip:
        return jsonify({"status": "error", "message": "IP is required"}), 400
    ips.block_ip(ip, reason)
    return jsonify({"status": "success", "message": f"IP {ip} blocked"})

@app.route("/api/blocked/<path:ip>", methods=['DELETE'])
def api_unblock_ip(ip):
    ips.unblock_ip(ip)
    # Also need to delete from DB
    from database.db import get_db_connection, db_lock
    with db_lock:
        conn = get_db_connection()
        conn.execute("DELETE FROM blocked_ips WHERE ip_address = ?", (ip,))
        conn.commit()
        conn.close()
    return jsonify({"status": "success", "message": f"IP {ip} unblocked"})

@app.route("/api/nodes", methods=['GET'])
def api_nodes():
    return jsonify(get_nodes())

@app.route("/api/nodes", methods=['POST'])
def api_add_node():
    data = request.json
    add_node(data.get('name'), data.get('ip'))
    return jsonify({"status": "success"})

@app.route("/api/rules", methods=['GET'])
def api_rules():
    return jsonify(get_rules())

@app.route("/api/rules", methods=['POST'])
def api_create_rule():
    data = request.json
    rule_id = create_rule(
        data.get('name'),
        data.get('description'),
        data.get('severity'),
        data.get('enabled', True)
    )
    return jsonify({"status": "success", "id": rule_id})

@app.route("/api/rules/<int:rule_id>/toggle", methods=['POST'])
def api_toggle_rule(rule_id):
    data = request.json
    toggle_rule(rule_id, data.get('enabled'))
    return jsonify({"status": "success"})

@app.route("/api/rules/<int:rule_id>", methods=['DELETE'])
def api_delete_rule(rule_id):
    delete_rule(rule_id)
    return jsonify({"status": "success"})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

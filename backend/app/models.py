from .database import get_db_connection, db_lock
import datetime
import json

class Node:
    @staticmethod
    def get_all():
        conn = get_db_connection()
        nodes = conn.execute('SELECT * FROM nodes').fetchall()
        conn.close()
        return [dict(row) for row in nodes]

    @staticmethod
    def create(name, ip, group_id=None):
        with db_lock:
            conn = get_db_connection()
            conn.execute('INSERT INTO nodes (name, ip_address, group_id, status, cpu, memory, last_heartbeat) VALUES (?, ?, ?, ?, ?, ?, ?)',
                         (name, ip, group_id, 'active', 0, 0, datetime.datetime.now().isoformat()))
            conn.commit()
            conn.close()

    @staticmethod
    def update_heartbeat(node_id, cpu, memory):
        with db_lock:
            conn = get_db_connection()
            conn.execute('UPDATE nodes SET cpu=?, memory=?, last_heartbeat=? WHERE id=?',
                         (cpu, memory, datetime.datetime.now().isoformat(), node_id))
            conn.commit()
            conn.close()

class Event:
    @staticmethod
    def get_all(limit=100, offset=0, severity=None, search=None):
        query = "SELECT * FROM logs WHERE 1=1"
        params = []
        
        if search:
            query += " AND (ip_address LIKE ? OR action_taken LIKE ?)"
            params.extend([f'%{search}%', f'%{search}%'])
        
        # Note: 'severity' is not in logs table yet, mapping action_taken for now
        if severity:
            if severity == 'Critical':
                query += " AND action_taken = 'BLOCKED'"
            elif severity == 'Info':
                query += " AND action_taken != 'BLOCKED'"

        query += " ORDER BY id DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        conn = get_db_connection()
        rows = conn.execute(query, params).fetchall()
        conn.close()
        return [dict(row) for row in rows]

    @staticmethod
    def log(ip, port, action, failed_login=False):
        with db_lock:
            conn = get_db_connection()
            conn.execute('INSERT INTO logs (timestamp, ip_address, port, failed_login, action_taken) VALUES (?, ?, ?, ?, ?)',
                         (datetime.datetime.now().isoformat(), ip, port, failed_login, action))
            conn.commit()
            conn.close()

class Rule:
    @staticmethod
    def get_all():
        conn = get_db_connection()
        rows = conn.execute('SELECT * FROM rules').fetchall()
        conn.close()
        return [dict(row) for row in rows]

    @staticmethod
    def toggle(rule_id, enabled):
        with db_lock:
            conn = get_db_connection()
            conn.execute('UPDATE rules SET enabled=? WHERE id=?', (enabled, rule_id))
            conn.commit()
            conn.close()

    @staticmethod
    def create(name, description, severity):
        with db_lock:
            conn = get_db_connection()
            conn.execute('INSERT INTO rules (name, description, severity, enabled) VALUES (?, ?, ?, ?)',
                         (name, description, severity, True))
            conn.commit()
            conn.close()

    @staticmethod
    def delete(rule_id):
        with db_lock:
            conn = get_db_connection()
            conn.execute('DELETE FROM rules WHERE id=?', (rule_id,))
            conn.commit()
            conn.close()

class Group:
    @staticmethod
    def get_all():
        conn = get_db_connection()
        # Count nodes in each group
        rows = conn.execute('''
            SELECT g.*, COUNT(n.id) as count 
            FROM groups g 
            LEFT JOIN nodes n ON g.id = n.group_id 
            GROUP BY g.id
        ''').fetchall()
        conn.close()
        return [dict(row) for row in rows]

    @staticmethod
    def create(name, description):
        with db_lock:
            conn = get_db_connection()
            conn.execute('INSERT INTO groups (name, description) VALUES (?, ?)',
                         (name, description))
            conn.commit()
            conn.close()

    @staticmethod
    def delete(group_id):
        with db_lock:
            conn = get_db_connection()
            # Set group_id to NULL for nodes in this group first
            conn.execute('UPDATE nodes SET group_id = NULL WHERE group_id = ?', (group_id,))
            conn.execute('DELETE FROM groups WHERE id = ?', (group_id,))
            conn.commit()
            conn.close()

    @staticmethod
    def update(group_id, name, description):
        with db_lock:
            conn = get_db_connection()
            conn.execute('UPDATE groups SET name = ?, description = ? WHERE id = ?',
                         (name, description, group_id))
            conn.commit()
            conn.close()

class Notification:
    @staticmethod
    def get_all():
        conn = get_db_connection()
        rows = conn.execute('SELECT * FROM notifications ORDER BY id DESC LIMIT 50').fetchall()
        conn.close()
        return [dict(row) for row in rows]

    @staticmethod
    def create(message, type='info'):
        with db_lock:
            conn = get_db_connection()
            conn.execute('INSERT INTO notifications (message, type, timestamp) VALUES (?, ?, ?)',
                         (message, type, datetime.datetime.now().isoformat()))
            conn.commit()
            conn.close()

    @staticmethod
    def delete(notif_id):
        with db_lock:
            conn = get_db_connection()
            conn.execute('DELETE FROM notifications WHERE id=?', (notif_id,))
            conn.commit()
            conn.close()


class Vulnerability:
    @staticmethod
    def get_all(status='Active'):
        conn = get_db_connection()
        query = "SELECT * FROM vulnerabilities WHERE 1=1"
        params = []
        if status:
            query += " AND status = ?"
            params.append(status)
        rows = conn.execute(query + " ORDER BY severity DESC", params).fetchall()
        conn.close()
        return [dict(row) for row in rows]

    @staticmethod
    def create(cve_id, description, severity, affected_component, status='Active'):
        with db_lock:
            conn = get_db_connection()
            conn.execute('INSERT INTO vulnerabilities (cve_id, description, severity, affected_component, status, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
                         (cve_id, description, severity, affected_component, status, datetime.datetime.now().isoformat()))
            conn.commit()
            conn.close()

class ThreatIntelligence:
    @staticmethod
    def get_all(limit=50):
        conn = get_db_connection()
        rows = conn.execute('SELECT * FROM threat_intelligence ORDER BY timestamp DESC LIMIT ?', (limit,)).fetchall()
        conn.close()
        return [dict(row) for row in rows]

    @staticmethod
    def create(threat_type, description, severity, confidence, remediation):
        with db_lock:
            conn = get_db_connection()
            conn.execute('INSERT INTO threat_intelligence (threat_type, description, severity, confidence_score, remediation, source, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
                         (threat_type, description, severity, confidence, remediation, 'CyberSecNexus AI', datetime.datetime.now().isoformat()))
            conn.commit()
            conn.close()

class ThirdPartyRisk:
    @staticmethod
    def get_all():
        conn = get_db_connection()
        rows = conn.execute('SELECT * FROM third_party_risk ORDER BY risk_score DESC').fetchall()
        conn.close()
        return [dict(row) for row in rows]

    @staticmethod
    def create_or_update(vendor_name, risk_score, status, details):
        with db_lock:
            conn = get_db_connection()
            # Check if exists
            existing = conn.execute('SELECT id FROM third_party_risk WHERE vendor_name = ?', (vendor_name,)).fetchone()
            if existing:
                conn.execute('UPDATE third_party_risk SET risk_score=?, status=?, details_json=?, last_audit=? WHERE id=?',
                             (risk_score, status, json.dumps(details), datetime.datetime.now().isoformat(), existing['id']))
            else:
                conn.execute('INSERT INTO third_party_risk (vendor_name, risk_score, status, details_json, last_audit) VALUES (?, ?, ?, ?, ?)',
                             (vendor_name, risk_score, status, json.dumps(details), datetime.datetime.now().isoformat()))
            conn.commit()
            conn.close()

class InsiderLog:
    @staticmethod
    def get_all(limit=50):
        conn = get_db_connection()
        rows = conn.execute('SELECT * FROM insider_logs ORDER BY timestamp DESC LIMIT ?', (limit,)).fetchall()
        conn.close()
        return [dict(row) for row in rows]

    @staticmethod
    def log(user, action, severity, details):
        with db_lock:
            conn = get_db_connection()
            conn.execute('INSERT INTO insider_logs (user, action, severity, details, timestamp) VALUES (?, ?, ?, ?, ?)',
                         (user, action, severity, details, datetime.datetime.now().isoformat()))
            conn.commit()
            conn.close()

import datetime
from .models import InsiderLog

class InsiderThreatDetector:
    def analyze_behavior(self, user_activity):
        """
        Analyzes user activity for insider threats.
        user_activity example: {"user": "admin", "action": "file_download", "time": "22:00"}
        """
        user = user_activity.get("user")
        action = user_activity.get("action")
        timestamp = user_activity.get("time", datetime.datetime.now().hour)
        
        # Rule 1: Unusual Login Time (10 PM to 5 AM)
        current_hour = datetime.datetime.now().hour
        if current_hour >= 22 or current_hour <= 5:
            self._log_threat(user, "Unusual Login Time", "Medium", f"User active at {current_hour}:00")

        # Rule 2: Excessive Data Access (Simulated by checking 'action' flag)
        if action == "bulk_export":
            self._log_threat(user, "Data Exfiltration Risk", "High", "Bulk export of sensitive data initiated")

        # Rule 3: Privilege Escalation
        if action == "change_role":
            self._log_threat(user, "Privilege Escalation Attempt", "Critical", "Attempt to modify user roles")

    def _log_threat(self, user, anomaly, severity, details):
        InsiderLog.log(user, anomaly, severity, details)

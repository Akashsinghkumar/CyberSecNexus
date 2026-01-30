class ThreatExplainer:
    def explain(self, threat_data):
        """
        Generates a human-readable explanation for a threat.
        Simulates an LLM-based explanation using templates.
        """
        threat_type = threat_data.get('type')
        details = threat_data.get('details', '')
        
        explanations = {
            "brute_force": f"We detected multiple failed login attempts ({details}). This suggests an attacker is trying to guess your password. Recommendation: Enable 2FA and lock the account temporarily.",
            "port_scan": f"An external IP is checking for open doors on your network ({details}). This is often a precursor to an attack. Recommendation: Block the IP and close unused ports.",
            "malware_traffic": f"Suspicious network traffic pattern detected resembling known malware ({details}). Your system might be infected. Recommendation: Run a full anti-virus scan immediately.",
            "insider_risk": f"Unusual user behavior detected ({details}). This could be a compromised account or malicious insider. Recommendation: Review recent access logs for this user."
        }
        
        return explanations.get(threat_type, "Abnormal activity detected. Please investigate logs.")

    def get_remediation(self, threat_type):
        remediations = {
            "brute_force": ["Isolate Account", "Reset Password", "Enable 2FA"],
            "port_scan": ["Block IP Address", "Update Firewall Rules"],
            "malware_traffic": ["Disconnect Network", "Run Antivirus", "Restore Backup"],
            "insider_risk": ["Revoke Sesssion", "Audit Access", "Contact User"]
        }
        return remediations.get(threat_type, ["Analyze Logs"])

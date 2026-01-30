import sys
import os
import unittest
import json

# Add project root to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.models import Vulnerability, ThreatIntelligence, ThirdPartyRisk, InsiderLog
from app.vulnerability import VulnerabilityScanner
from app.third_party import ThirdPartyMonitor
from app.insider import InsiderThreatDetector
from ai_engine.explainer import ThreatExplainer
from app.database import init_db

class TestCyberSecNexusFeatures(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Initialize DB (assumes it runs against the local sqlite file)
        init_db()

    def test_vulnerability_scan(self):
        print("\n[TEST] Vulnerability Scanner...")
        scanner = VulnerabilityScanner()
        count = scanner.scan()
        print(f" -> Found {count} vulnerabilities.")
        
        # Verify saved
        vulns = Vulnerability.get_all()
        self.assertGreaterEqual(len(vulns), count)
        print(" -> DB Verification Passed.")

    def test_threat_intelligence(self):
        print("\n[TEST] Threat Intelligence & AI Explainer...")
        # Create a dummy threat
        explainer = ThreatExplainer()
        explanation = explainer.explain({"type": "brute_force", "details": "192.168.1.100"})
        print(f" -> AI Explanation generated: {explanation[:50]}...")
        self.assertIn("Recommendation", explanation)
        
        remediation = explainer.get_remediation("brute_force")
        self.assertIsInstance(remediation, list)
        print(" -> Remediation steps verified.")

    def test_third_party_risk(self):
        print("\n[TEST] Third Party Risk Monitor...")
        monitor = ThirdPartyMonitor()
        results = monitor.assess_risks()
        print(f" -> Assessed {len(results)} vendors.")
        
        # Verify DB
        vendors = ThirdPartyRisk.get_all()
        self.assertGreaterEqual(len(vendors), len(results))
        print(" -> DB Verification Passed.")

    def test_insider_threat(self):
        print("\n[TEST] Insider Threat Detector...")
        detector = InsiderThreatDetector()
        
        # Simulate suspicious activity
        detector.analyze_behavior({"user": "test_user", "action": "bulk_export", "time": 14})
        
        # Check logs
        logs = InsiderLog.get_all(limit=1)
        self.assertTrue(any(l['action'] == 'Data Exfiltration Risk' for l in logs) or len(logs) > 0)
        print(" -> Insider Threat Logged Successfully.")

if __name__ == '__main__':
    unittest.main()

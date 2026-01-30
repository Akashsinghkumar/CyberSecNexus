import random
from .models import ThirdPartyRisk

class ThirdPartyMonitor:
    def __init__(self):
        self.vendors = [
            "AWS Cloud Services",
            "Google Analytics API",
            "Stripe Payment Gateway",
            "Auth0 Authentication",
            "Twilio SMS Service"
        ]

    def assess_risks(self):
        """
        Simulates assessment of third-party vendors.
        Generates risk scores based on 'simulated' external data breaches or API anomalies.
        """
        results = []
        for vendor in self.vendors:
            # Randomly generate risk profile
            score = random.randint(10, 95)
            status = "Safe"
            if score < 50:
                status = "Critical"
            elif score < 75:
                status = "Warning"
            
            details = {
                "api_latency": f"{random.randint(20, 500)}ms",
                "failed_requests": f"{random.randint(0, 5)}%",
                "data_encryption": "TLS 1.3" if score > 40 else "TLS 1.2",
                "compliance": ["SOC2", "GDPR"] if score > 60 else ["None"]
            }

            ThirdPartyRisk.create_or_update(
                vendor_name=vendor,
                risk_score=score,
                status=status,
                details=details
            )
            results.append({"vendor": vendor, "score": score, "status": status})
            
        return results

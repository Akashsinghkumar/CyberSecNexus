export const generateAIReport = (event) => {
    const isCritical = event.severity.toLowerCase() === 'critical';
    const isHigh = event.severity.toLowerCase() === 'high';

    let risk = "Low";
    if (isCritical) risk = "Critical - Immediate Action Required";
    else if (isHigh) risk = "High - Investigation Priority";
    else risk = "Medium - Monitor";

    // Deterministic "AI" Generation based on Event Type
    let analysis = "";

    switch (event.event_type) {
        case 'Brute Force':
            analysis = `THREAT SUMMARY:
Multiple failed login attempts detected from ${event.source_ip} targeting port ${event.port}. This pattern indicates a Brute Force attack attempting to guess valid credentials.

RISK LEVEL:
${risk}

ATTACK CATEGORY:
Credential Access (MITRE ATT&CK T1110)

WHY THIS HAPPENED:
The attacker is likely using an automated script to cycle through common passwords against your exposed service.

WHAT IT MEANS FOR THE SYSTEM:
If successful, the attacker gains unauthorized access. Currently, the system has blocked these attempts, but sustained volume can cause denial of service.

RECOMMENDED ACTIONS:
• Immediate: Block IP ${event.source_ip} at the firewall level.
• Immediate: Verify if any account was locked out.
• Long-term: Implement rate limiting and MFA.

IS THIS A FALSE POSITIVE?
No. High volume of failed failures in short duration is a strong indicator of malicious intent.`;
            break;

        case 'Port Scan':
            analysis = `THREAT SUMMARY:
A single source (${event.source_ip}) is attempting to connect to multiple ports on your network. This is a reconnaissance activity known as Port Scanning.

RISK LEVEL:
${risk}

ATTACK CATEGORY:
Discovery (MITRE ATT&CK T1046)

WHY THIS HAPPENED:
An external actor is mapping your network to find open services or vulnerabilities to exploit later.

WHAT IT MEANS FOR THE SYSTEM:
The scan itself is not damaging, but it is a precursor to a more specific attack. It reveals your attack surface.

RECOMMENDED ACTIONS:
• Immediate: Block the scanning IP.
• Long-term: Disable unused ports and services. Ensure firewall rules are strict (Allowlist only).

IS THIS A FALSE POSITIVE?
Unlikely. Unless this IP belongs to a known internal scanner (e.g., Nessus), this is unauthorized functionality.`;
            break;

        default: // Generic
            analysis = `THREAT SUMMARY:
Suspicious activity detected: "${event.description}" originating from ${event.source_ip}.

RISK LEVEL:
${risk}

ATTACK CATEGORY:
Initial Access / Execution

WHY THIS HAPPENED:
An anomaly was flagged by the rule "${event.event_type}". This deviates from the established baseline or matches a known signature.

WHAT IT MEANS FOR THE SYSTEM:
Potentially malicious traffic was intercepted. Further analysis of the payload is required to determine intent.

RECOMMENDED ACTIONS:
• Immediate: Investigate traffic logs from ${event.source_ip}.
• Immediate: Cross-reference with threat intelligence feeds.

IS THIS A FALSE POSITIVE?
Insufficient evidence. Verify if this matches recent authorized administrative activity.`;
    }

    return analysis;
};

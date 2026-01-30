from sklearn.ensemble import IsolationForest
import numpy as np

class AIThreatModel:
    def __init__(self):
        # Isolation Forest for anomaly detection
        # Contamination is the expected proportion of outliers
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.is_trained = False
        self.training_data = []

    def train(self, data):
        """
        Train the model with list of feature vectors.
        Each vector: [packet_rate, failed_attempts, port_count]
        """
        if len(data) < 5:
            return  # Not enough data to train

        self.model.fit(data)
        self.is_trained = True
        self.training_data.extend(data)

    def analyze(self, features):
        """
        Analyze a single feature vector.
        Returns: Score (-1 to 1, where lower is more anomalous)
        """
        if not self.is_trained:
            # If not trained, provide a heuristic-based score or default
            # For safety, simplistic fallback: 
            # High failed attempts or high packet rate = risk
            packet_rate, failed_attempts, port_count = features
            if failed_attempts > 5 or packet_rate > 100:
                return -1.0 # High risk
            return 1.0 # Normal

        # Predict returns -1 for outlier, 1 for inlier
        # decision_function returns lower scores for more anomalous
        score = self.model.decision_function([features])[0]
        return score

    def get_details(self, score):
        if score < -0.2:
            return "Highly Anomalous Activity Detected"
        elif score < 0:
            return "Suspicious Activity"
        else:
            return "Normal Behavior"

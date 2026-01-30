from flask import Flask
from flask_cors import CORS
from .database import init_db

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Initialize DB
    init_db()

    # Start Real-time Protection Engine
    from .protection import engine
    engine.start()
    
    # Register Blueprints
    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app

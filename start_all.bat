@echo off
cd /d "%~dp0"
echo ==========================================
echo   Starting CyberSec Nexus System...
echo ==========================================

echo 1. Launching Backend (Flask API)...
start "CyberSecNexus Backend" cmd /k "cd backend && python run.py"

echo 2. Launching Frontend (React UI)...
start "CyberSecNexus Client" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo   System Started!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ==========================================
pause

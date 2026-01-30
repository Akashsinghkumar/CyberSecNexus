@echo off
:: Nexus Security Suite - Master Launcher
:: This script ensures the app runs with the necessary privileges.

TITLE Nexus Security Suite - Active Protection
SETLOCAL EnableDelayedExpansion

:: --- 1. Check for Administrative Privileges ---
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Running with Administrative Privileges.
) else (
    echo [ERROR] Nexus Security Suite requires Administrator rights to manage the Firewall.
    echo Please right-click this file and select 'Run as Administrator'.
    pause
    exit /b
)

:: --- 2. Startup Splash ---
echo ============================================================
echo      _   _                         ____       _ _ 
echo     ^| ^\ ^| ^| _____  ___   _ ___    / ___^| _   _(_) ^|_ ___ 
echo     ^|  ^\^| ^|/ _ ^\ ^\ / / ^| ^| / __^|   ^\___ ^^\ ^| ^| ^| ^| __/ _ ^\
echo     ^| ^^|^\  ^|  __/^>   ^<^| ^|_^| ^\__ ^\    ___) ^| ^|_^| ^| ^| ^|_^|  __/
echo     ^|_^| ^\_^|^\___/_/^\_^\^\__,_^|___/   ^|____/ ^^\__,_^|_^|^\__^\___^|
echo.
echo              V 1.0.4 - ACTIVE PROTECTION READY
echo ============================================================
echo.

:: --- 3. Start Backend ---
echo [SYSTEM] Initializing Protection Engine (Python)...
start "Nexus Backend API" /min cmd /c "cd backend && python run.py"

:: --- 4. Start Frontend ---
echo [SYSTEM] Initializing User Interface (Vite)...
start "Nexus UI Client" /min cmd /c "cd frontend && npm run dev"

:: --- 5. Wait for Initialization ---
echo [INFO] Suite is loading. Interface will be available at http://localhost:5173
echo [INFO] Press any key to stop all protection services and exit.
echo.
pause

:: --- 6. Cleanup (Optional: Kill processes on exit) ---
echo [SYSTEM] Shutting down protection services...
taskkill /F /FI "WINDOWTITLE eq Nexus Backend API*" /T >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Nexus UI Client*" /T >nul 2>&1
echo [OK] All services stopped. Safe to close.
timeout /t 3
exit

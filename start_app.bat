@echo off
color 0A
echo ===========================================
echo       STARTING CALORIE APP SERVERS
echo ===========================================
echo.

echo Starting Backend (Node.js/Express)...
start "CalorieApp Backend" cmd /k "npm run dev"

echo Starting Frontend (React/Vite)...
start "CalorieApp Frontend" cmd /k "cd frontend && npm run dev"

echo Starting Cloudflare Tunnel...
start "Cloudflare Tunnel" cmd /k "cloudflared tunnel --url http://localhost:5173"

echo.
echo ===========================================
echo Servers are starting in separate windows!
echo.
echo Frontend will be at: http://localhost:5173
echo Backend will be at:  http://localhost:5000
echo Tunnel URL will be visible in the "Cloudflare Tunnel" window!
echo ===========================================
echo.
echo IMPORTANT: 
echo 1. Keep the three new black windows open while using the app.
echo 2. To stop the app, just close the three new black windows.
echo.
pause

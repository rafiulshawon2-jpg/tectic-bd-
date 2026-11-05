@echo off
title TecTic Bd - Smart Group Publisher Local Windows Worker
color 0b

echo ====================================================================
echo   TecTic Bd - Smart Group Publisher
echo   Persistent Local Windows Automation Worker Engine
echo   Profile Path: C:\TecTicBd_Worker_Profile
echo ====================================================================
echo.

cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo [ERROR] Node.js is not installed or not in your system PATH!
  echo Please download and install Node.js (v18 or higher) from https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [INFO] Installing required worker dependencies (express, puppeteer-core)...
  call npm install
  if %errorlevel% neq 0 (
    echo [ERROR] npm install failed. Check your internet connection.
    pause
    exit /b 1
  )
)

echo [INFO] Starting Worker Engine on port 4892...
echo [INFO] Browser profile will launch at C:\TecTicBd_Worker_Profile
echo [INFO] Log into your Facebook account once in this profile.
echo.

node worker.js

pause

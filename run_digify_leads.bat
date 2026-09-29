@echo off
title Digify Lead Generator System
echo ========================================================
echo   ⚡ DIGIFY SOFT SOLUTIONS - LEAD GENERATOR SYSTEM ⚡
echo ========================================================
echo Starting local system and opening in your browser...
start http://localhost:3030
node server.js
if %errorlevel% neq 0 (
  echo Node.js not found in background, opening standalone index.html directly...
  start index.html
)
pause

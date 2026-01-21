@echo off
color 0B
title Live Control - AmpliTube
cls
echo.
echo ========================================
echo    LIVE CONTROL - AmpliTube
echo ========================================
echo.

REM Build client
echo [1/3] Compilando cliente...
cd client
call npm run build >nul 2>&1
cd ..
echo       OK - Cliente compilado
echo.

REM Get IP address
echo [2/3] Obteniendo IP de red...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%
echo       OK - IP detectada: %IP%
echo.

REM Start server
echo [3/3] Iniciando servidor...
echo.
echo ========================================
echo    SERVIDOR CORRIENDO!
echo ========================================
echo.
echo    Local:    http://localhost:3000
echo    Red:      http://%IP%:3000
echo.
echo    CONECTA TU IPHONE A:
echo    http://%IP%:3000
echo.
echo ========================================
echo.
echo Asegurate de que:
echo  - loopMIDI este ejecutandose
echo  - AmpliTube 5 MAX este abierto
echo  - Tu iPhone este en la misma red WiFi
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

node server/index.js


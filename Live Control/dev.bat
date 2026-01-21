@echo off
cls
echo ========================================
echo   LIVE CONTROL - Modo Desarrollo
echo ========================================
echo.

REM Get IP address
echo Obteniendo IP de red...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%
echo.

echo ========================================
echo   SERVIDOR CORRIENDO!
echo ========================================
echo.
echo   Local:    http://localhost:3000
echo   Red:      http://%IP%:3000
echo.
echo   CONECTA TU IPHONE A:
echo   http://%IP%:3000
echo.
echo ========================================
echo.
echo NOTA: Usa 'start.bat' para compilar
echo       antes de conectar desde iPhone
echo.
echo Presiona Ctrl+C para detener
echo.

node server/index.js


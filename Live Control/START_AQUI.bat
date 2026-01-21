@echo off
chcp 65001 >nul
color 0B
title Live Control - AmpliTube
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║              🎸 LIVE CONTROL - AmpliTube                       ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 1: ACTUALIZAR DESDE GIT
:: ═══════════════════════════════════════════════════════════════

echo [1/5] Actualizando presets desde repositorio...
echo.

where git >nul 2>&1
if %errorlevel% equ 0 (
    if exist ".git" (
        git pull >nul 2>&1
        if %errorlevel% equ 0 (
            echo       ✅ Presets actualizados
        ) else (
            echo       ⚠️  No se pudo actualizar ^(sin conexión o sin cambios^)
        )
    ) else (
        echo       ⚠️  No es un repositorio Git ^(omitiendo actualización^)
    )
) else (
    echo       ⚠️  Git no instalado ^(omitiendo actualización^)
)
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 2: INICIAR LOOPMIDI
:: ═══════════════════════════════════════════════════════════════

echo [2/5] Verificando loopMIDI...
echo.

tasklist /FI "IMAGENAME eq loopMIDI.exe" 2>NUL | find /I /N "loopMIDI.exe">NUL
if %errorlevel% equ 0 (
    echo       ✅ loopMIDI está ejecutándose
) else (
    echo       ⚠️  loopMIDI no está ejecutándose
    echo       💡 Intentando iniciar loopMIDI...

    REM Intentar iniciar loopMIDI desde ubicaciones comunes
    if exist "C:\Program Files (x86)\Tobias Erichsen\loopMIDI\loopMIDI.exe" (
        start "" "C:\Program Files (x86)\Tobias Erichsen\loopMIDI\loopMIDI.exe"
        timeout /t 2 >nul
        echo       ✅ loopMIDI iniciado
    ) else if exist "C:\Program Files\Tobias Erichsen\loopMIDI\loopMIDI.exe" (
        start "" "C:\Program Files\Tobias Erichsen\loopMIDI\loopMIDI.exe"
        timeout /t 2 >nul
        echo       ✅ loopMIDI iniciado
    ) else (
        echo       ❌ No se encontró loopMIDI instalado
        echo       📥 Descárgalo desde: https://www.tobias-erichsen.de/software/loopmidi.html
    )
)
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 3: INICIAR AMPLITUBE
:: ═══════════════════════════════════════════════════════════════

echo [3/5] Verificando AmpliTube 5 MAX...
echo.

tasklist /FI "IMAGENAME eq AmpliTube 5.exe" 2>NUL | find /I /N "AmpliTube 5.exe">NUL
if %errorlevel% equ 0 (
    echo       ✅ AmpliTube 5 MAX ya está ejecutándose
) else (
    echo       💡 Intentando iniciar AmpliTube 5 MAX...

    REM Intentar iniciar AmpliTube desde ubicaciones comunes
    if exist "C:\Program Files\IK Multimedia\AmpliTube 5\AmpliTube 5.exe" (
        start "" "C:\Program Files\IK Multimedia\AmpliTube 5\AmpliTube 5.exe"
        timeout /t 3 >nul
        echo       ✅ AmpliTube 5 MAX iniciado
    ) else if exist "C:\Program Files (x86)\IK Multimedia\AmpliTube 5\AmpliTube 5.exe" (
        start "" "C:\Program Files (x86)\IK Multimedia\AmpliTube 5\AmpliTube 5.exe"
        timeout /t 3 >nul
        echo       ✅ AmpliTube 5 MAX iniciado
    ) else (
        echo       ⚠️  No se encontró AmpliTube 5 en ubicaciones estándar
        echo       💡 Ábrelo manualmente si es necesario
    )
)
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 4: COMPILAR CLIENTE
:: ═══════════════════════════════════════════════════════════════

echo [4/5] Compilando cliente...
cd client
call npm run build >nul 2>&1
cd ..
echo       ✅ Cliente compilado
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 5: OBTENER IP Y INICIAR SERVIDOR
:: ═══════════════════════════════════════════════════════════════

echo [5/5] Obteniendo IP de red...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%
echo       ✅ IP detectada: %IP%
echo.
echo.

:: ═══════════════════════════════════════════════════════════════
:: SERVIDOR INICIADO
:: ═══════════════════════════════════════════════════════════════

color 0A
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║                  🚀 SERVIDOR CORRIENDO!                        ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.
echo 🌐 ACCESO:
echo ═══════════════════════════════════════════════════════════════
echo.
echo    💻 Local:     http://localhost:3000
echo    📱 Red:       http://%IP%:3000
echo.
echo.
echo 📱 CONECTA TU IPHONE/TABLET:
echo ═══════════════════════════════════════════════════════════════
echo.
echo    1. Conecta a la misma red WiFi
echo    2. Abre Safari (o tu navegador)
echo    3. Escribe: http://%IP%:3000
echo.
echo.
echo ✅ CHECKLIST:
echo ═══════════════════════════════════════════════════════════════
echo.
echo    ✓ Presets actualizados desde Git
echo    ✓ loopMIDI ejecutándose
echo    ✓ AmpliTube 5 MAX abierto
echo    ✓ Servidor Node.js corriendo
echo.
echo.
echo ⚠️  Presiona Ctrl+C para detener el servidor
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

node server/index.js


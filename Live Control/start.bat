@echo off
chcp 65001 >nul
cls
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

where git >nul 2>&1
if %errorlevel% equ 0 (
    if exist ".git" (
        git pull
        if %errorlevel% equ 0 (
            echo ✅ Presets actualizados
        ) else (
            echo ⚠️  No se pudo actualizar
        )
    ) else (
        echo ⚠️  No es un repositorio Git
    )
) else (
    echo ⚠️  Git no instalado
)
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 2: INICIAR LOOPMIDI
:: ═══════════════════════════════════════════════════════════════

echo [2/5] Verificando loopMIDI...

tasklist /FI "IMAGENAME eq loopMIDI.exe" 2>NUL | find /I /N "loopMIDI.exe">NUL
if %errorlevel% equ 0 (
    echo ✅ loopMIDI está ejecutándose
) else (
    echo ⚠️  loopMIDI no está ejecutándose
    echo 💡 Intentando iniciar loopMIDI...

    if exist "C:\Program Files (x86)\Tobias Erichsen\loopMIDI\loopMIDI.exe" (
        start "" "C:\Program Files (x86)\Tobias Erichsen\loopMIDI\loopMIDI.exe"
        timeout /t 2 >nul
        echo ✅ loopMIDI iniciado
    ) else if exist "C:\Program Files\Tobias Erichsen\loopMIDI\loopMIDI.exe" (
        start "" "C:\Program Files\Tobias Erichsen\loopMIDI\loopMIDI.exe"
        timeout /t 2 >nul
        echo ✅ loopMIDI iniciado
    ) else (
        echo ❌ No se encontró loopMIDI
    )
)
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 3: INICIAR AMPLITUBE
:: ═══════════════════════════════════════════════════════════════

echo [3/5] Verificando AmpliTube 5 MAX...

tasklist /FI "IMAGENAME eq AmpliTube 5.exe" 2>NUL | find /I /N "AmpliTube 5.exe">NUL
if %errorlevel% equ 0 (
    echo ✅ AmpliTube 5 MAX ya está ejecutándose
) else (
    echo 💡 Intentando iniciar AmpliTube 5 MAX...

    if exist "C:\Program Files\IK Multimedia\AmpliTube 5\AmpliTube 5.exe" (
        start "" "C:\Program Files\IK Multimedia\AmpliTube 5\AmpliTube 5.exe"
        timeout /t 3 >nul
        echo ✅ AmpliTube 5 MAX iniciado
    ) else if exist "C:\Program Files (x86)\IK Multimedia\AmpliTube 5\AmpliTube 5.exe" (
        start "" "C:\Program Files (x86)\IK Multimedia\AmpliTube 5\AmpliTube 5.exe"
        timeout /t 3 >nul
        echo ✅ AmpliTube 5 MAX iniciado
    ) else (
        echo ⚠️  No se encontró AmpliTube 5
    )
)
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 4: COMPILAR CLIENTE
:: ═══════════════════════════════════════════════════════════════

echo [4/5] Compilando cliente...
cd client
call npm run build
cd ..
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
echo.

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║                  🚀 SERVIDOR CORRIENDO!                        ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🌐 ACCESO:
echo   💻 Local:     http://localhost:3000
echo   📱 Red:       http://%IP%:3000
echo.
echo 📱 CONECTA TU IPHONE/TABLET:
echo   http://%IP%:3000
echo.
echo ✅ CHECKLIST:
echo   ✓ Presets actualizados
echo   ✓ loopMIDI ejecutándose
echo   ✓ AmpliTube 5 MAX abierto
echo.
echo ⚠️  Presiona Ctrl+C para detener
echo.

node server/index.js


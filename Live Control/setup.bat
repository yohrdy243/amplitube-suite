@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ═══════════════════════════════════════════════════════════════
::  🎸 LIVE CONTROL - INSTALADOR COMPLETO
:: ═══════════════════════════════════════════════════════════════

color 0A
title 🎸 Live Control - Instalador

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║           🎸 LIVE CONTROL - INSTALADOR COMPLETO                ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 1: VERIFICAR NODE.JS
:: ═══════════════════════════════════════════════════════════════

echo [1/5] Verificando Node.js...
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ❌ ERROR: Node.js no está instalado
    echo.
    echo 📥 Por favor instala Node.js desde:
    echo    https://nodejs.org/
    echo.
    echo    Descarga la versión LTS ^(recomendada^)
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js detectado: %NODE_VERSION%

:: Verificar versión mínima (v18+)
set VERSION_NUM=%NODE_VERSION:v=%
for /f "tokens=1 delims=." %%a in ("%VERSION_NUM%") do set MAJOR_VERSION=%%a

if %MAJOR_VERSION% LSS 18 (
    color 0E
    echo.
    echo ⚠️  ADVERTENCIA: Node.js versión antigua detectada
    echo    Tienes: %NODE_VERSION%
    echo    Recomendado: v18 o superior
    echo.
    echo    La instalación puede fallar con versiones antiguas
    echo.
    choice /C SN /M "¿Continuar de todas formas? (S=Sí, N=No)"
    if errorlevel 2 exit /b 1
)

echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 2: VERIFICAR LOOPMIDI
:: ═══════════════════════════════════════════════════════════════

echo [2/5] Verificando loopMIDI...
echo.

tasklist /FI "IMAGENAME eq loopMIDI.exe" 2>NUL | find /I /N "loopMIDI.exe">NUL
if %errorlevel% equ 0 (
    echo ✅ loopMIDI está ejecutándose
) else (
    color 0E
    echo ⚠️  loopMIDI no está ejecutándose
    echo.
    echo 📥 Si no lo tienes instalado, descárgalo desde:
    echo    https://www.tobias-erichsen.de/software/loopmidi.html
    echo.
    echo 💡 Después de instalarlo:
    echo    1. Abre loopMIDI
    echo    2. Crea un puerto llamado "loopMIDI Port"
    echo    3. Déjalo ejecutándose
    echo.
    choice /C SN /M "¿Continuar de todas formas? (S=Sí, N=No)"
    if errorlevel 2 exit /b 1
)

echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 3: INSTALAR DEPENDENCIAS
:: ═══════════════════════════════════════════════════════════════

echo [3/5] Instalando dependencias del servidor...
echo.

call npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ❌ ERROR: Falló la instalación de dependencias del servidor
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Dependencias del servidor instaladas
echo.

echo [3/5] Instalando dependencias del cliente...
echo.

cd client
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ❌ ERROR: Falló la instalación de dependencias del cliente
    echo.
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ Dependencias del cliente instaladas
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 4: COMPILAR CLIENTE
:: ═══════════════════════════════════════════════════════════════

echo [4/5] Compilando cliente para producción...
echo.

cd client
call npm run build
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ❌ ERROR: Falló la compilación del cliente
    echo.
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ Cliente compilado exitosamente
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 5: CREAR ACCESO DIRECTO
:: ═══════════════════════════════════════════════════════════════

echo [5/5] Creando acceso directo en el escritorio...
echo.

if exist "crear-acceso-directo.vbs" (
    cscript //nologo crear-acceso-directo.vbs
    echo ✅ Acceso directo creado en el escritorio
) else (
    echo ⚠️  No se encontró crear-acceso-directo.vbs
)

echo.

:: ═══════════════════════════════════════════════════════════════
:: INSTALACIÓN COMPLETADA
:: ═══════════════════════════════════════════════════════════════

color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║              ✅ INSTALACIÓN COMPLETADA EXITOSAMENTE            ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.
echo 🎯 PRÓXIMOS PASOS:
echo ═══════════════════════════════════════════════════════════════
echo.
echo 1️⃣  Asegúrate de que loopMIDI esté ejecutándose
echo    - Abre loopMIDI
echo    - Verifica que existe "loopMIDI Port"
echo.
echo 2️⃣  Abre AmpliTube 5 MAX (Standalone)
echo    - Ve a Settings → MIDI
echo    - MIDI Input Device: loopMIDI Port
echo    - Enable MIDI Input: ✓
echo.
echo 3️⃣  Inicia Live Control:
echo    - Doble clic en START_AQUI.bat
echo    - O usa el acceso directo del escritorio
echo.
echo 4️⃣  Conecta desde tu dispositivo móvil:
echo    - Conecta a la misma red WiFi
echo    - Abre el navegador
echo    - Usa la URL que muestre el servidor
echo.
echo.
echo 📚 DOCUMENTACIÓN:
echo ═══════════════════════════════════════════════════════════════
echo.
echo    INICIO_RAPIDO.md      - Guía rápida de inicio
echo    FIRST_RUN.md          - Primera ejecución paso a paso
echo    AMPLITUBE_SETUP.md    - Configuración de AmpliTube
echo    TROUBLESHOOTING.md    - Solución de problemas
echo.
echo.
echo ═══════════════════════════════════════════════════════════════
echo           ¡Listo para rockear! 🎸🔥
echo ═══════════════════════════════════════════════════════════════
echo.
echo.

pause


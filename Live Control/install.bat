@echo off
echo ========================================
echo  LIVE CONTROL - Instalacion
echo ========================================
echo.

echo [1/4] Instalando dependencias del servidor...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar dependencias del servidor
    pause
    exit /b 1
)

echo.
echo [2/4] Instalando dependencias del cliente...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar dependencias del cliente
    pause
    exit /b 1
)
cd ..

echo.
echo [3/4] Creando archivo de configuracion...
if not exist .env (
    copy .env.example .env
    echo Archivo .env creado. Edita este archivo si necesitas cambiar la configuracion.
) else (
    echo Archivo .env ya existe. No se sobrescribira.
)

echo.
echo [4/4] Compilando cliente...
cd client
call npm run build
cd ..

echo.
echo ========================================
echo  INSTALACION COMPLETADA!
echo ========================================
echo.
echo Proximos pasos:
echo 1. Asegurate de tener loopMIDI instalado y ejecutandose
echo 2. Configura AmpliTube 5 MAX para recibir MIDI de loopMIDI Port
echo 3. Ejecuta: npm start
echo 4. Abre http://localhost:3000 en tu navegador
echo.
pause


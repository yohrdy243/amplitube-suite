@echo off
echo ========================================
echo  LIVE CONTROL - Instalacion (FIX)
echo ========================================
echo.

echo Verificando Node.js...
node --version
echo.

echo IMPORTANTE: Necesitas Node.js v18 o superior
echo Si tienes v16, ejecuta:
echo   nvm install 20
echo   nvm use 20
echo.
pause

echo [1/5] Limpiando instalacion anterior...
if exist node_modules (
    rmdir /s /q node_modules
    echo Carpeta node_modules eliminada
)
if exist package-lock.json (
    del package-lock.json
    echo Archivo package-lock.json eliminado
)
if exist client\node_modules (
    rmdir /s /q client\node_modules
    echo Carpeta client\node_modules eliminada
)
if exist client\package-lock.json (
    del client\package-lock.json
    echo Archivo client\package-lock.json eliminado
)
echo.

echo [2/5] Instalando dependencias del servidor (con compatibilidad)...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Fallo al instalar dependencias del servidor
    echo.
    echo POSIBLES SOLUCIONES:
    echo 1. Actualizar Node.js a v18+: nvm install 20 ^&^& nvm use 20
    echo 2. Instalar Build Tools: npm install --global windows-build-tools
    echo 3. Ver FIX_INSTALLATION.md para mas detalles
    echo.
    pause
    exit /b 1
)

echo.
echo [3/5] Instalando dependencias del cliente...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar dependencias del cliente
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [4/5] Creando archivo de configuracion...
if not exist .env (
    copy .env.example .env
    echo Archivo .env creado
) else (
    echo Archivo .env ya existe
)

echo.
echo [5/5] Compilando cliente...
cd client
call npm run build
if %errorlevel% neq 0 (
    echo ADVERTENCIA: Fallo al compilar cliente
    echo Puedes intentar compilar manualmente mas tarde con:
    echo   cd client ^&^& npm run build
    cd ..
    pause
    exit /b 1
)
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
echo Si tuviste problemas, lee FIX_INSTALLATION.md
echo.
pause


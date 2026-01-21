@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ═══════════════════════════════════════════════════════════════
::  🔄 LIVE CONTROL - ACTUALIZADOR
:: ═══════════════════════════════════════════════════════════════

color 0B
title 🔄 Live Control - Actualizador

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║              🔄 LIVE CONTROL - ACTUALIZADOR                    ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 1: VERIFICAR GIT
:: ═══════════════════════════════════════════════════════════════

echo [1/6] Verificando Git...
echo.

where git >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ❌ ERROR: Git no está instalado
    echo.
    echo 📥 Por favor instala Git desde:
    echo    https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✅ Git detectado
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 2: VERIFICAR REPOSITORIO
:: ═══════════════════════════════════════════════════════════════

echo [2/6] Verificando repositorio Git...
echo.

if not exist ".git" (
    color 0E
    echo ⚠️  ADVERTENCIA: No se detectó repositorio Git
    echo.
    echo    Este proyecto no está vinculado a un repositorio Git.
    echo    No se puede actualizar automáticamente.
    echo.
    echo 💡 Para habilitar actualizaciones automáticas:
    echo    1. Inicializa un repositorio: git init
    echo    2. Agrega un remote: git remote add origin [URL]
    echo    3. Ejecuta este script nuevamente
    echo.
    pause
    exit /b 1
)

echo ✅ Repositorio Git detectado
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 3: GUARDAR CAMBIOS LOCALES
:: ═══════════════════════════════════════════════════════════════

echo [3/6] Verificando cambios locales...
echo.

git diff --quiet
if %errorlevel% neq 0 (
    color 0E
    echo ⚠️  Tienes cambios sin guardar
    echo.
    choice /C GDC /M "¿Qué deseas hacer? (G=Guardar, D=Descartar, C=Cancelar)"
    
    if errorlevel 3 (
        echo.
        echo ❌ Actualización cancelada
        pause
        exit /b 0
    )
    
    if errorlevel 2 (
        echo.
        echo 🗑️  Descartando cambios locales...
        git reset --hard
        echo ✅ Cambios descartados
    )
    
    if errorlevel 1 (
        echo.
        echo 💾 Guardando cambios locales...
        git stash
        echo ✅ Cambios guardados temporalmente
        set STASHED=1
    )
) else (
    echo ✅ No hay cambios locales
)

echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 4: OBTENER ÚLTIMA VERSIÓN
:: ═══════════════════════════════════════════════════════════════

echo [4/6] Descargando última versión...
echo.

git pull
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ❌ ERROR: Falló la actualización desde el repositorio
    echo.
    echo 💡 Posibles causas:
    echo    - No hay conexión a internet
    echo    - El repositorio remoto no está configurado
    echo    - Hay conflictos con cambios locales
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Código actualizado
echo.

:: Restaurar cambios guardados si los había
if defined STASHED (
    echo 💾 Restaurando cambios guardados...
    git stash pop
    echo ✅ Cambios restaurados
    echo.
)

:: ═══════════════════════════════════════════════════════════════
:: PASO 5: ACTUALIZAR DEPENDENCIAS
:: ═══════════════════════════════════════════════════════════════

echo [5/6] Actualizando dependencias...
echo.

echo    → Servidor...
call npm install
if %errorlevel% neq 0 (
    color 0E
    echo ⚠️  Advertencia: Falló actualización de dependencias del servidor
)

echo.
echo    → Cliente...
cd client
call npm install
if %errorlevel% neq 0 (
    color 0E
    echo ⚠️  Advertencia: Falló actualización de dependencias del cliente
)

echo.
echo    → Compilando cliente...
call npm run build
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ❌ ERROR: Falló la compilación del cliente
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ Dependencias actualizadas y cliente compilado
echo.

:: ═══════════════════════════════════════════════════════════════
:: PASO 6: REINICIAR SERVIDOR (OPCIONAL)
:: ═══════════════════════════════════════════════════════════════

echo [6/6] ¿Deseas iniciar el servidor ahora?
echo.

choice /C SN /M "Iniciar Live Control (S=Sí, N=No)"

if errorlevel 2 (
    goto :FINISH
)

echo.
echo 🚀 Iniciando Live Control...
echo.
echo ═══════════════════════════════════════════════════════════════
echo.

call START_AQUI.bat
exit /b 0

:FINISH

:: ═══════════════════════════════════════════════════════════════
:: ACTUALIZACIÓN COMPLETADA
:: ═══════════════════════════════════════════════════════════════

color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║            ✅ ACTUALIZACIÓN COMPLETADA EXITOSAMENTE            ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.
echo 🎯 PRÓXIMOS PASOS:
echo ═══════════════════════════════════════════════════════════════
echo.
echo    Para iniciar Live Control ejecuta:
echo    → START_AQUI.bat
echo.
echo    O usa el acceso directo del escritorio
echo.
echo.
echo 📋 CAMBIOS RECIENTES:
echo ═══════════════════════════════════════════════════════════════
echo.
echo    Revisa CHANGELOG.md para ver qué cambió en esta versión
echo.
echo.
echo ═══════════════════════════════════════════════════════════════
echo           ¡Actualización exitosa! 🎸🔥
echo ═══════════════════════════════════════════════════════════════
echo.
echo.

pause


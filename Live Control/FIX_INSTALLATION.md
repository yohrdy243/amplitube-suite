# 🔧 Solución de Errores de Instalación

## ⚠️ PROBLEMA DETECTADO

El error que estás viendo es causado por **2 problemas**:

### 1. Node.js Versión Antigua
```
current: { node: 'v16.14.2', npm: '8.5.0' }
```
**Necesitas:** Node.js v18.0.0 o superior

### 2. Falta Visual Studio C++ Build Tools
```
gyp ERR! find VS - missing any VC++ toolset
```
**Necesitas:** Visual Studio Build Tools con "Desktop development with C++"

---

## ✅ SOLUCIÓN RÁPIDA (RECOMENDADA)

### Paso 1: Actualizar Node.js

Tienes **NVM** instalado, así que es muy fácil:

```bash
# Ver versiones disponibles
nvm list available

# Instalar Node.js 20 (LTS)
nvm install 20

# Usar Node.js 20
nvm use 20

# Verificar
node --version
```

**Debe mostrar:** `v20.x.x`

### Paso 2: Instalar Visual Studio Build Tools

#### Opción A: Instalador Automático (MÁS RÁPIDO)

Ejecuta en PowerShell **como Administrador**:

```powershell
npm install --global windows-build-tools
```

⏳ **Tiempo:** 15-30 minutos (se descarga e instala automáticamente)

#### Opción B: Instalación Manual

1. Descargar: https://visualstudio.microsoft.com/downloads/
2. Buscar **"Build Tools for Visual Studio 2022"**
3. Ejecutar instalador
4. Seleccionar: **"Desktop development with C++"**
5. Instalar

⏳ **Tiempo:** 10-20 minutos

### Paso 3: Reiniciar Terminal

**IMPORTANTE:** Después de instalar Node.js y Build Tools, **cierra y abre de nuevo** la terminal.

### Paso 4: Instalar Live Control

```bash
# Limpiar instalación anterior (si existe)
rmdir /s /q node_modules
del package-lock.json

# Instalar de nuevo
.\install.bat
```

---

## 🚀 VERIFICACIÓN

Después de seguir los pasos, verifica:

### 1. Node.js actualizado
```bash
node --version
```
✅ Debe mostrar: `v20.x.x` o `v18.x.x`

### 2. Build Tools instalados
```bash
npm config get msvs_version
```
✅ Debe mostrar: `2022` o `2019` o `2017`

### 3. Instalación exitosa
```bash
.\install.bat
```
✅ Debe completar sin errores

---

## 📝 COMANDOS COMPLETOS (COPIA Y PEGA)

Ejecuta estos comandos **uno por uno** en PowerShell:

```powershell
# 1. Actualizar Node.js
nvm install 20
nvm use 20
node --version

# 2. Limpiar instalación anterior
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force client\node_modules -ErrorAction SilentlyContinue
Remove-Item client\package-lock.json -ErrorAction SilentlyContinue

# 3. Instalar Build Tools (como Administrador)
npm install --global windows-build-tools

# 4. Reiniciar terminal (cerrar y abrir de nuevo)

# 5. Instalar Live Control
.\install.bat
```

---

## 🎯 ALTERNATIVA: Instalación Manual Paso a Paso

Si `install.bat` sigue fallando, hazlo manualmente:

### 1. Instalar dependencias del servidor

```bash
npm install --legacy-peer-deps
```

**Nota:** `--legacy-peer-deps` ignora conflictos de versiones de Supabase

### 2. Instalar dependencias del cliente

```bash
cd client
npm install
cd ..
```

### 3. Compilar frontend

```bash
cd client
npm run build
cd ..
```

### 4. Crear archivo .env

```bash
copy .env.example .env
```

### 5. Iniciar servidor

```bash
npm start
```

---

## 🔍 VERIFICAR QUE FUNCIONA

Después de instalar correctamente, al ejecutar `npm start` debes ver:

```
🎸 LIVE CONTROL - AmpliTube MIDI Controller
==========================================

✅ Datos cargados: 5 canciones, 1 setlists

🎹 MIDI Ports disponibles: X
   [0] Microsoft GS Wavetable Synth
   ...

🚀 Servidor iniciado en http://localhost:3000
```

---

## ❌ SI SIGUE FALLANDO

### Error: "Cannot find module 'midi'"

**Solución:**
```bash
npm install midi --save
```

### Error: "gyp ERR! find VS"

**Solución:**
1. Verificar que Build Tools está instalado
2. Abrir Visual Studio Installer
3. Modificar instalación
4. Agregar: "Desktop development with C++"

### Error: "EACCES: permission denied"

**Solución:**
```bash
# Ejecutar PowerShell como Administrador
npm cache clean --force
npm install
```

---

## 📞 RESUMEN DE PASOS

1. ✅ **Actualizar Node.js a v20** (usando `nvm install 20` y `nvm use 20`)
2. ✅ **Instalar Build Tools** (usando `npm install --global windows-build-tools`)
3. ✅ **Reiniciar terminal**
4. ✅ **Limpiar instalación anterior** (`rmdir node_modules`, `del package-lock.json`)
5. ✅ **Instalar de nuevo** (`.\install.bat`)
6. ✅ **Iniciar servidor** (`npm start`)
7. ✅ **Abrir navegador** (`http://localhost:3000`)

---

## ⏱️ TIEMPO ESTIMADO

- Actualizar Node.js: **2 minutos**
- Instalar Build Tools: **15-30 minutos**
- Instalar Live Control: **3-5 minutos**

**Total:** ~20-40 minutos

---

## 🎉 DESPUÉS DE INSTALAR

Una vez que todo funcione:

1. Leer **FIRST_RUN.md** para primera ejecución
2. Configurar **loopMIDI**
3. Configurar **AmpliTube**
4. ¡Empezar a usar Live Control! 🎸

---

**¿Necesitas ayuda?** Consulta **TROUBLESHOOTING.md**


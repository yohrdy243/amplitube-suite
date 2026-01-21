# 🔧 Instalar Visual Studio C++ Build Tools

## ⚠️ PROBLEMA ACTUAL

Tienes Visual Studio 2022 instalado, pero **falta el componente de C++**:

```
gyp ERR! find VS - missing any VC++ toolset
```

---

## ✅ SOLUCIÓN: Agregar C++ a Visual Studio 2022

### **Opción 1: Modificar Visual Studio Existente (RECOMENDADO)**

1. **Abrir Visual Studio Installer**
   - Buscar en el menú inicio: "Visual Studio Installer"
   - O ir a: `C:\Program Files (x86)\Microsoft Visual Studio\Installer\vs_installer.exe`

2. **Modificar la instalación**
   - Hacer clic en **"Modificar"** en Visual Studio Community 2022

3. **Seleccionar componente de C++**
   - En la pestaña **"Workloads"**
   - Marcar: ✅ **"Desktop development with C++"**
   
4. **Instalar**
   - Hacer clic en **"Modify"** o **"Modificar"**
   - Esperar a que descargue e instale (10-20 minutos)

5. **Reiniciar**
   - Cerrar Visual Studio Installer
   - Reiniciar la terminal

---

### **Opción 2: Instalar Build Tools Standalone**

Si no quieres modificar Visual Studio, puedes instalar solo las Build Tools:

1. **Descargar Build Tools**
   - Ir a: https://visualstudio.microsoft.com/downloads/
   - Buscar: **"Build Tools for Visual Studio 2022"**
   - Descargar

2. **Ejecutar instalador**
   - Ejecutar el archivo descargado

3. **Seleccionar componente**
   - Marcar: ✅ **"Desktop development with C++"**
   - Instalar

---

### **Opción 3: Instalación Automática (PowerShell como Admin)**

```powershell
# Ejecutar PowerShell como Administrador
npm install --global windows-build-tools
```

⏳ **Tiempo:** 15-30 minutos

---

## 🎯 DESPUÉS DE INSTALAR

Una vez que hayas agregado el componente de C++:

### **1. Reiniciar terminal**

Cerrar y abrir de nuevo PowerShell.

### **2. Verificar que Node.js v20 está activo**

```bash
nvm use 20
node --version
```

Debe mostrar: `v20.19.6`

### **3. Limpiar instalación anterior**

```bash
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
```

### **4. Instalar Live Control**

```bash
npm install --legacy-peer-deps
```

### **5. Instalar cliente**

```bash
cd client
npm install
cd ..
```

### **6. Compilar frontend**

```bash
cd client
npm run build
cd ..
```

### **7. Crear .env**

```bash
copy .env.example .env
```

### **8. Iniciar servidor**

```bash
npm start
```

---

## 🔍 VERIFICAR QUE FUNCIONA

Al ejecutar `npm start`, debes ver:

```
🎸 LIVE CONTROL - AmpliTube MIDI Controller
==========================================

✅ Datos cargados: 5 canciones, 1 setlists

🎹 MIDI Ports disponibles: X

🚀 Servidor iniciado en http://localhost:3000
```

---

## 📝 RESUMEN

1. ✅ **Abrir Visual Studio Installer**
2. ✅ **Modificar Visual Studio 2022**
3. ✅ **Agregar "Desktop development with C++"**
4. ✅ **Instalar (10-20 min)**
5. ✅ **Reiniciar terminal**
6. ✅ **Ejecutar: `npm install --legacy-peer-deps`**
7. ✅ **Ejecutar: `cd client && npm install && npm run build && cd ..`**
8. ✅ **Ejecutar: `npm start`**

---

## ⏱️ TIEMPO TOTAL

- Modificar Visual Studio: **10-20 minutos**
- Instalar Live Control: **3-5 minutos**

**Total:** ~15-25 minutos

---

**Siguiente paso:** Modificar Visual Studio 2022 para agregar C++


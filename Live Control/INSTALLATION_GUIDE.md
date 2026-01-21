# 🔧 Guía de Instalación - Live Control

Guía completa para instalar y ejecutar Live Control correctamente.

---

## ⚠️ PROBLEMAS DETECTADOS

Si ves errores al ejecutar `install.bat`, probablemente sea por:

1. **Node.js versión antigua** (tienes v16.14.2, necesitas v18+)
2. **Falta Visual Studio Build Tools** (para compilar el paquete `midi`)

---

## 📋 REQUISITOS PREVIOS

### 1. Node.js 18 o superior

**Verificar versión actual:**
```bash
node --version
```

**Si tienes v16 o inferior, actualizar:**

#### Opción A: Descargar e instalar
1. Ir a: https://nodejs.org/
2. Descargar **LTS** (Long Term Support) - actualmente v20.x o v22.x
3. Ejecutar instalador
4. Reiniciar terminal

#### Opción B: Usar NVM (Node Version Manager)
```bash
# Si ya tienes NVM instalado
nvm install 20
nvm use 20
```

### 2. Visual Studio Build Tools

El paquete `midi` necesita compilarse en Windows, lo que requiere herramientas de C++.

#### Opción A: Instalar Build Tools (RECOMENDADO)

1. Descargar: https://visualstudio.microsoft.com/downloads/
2. Buscar "Build Tools for Visual Studio 2022"
3. Durante la instalación, seleccionar:
   - ✅ **Desktop development with C++**
4. Instalar (puede tardar 10-20 minutos)

#### Opción B: Instalar Visual Studio Community (completo)

1. Descargar: https://visualstudio.microsoft.com/vs/community/
2. Durante la instalación, seleccionar:
   - ✅ **Desktop development with C++**
3. Instalar

#### Opción C: Usar windows-build-tools (automático)

```bash
# Ejecutar PowerShell como Administrador
npm install --global windows-build-tools
```

**Nota:** Esto puede tardar 15-30 minutos.

### 3. loopMIDI

1. Descargar: https://www.tobias-erichsen.de/software/loopmidi.html
2. Instalar
3. Abrir loopMIDI
4. Crear puerto: "loopMIDI Port"
5. Dejar ejecutándose

### 4. AmpliTube 5 MAX

1. Abrir en modo **Standalone** (no como plugin)
2. Ir a Settings → MIDI
3. Configurar:
   - MIDI Input Device: **loopMIDI Port**
   - Enable MIDI Input: ✅
   - MIDI Channel: **1**

---

## 🚀 INSTALACIÓN PASO A PASO

### Paso 1: Verificar Node.js

```bash
node --version
```

**Debe mostrar:** `v18.x.x` o superior (v20.x.x, v22.x.x)

Si no, actualizar Node.js primero (ver arriba).

### Paso 2: Verificar npm

```bash
npm --version
```

**Debe mostrar:** `8.x.x` o superior

### Paso 3: Instalar dependencias del servidor

```bash
npm install
```

**Si falla con error de `midi`:**
- Instalar Visual Studio Build Tools (ver arriba)
- Reiniciar terminal
- Intentar de nuevo

### Paso 4: Instalar dependencias del cliente

```bash
cd client
npm install
cd ..
```

### Paso 5: Compilar el frontend

```bash
cd client
npm run build
cd ..
```

### Paso 6: Crear archivo .env

```bash
copy .env.example .env
```

---

## ✅ VERIFICACIÓN DE INSTALACIÓN

Después de instalar, verifica que todo esté correcto:

### 1. Verificar node_modules del servidor

```bash
dir node_modules
```

Debe existir la carpeta `node_modules` con muchas subcarpetas.

### 2. Verificar node_modules del cliente

```bash
dir client\node_modules
```

Debe existir la carpeta `client\node_modules`.

### 3. Verificar build del cliente

```bash
dir client\dist
```

Debe existir la carpeta `client\dist` con archivos HTML, JS y CSS.

### 4. Verificar archivo .env

```bash
type .env
```

Debe mostrar el contenido del archivo de configuración.

---

## 🎯 INICIAR EL PROYECTO

Una vez instalado correctamente:

### Opción 1: Script automático

```bash
.\start.bat
```

### Opción 2: Comando npm

```bash
npm start
```

### Opción 3: Node directo

```bash
node server/index.js
```

---

## 🔍 VERIFICAR QUE FUNCIONA

Después de iniciar, debes ver algo como:

```
🎸 LIVE CONTROL - AmpliTube MIDI Controller
==========================================

✅ Datos cargados: 5 canciones, 1 setlists

🎹 MIDI Ports disponibles: 2
   [0] Microsoft GS Wavetable Synth
   [1] loopMIDI Port

✅ MIDI conectado: loopMIDI Port (Canal 1)

🚀 Servidor iniciado en http://localhost:3000
```

**Indicadores de éxito:**
- ✅ "Datos cargados"
- ✅ "MIDI conectado: loopMIDI Port"
- ✅ "Servidor iniciado en http://localhost:3000"

**Indicadores de problema:**
- ⚠️ "Puerto MIDI no encontrado" → Verificar loopMIDI
- ❌ Error al iniciar → Ver logs de error

---

## 🌐 ABRIR LA APLICACIÓN

### En la misma PC:

```
http://localhost:3000
```

### Desde celular/tablet:

1. Obtener IP de la PC:
   ```bash
   ipconfig
   ```
   Buscar "IPv4 Address" (ej: 192.168.1.100)

2. En el celular, abrir navegador:
   ```
   http://192.168.1.100:3000
   ```

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "node-gyp rebuild failed"

**Causa:** Falta Visual Studio Build Tools

**Solución:**
1. Instalar Build Tools (ver arriba)
2. Reiniciar terminal
3. Ejecutar: `npm install` de nuevo

### Error: "Unsupported engine"

**Causa:** Node.js versión antigua

**Solución:**
1. Actualizar Node.js a v18+ (ver arriba)
2. Reiniciar terminal
3. Ejecutar: `npm install` de nuevo

### Error: "Cannot find module 'express'"

**Causa:** Dependencias no instaladas

**Solución:**
```bash
npm install
```

### Error: "EADDRINUSE: address already in use"

**Causa:** Puerto 3000 ya está en uso

**Solución:**
```bash
# Opción 1: Cerrar la aplicación que usa el puerto 3000
# Opción 2: Cambiar puerto en .env
PORT=3001
```

### Error: "⚠️ Puerto MIDI no encontrado"

**Causa:** loopMIDI no está ejecutándose

**Solución:**
1. Abrir loopMIDI
2. Verificar que existe "loopMIDI Port"
3. Reiniciar Live Control

---

## 📝 CHECKLIST COMPLETO

Antes de usar Live Control, verifica:

- [ ] Node.js 18+ instalado
- [ ] Visual Studio Build Tools instalado
- [ ] loopMIDI instalado y ejecutándose
- [ ] Puerto "loopMIDI Port" creado en loopMIDI
- [ ] AmpliTube 5 MAX abierto (Standalone)
- [ ] AmpliTube configurado para recibir MIDI de loopMIDI Port
- [ ] Dependencias del servidor instaladas (`npm install`)
- [ ] Dependencias del cliente instaladas (`cd client && npm install`)
- [ ] Frontend compilado (`cd client && npm run build`)
- [ ] Archivo `.env` creado
- [ ] Servidor iniciado (`npm start`)
- [ ] Navegador abierto en `http://localhost:3000`
- [ ] Indicador MIDI verde (🟢)

---

## 🎉 ¡LISTO!

Si completaste todos los pasos, Live Control debería estar funcionando correctamente.

**Siguiente paso:** Leer `FIRST_RUN.md` para tu primera prueba completa.


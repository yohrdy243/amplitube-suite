# ⚡ Quick Start - Live Control

Guía rápida para empezar en 10 minutos.

## 📦 Instalación (5 minutos)

### 1. Instalar Requisitos

**Node.js:**
- Descargar: https://nodejs.org/
- Instalar versión LTS
- Verificar: `node --version` (debe ser v18+)

**loopMIDI:**
- Descargar: https://www.tobias-erichsen.de/software/loopmidi.html
- Instalar
- Abrir loopMIDI
- Crear puerto: "loopMIDI Port"
- Dejar ejecutándose

### 2. Instalar Live Control

```bash
# Opción A: Usar script automático (Windows)
install.bat

# Opción B: Manual
npm install
cd client
npm install
npm run build
cd ..
```

### 3. Configurar

```bash
# Copiar archivo de configuración
copy .env.example .env

# (Opcional) Editar .env si necesitas cambiar algo
notepad .env
```

## 🎹 Configurar AmpliTube (3 minutos)

### 1. Configurar MIDI Input

```
AmpliTube 5 MAX → Settings → MIDI
├─ MIDI Input Device: loopMIDI Port
├─ Enable MIDI Input: ✓
└─ MIDI Channel: 1
```

### 2. Organizar Presets

```
Preset 1 → Program Change 0
Preset 2 → Program Change 1
Preset 3 → Program Change 2
...
```

### 3. Configurar Escenas (MIDI Learn)

Para cada preset:
1. Click derecho en pedal/efecto
2. "MIDI Learn"
3. Presionar botón de escena en Live Control
4. Repetir para cada escena

## 🎵 Configurar Canciones (2 minutos)

Editar `server/data/songs.json`:

```json
[
  {
    "id": "song-001",
    "name": "Mi Primera Canción",
    "programChange": 0,
    "scenes": [
      { "name": "Intro", "cc": 20 },
      { "name": "Verso", "cc": 21 },
      { "name": "Coro", "cc": 22 },
      { "name": "Final", "cc": 23 }
    ]
  }
]
```

Editar `server/data/setlists.json`:

```json
[
  {
    "id": "setlist-001",
    "name": "Mi Primer Setlist",
    "songs": ["song-001"]
  }
]
```

## 🚀 Iniciar (30 segundos)

### Opción A: Script automático (Windows)

```bash
start.bat
```

### Opción B: Manual

```bash
npm start
```

Deberías ver:

```
🎸 LIVE CONTROL - AmpliTube MIDI Controller
==========================================

✅ Datos cargados: 5 canciones, 1 setlists
✅ MIDI conectado: loopMIDI Port (Canal 1)
🚀 Servidor iniciado en http://localhost:3000
```

## 📱 Usar desde Celular

### 1. Obtener IP de la PC

```bash
ipconfig
```

Buscar "IPv4 Address" → Ejemplo: `192.168.1.100`

### 2. Conectar

En el celular/tablet:
1. Conectar a la misma WiFi que la PC
2. Abrir navegador
3. Ir a: `http://192.168.1.100:3000`

## 🎸 Usar en Vivo

### Flujo Normal

```
1. Abrir loopMIDI
2. Abrir AmpliTube 5 MAX
3. Ejecutar: npm start
4. Abrir app en celular
5. Seleccionar setlist
6. ¡Tocar! 🎸
```

### Interfaz

```
┌─────────────────────────────────┐
│  🎸 LIVE CONTROL                │
│  Setlist: Domingo - Alabanza    │
│  🟢 MIDI                         │
├─────────────────────────────────┤
│                                  │
│  Cordero y León                  │
│                                  │
├──────────────┬──────────────────┤
│   1. Intro   │   2. Verso       │
│   CC 20      │   CC 21          │
├──────────────┼──────────────────┤
│   3. Coro    │   4. Puente      │
│   CC 22      │   CC 23          │
├──────────────┴──────────────────┤
│  ← Anterior  │  Siguiente →     │
└──────────────┴──────────────────┘
```

## ✅ Verificación Rápida

### Test 1: MIDI Conectado
- ✅ Indicador verde: 🟢 MIDI
- ❌ Indicador rojo: 🔴 MIDI → Ver TROUBLESHOOTING.md

### Test 2: Cambio de Preset
- Presionar "Siguiente →"
- AmpliTube debe cambiar de preset

### Test 3: Cambio de Escena
- Presionar botón de escena
- Efectos deben activarse/desactivarse

## 🆘 Problemas Comunes

### MIDI no conecta (🔴)
```
1. Verificar que loopMIDI está ejecutándose
2. Verificar configuración en AmpliTube
3. Reiniciar: Live Control → AmpliTube → loopMIDI
```

### Presets no cambian
```
1. Verificar números en songs.json (empiezan en 0)
2. Verificar MIDI Input en AmpliTube
```

### No accede desde celular
```
1. Misma red WiFi
2. Usar IP correcta (no localhost)
3. Desactivar firewall temporalmente
```

## 📚 Documentación Completa

- **README.md** - Documentación completa
- **AMPLITUBE_SETUP.md** - Configuración detallada de AmpliTube
- **TESTING.md** - Guía de testing pre-show
- **TROUBLESHOOTING.md** - Solución de problemas
- **SUPABASE_SETUP.md** - Configuración de nube (opcional)

## 🎯 Próximos Pasos

1. ✅ Configurar todas tus canciones en songs.json
2. ✅ Crear setlists para tus shows
3. ✅ Configurar MIDI Learn para todas las escenas
4. ✅ Probar TODO antes del show (ver TESTING.md)
5. ✅ Hacer backup de archivos JSON

## 💡 Tips

- **Usa nombres descriptivos** para escenas
- **Prueba TODO** antes del show
- **Haz backups** regularmente
- **Usa el mismo rango de CC** (20-23) para todas las canciones
- **Conecta laptop a corriente** durante el show

## 🔥 Checklist Pre-Show

```
[ ] loopMIDI ejecutándose
[ ] AmpliTube abierto y configurado
[ ] Live Control ejecutándose
[ ] Indicador MIDI verde (🟢)
[ ] Celular conectado
[ ] Primera canción probada
[ ] Laptop conectada a corriente
```

---

**¡Listo para rockear! 🎸🔥**

¿Problemas? → Ver **TROUBLESHOOTING.md**


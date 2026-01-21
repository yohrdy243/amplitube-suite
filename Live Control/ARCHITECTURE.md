# 🏗️ Arquitectura - Live Control

Documentación técnica de la arquitectura del sistema.

## 📊 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         DISPOSITIVOS REMOTOS                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  iPhone  │  │   iPad   │  │  Tablet  │  │ Navegador│       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │              │             │              │
│       └─────────────┴──────────────┴─────────────┘              │
│                          │                                       │
│                     WiFi / HTTP                                  │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PC (Windows 10/11)                          │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    LIVE CONTROL APP                         │ │
│  │                                                              │ │
│  │  ┌──────────────────┐         ┌──────────────────┐         │ │
│  │  │  React Frontend  │         │  Node.js Backend │         │ │
│  │  │  (Vite)          │◄───────►│  (Express)       │         │ │
│  │  │                  │   HTTP  │                  │         │ │
│  │  │  - LiveMode      │         │  - API REST      │         │ │
│  │  │  - SetlistSelect │         │  - MIDI Control  │         │ │
│  │  │  - EditMode      │         │  - Data Manager  │         │ │
│  │  └──────────────────┘         └────────┬─────────┘         │ │
│  │                                        │                    │ │
│  │                                        │                    │ │
│  │                               ┌────────▼─────────┐          │ │
│  │                               │  Data Layer      │          │ │
│  │                               │                  │          │ │
│  │                               │  - songs.json    │          │ │
│  │                               │  - setlists.json │          │ │
│  │                               └──────────────────┘          │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           │ MIDI Messages                         │
│                           ▼                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      loopMIDI                               │ │
│  │              (Virtual MIDI Port)                            │ │
│  └────────────────────────┬───────────────────────────────────┘ │
│                           │                                       │
│                           │ MIDI                                  │
│                           ▼                                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                  AmpliTube 5 MAX                            │ │
│  │                   (Standalone)                              │ │
│  │                                                              │ │
│  │  - Presets (Program Change)                                 │ │
│  │  - Scenes (Control Change)                                  │ │
│  │  - Audio Processing                                         │ │
│  └────────────────────────┬───────────────────────────────────┘ │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            │ Audio
                            ▼
                    ┌───────────────┐
                    │ Audio Interface│
                    │   / Speakers   │
                    └───────────────┘
```

## 🔄 Flujo de Datos

### 1. Cambio de Canción (Program Change)

```
Usuario presiona "Siguiente" en iPhone
         │
         ▼
React Frontend detecta click
         │
         ▼
POST /api/midi/program-change
{ programChange: 2 }
         │
         ▼
Express API recibe request
         │
         ▼
midiController.sendProgramChange(2)
         │
         ▼
node-midi envía mensaje MIDI:
[0xC0, 0x02] (Program Change 2, Canal 1)
         │
         ▼
loopMIDI recibe y reenvía
         │
         ▼
AmpliTube recibe y cambia a Preset 3
         │
         ▼
Audio cambia instantáneamente
```

### 2. Cambio de Escena (Control Change)

```
Usuario presiona botón "Coro" en iPad
         │
         ▼
React Frontend detecta click
         │
         ▼
POST /api/midi/control-change
{ cc: 22, value: 127 }
         │
         ▼
Express API recibe request
         │
         ▼
midiController.sendControlChange(22, 127)
         │
         ▼
node-midi envía mensaje MIDI:
[0xB0, 0x16, 0x7F] (CC 22 = 127, Canal 1)
         │
         ▼
loopMIDI recibe y reenvía
         │
         ▼
AmpliTube ejecuta MIDI Learn mapping
(ej: activa Distortion, activa Reverb)
         │
         ▼
Audio cambia instantáneamente
```

## 🗂️ Estructura de Archivos

```
Live Control/
│
├── server/                      # Backend (Node.js)
│   ├── index.js                 # Servidor Express principal
│   ├── midi.js                  # Controlador MIDI (node-midi)
│   ├── dataManager.js           # Gestión de datos JSON
│   ├── supabase.js              # Cliente Supabase (opcional)
│   └── data/                    # Fuente de verdad
│       ├── songs.json           # Canciones
│       └── setlists.json        # Setlists
│
├── client/                      # Frontend (React + Vite)
│   ├── index.html               # HTML base
│   ├── vite.config.js           # Configuración Vite
│   ├── package.json             # Dependencias frontend
│   └── src/
│       ├── main.jsx             # Entry point
│       ├── App.jsx              # Componente raíz
│       ├── index.css            # Estilos globales
│       └── components/
│           ├── LiveMode.jsx     # Modo en vivo (CRÍTICO)
│           ├── LiveMode.css
│           ├── SetlistSelector.jsx
│           ├── SetlistSelector.css
│           ├── EditMode.jsx
│           └── EditMode.css
│
├── package.json                 # Dependencias backend
├── .env                         # Configuración (no versionado)
├── .env.example                 # Plantilla de configuración
├── .gitignore
│
├── README.md                    # Documentación principal
├── QUICKSTART.md                # Guía rápida
├── AMPLITUBE_SETUP.md           # Setup de AmpliTube
├── TESTING.md                   # Guía de testing
├── TROUBLESHOOTING.md           # Solución de problemas
├── SUPABASE_SETUP.md            # Setup de Supabase (opcional)
├── ARCHITECTURE.md              # Este archivo
│
├── install.bat                  # Script de instalación (Windows)
└── start.bat                    # Script de inicio (Windows)
```

## 🔌 API REST

### MIDI Endpoints

#### `GET /api/midi/status`
Obtener estado de conexión MIDI

**Response:**
```json
{
  "connected": true,
  "portName": "loopMIDI Port",
  "channel": 1,
  "portIndex": 1
}
```

#### `POST /api/midi/program-change`
Enviar Program Change

**Request:**
```json
{
  "programChange": 2
}
```

**Response:**
```json
{
  "success": true,
  "programChange": 2
}
```

#### `POST /api/midi/control-change`
Enviar Control Change

**Request:**
```json
{
  "cc": 22,
  "value": 127
}
```

**Response:**
```json
{
  "success": true,
  "cc": 22,
  "value": 127
}
```

### Songs Endpoints

#### `GET /api/songs`
Obtener todas las canciones

**Response:**
```json
[
  {
    "id": "song-001",
    "name": "Cordero y León",
    "programChange": 1,
    "scenes": [
      { "name": "Intro", "cc": 20 },
      { "name": "Verso", "cc": 21 },
      { "name": "Coro", "cc": 22 },
      { "name": "Puente", "cc": 23 }
    ]
  }
]
```

#### `GET /api/songs/:id`
Obtener canción por ID

#### `POST /api/songs`
Crear nueva canción

#### `PUT /api/songs/:id`
Actualizar canción

#### `DELETE /api/songs/:id`
Eliminar canción

### Setlists Endpoints

#### `GET /api/setlists`
Obtener todos los setlists

#### `GET /api/setlists/:id`
Obtener setlist con canciones completas

**Response:**
```json
{
  "id": "setlist-001",
  "name": "Domingo - Alabanza",
  "songs": [
    {
      "id": "song-001",
      "name": "Cordero y León",
      "programChange": 1,
      "scenes": [...]
    }
  ]
}
```

#### `POST /api/setlists`
Crear nuevo setlist

## 🎹 Protocolo MIDI

### Program Change

**Formato:** `[Status, Program]`

- **Status:** `0xC0 + channel` (0xC0 para canal 1)
- **Program:** `0-127` (número de preset)

**Ejemplo:**
```
Cambiar a Preset 3 (Program Change 2):
[0xC0, 0x02]
```

### Control Change

**Formato:** `[Status, CC, Value]`

- **Status:** `0xB0 + channel` (0xB0 para canal 1)
- **CC:** `0-127` (número de control)
- **Value:** `0-127` (valor, siempre 127 en esta app)

**Ejemplo:**
```
Activar escena con CC 22:
[0xB0, 0x16, 0x7F]
```

## 🔐 Principios de Diseño

### 1. Offline First
- Los datos locales (JSON) son la fuente de verdad
- Supabase es opcional y solo para sincronización
- LIVE MODE NUNCA depende de internet

### 2. Zero Latency
- MIDI se envía directamente desde el backend
- Sin intermediarios
- Sin procesamiento innecesario

### 3. Fail-Safe
- Si MIDI falla, la app continúa funcionando
- Si Supabase falla, usa datos locales
- Nunca bloquear LIVE MODE

### 4. Separation of Concerns
- **AmpliTube:** Audio processing
- **Live Control:** MIDI control
- **Supabase:** Sincronización (opcional)

### 5. Immutable During Show
- LIVE MODE es read-only
- No se puede editar durante el show
- Previene errores accidentales

## 🚀 Tecnologías

### Backend
- **Node.js** - Runtime
- **Express** - Web server
- **node-midi** - MIDI I/O
- **dotenv** - Variables de entorno
- **@supabase/supabase-js** - Cliente Supabase (opcional)

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **CSS3** - Estilos (sin frameworks)

### MIDI
- **loopMIDI** - Virtual MIDI port (Windows)
- **MIDI 1.0 Protocol** - Program Change, Control Change

### Cloud (Opcional)
- **Supabase** - Auth + Database

## 📈 Rendimiento

### Latencia
- **MIDI:** < 10ms
- **HTTP (local):** < 50ms
- **HTTP (WiFi):** < 100ms
- **Total (click → audio):** < 150ms

### Recursos
- **CPU:** < 5% (idle), < 10% (uso activo)
- **RAM:** ~100MB (backend + frontend)
- **Disco:** ~50MB (instalación completa)

## 🔮 Extensibilidad

### Agregar más escenas
Actualmente: 4 escenas fijas

Para soportar más:
1. Modificar modelo de datos (songs.json)
2. Actualizar validación en dataManager.js
3. Modificar grid en LiveMode.jsx (2x2 → 2x3, etc.)

### Agregar más dispositivos MIDI
Actualmente: 1 puerto MIDI

Para soportar más:
1. Modificar midi.js para manejar múltiples outputs
2. Agregar configuración en .env
3. Actualizar UI para seleccionar dispositivo

### Agregar autenticación
1. Implementar Supabase Auth
2. Proteger endpoints de edición
3. Mantener LIVE MODE sin auth

---

**Arquitectura diseñada para máxima confiabilidad en vivo** 🎸🔥


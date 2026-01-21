# 🎸 LIVE CONTROL - AmpliTube MIDI Controller

Sistema profesional de control MIDI para AmpliTube 5 MAX diseñado específicamente para uso en vivo.

## 🎯 Características

- ✅ Control MIDI completo de AmpliTube 5 MAX
- ✅ Cambio de presets (Program Change)
- ✅ Cambio de escenas (Control Change)
- ✅ Interfaz optimizada para uso en vivo
- ✅ Control desde iPhone/iPad/tablet vía navegador
- ✅ Funciona 100% offline durante el show
- ✅ Grid 2x2 de escenas con botones grandes
- ✅ Navegación entre canciones
- ✅ Sincronización opcional con Supabase

## 📋 Requisitos Previos

### Windows
- Windows 10/11
- Node.js 18+ ([descargar aquí](https://nodejs.org/))
- AmpliTube 5 MAX (Standalone)
- loopMIDI ([descargar aquí](https://www.tobias-erichsen.de/software/loopmidi.html))

### Configuración de loopMIDI

1. Descarga e instala loopMIDI
2. Abre loopMIDI
3. Crea un puerto virtual llamado "loopMIDI Port"
4. Deja loopMIDI ejecutándose en segundo plano

### Configuración de AmpliTube 5 MAX

1. Abre AmpliTube 5 MAX (Standalone)
2. Ve a Settings → MIDI
3. Configura:
   - **MIDI Input**: loopMIDI Port
   - **MIDI Channel**: 1 (o el que prefieras)
4. Configura tus presets y escenas:
   - Asigna cada canción a un número de Program Change (0-127)
   - Asigna cada escena a un Control Change (recomendado: CC 20-23)
   - Usa MIDI Learn en AmpliTube para mapear los CC

## 🚀 Instalación

```bash
# 1. Clonar o descargar el proyecto
cd "Live Control"

# 2. Instalar dependencias del servidor
npm install

# 3. Instalar dependencias del cliente
cd client
npm install
cd ..

# 4. Copiar archivo de configuración
copy .env.example .env

# 5. (Opcional) Editar .env con tu configuración MIDI
notepad .env
```

## ⚙️ Configuración

Edita el archivo `.env`:

```env
# Puerto del servidor
PORT=3000

# Canal MIDI (1-16)
MIDI_CHANNEL=1

# Nombre del puerto MIDI (debe coincidir con loopMIDI)
MIDI_PORT_NAME=loopMIDI Port

# Supabase (opcional - solo para sincronización)
SUPABASE_URL=tu_url_aqui
SUPABASE_ANON_KEY=tu_key_aqui
```

## 🎵 Configurar Canciones y Setlists

Edita los archivos JSON en `server/data/`:

### `songs.json`

```json
[
  {
    "id": "song-001",
    "name": "Nombre de la canción",
    "programChange": 0,
    "scenes": [
      { "name": "Intro", "cc": 20 },
      { "name": "Verso", "cc": 21 },
      { "name": "Coro", "cc": 22 },
      { "name": "Final", "cc": 23 }
    ],
    "metadata": {
      "artist": "Nombre del Artista",
      "key": "G",
      "bpm": 120,
      "duration": "4:30",
      "youtubeUrl": "https://www.youtube.com/watch?v=...",
      "albumArt": "https://example.com/album-art.jpg",
      "notes": "Notas adicionales"
    }
  }
]
```

**IMPORTANTE**:
- Cada canción debe tener EXACTAMENTE 4 escenas
- El `programChange` debe coincidir con el preset en AmpliTube
- Los `cc` deben estar mapeados en AmpliTube usando MIDI Learn
- El objeto `metadata` es **completamente opcional** (ver SONG_METADATA.md)

### `setlists.json`

```json
[
  {
    "id": "setlist-001",
    "name": "Nombre del Setlist",
    "songs": ["song-001", "song-002", "song-003"]
  }
]
```

## 🎮 Uso

### Iniciar el servidor

```bash
npm start
```

Verás algo como:

```
🎸 LIVE CONTROL - AmpliTube MIDI Controller
==========================================

✅ Datos cargados: 5 canciones, 1 setlists

🎹 MIDI Ports disponibles: 2
   [0] Microsoft GS Wavetable Synth
   [1] loopMIDI Port

✅ MIDI conectado: loopMIDI Port (Canal 1)

🚀 Servidor iniciado en http://localhost:3000

📱 Accede desde tu celular/tablet usando la IP de esta PC
   Ejemplo: http://192.168.1.100:3000
```

### Acceder desde dispositivos móviles

1. Asegúrate de que tu PC y dispositivo móvil estén en la misma red WiFi
2. Encuentra la IP de tu PC:
   ```bash
   ipconfig
   ```
   Busca "IPv4 Address" (ejemplo: 192.168.1.100)

3. En tu iPhone/iPad/tablet, abre el navegador y ve a:
   ```
   http://TU_IP:3000
   ```

### Flujo de trabajo en vivo

1. ✅ Abre AmpliTube 5 MAX
2. ✅ Inicia loopMIDI
3. ✅ Ejecuta `npm start`
4. ✅ Abre la app en tu dispositivo móvil
5. ✅ Selecciona un setlist
6. ✅ ¡Toca! 🎸

## 🎹 Cómo funciona

### Program Change
- Se envía automáticamente al cambiar de canción
- Cambia el preset completo en AmpliTube

### Control Change
- Se envía al presionar un botón de escena
- Cambia la escena dentro del preset actual
- Valor fijo: 127

### Arquitectura

```
[iPhone/iPad] ←→ [PC - Node.js Server] ←→ [loopMIDI] ←→ [AmpliTube 5 MAX]
   (WiFi)              (HTTP API)           (MIDI)         (Audio)
```

## 🛠️ Desarrollo

```bash
# Modo desarrollo (hot reload)
npm run dev
```

Esto inicia:
- Backend en `http://localhost:3000`
- Frontend en `http://localhost:5173` (con proxy a backend)

## 📁 Estructura del Proyecto

```
Live Control/
├── server/
│   ├── index.js          # Servidor Express
│   ├── midi.js           # Controlador MIDI
│   ├── dataManager.js    # Gestión de datos JSON
│   └── data/
│       ├── songs.json    # Canciones
│       └── setlists.json # Setlists
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── LiveMode.jsx      # Modo en vivo
│   │   │   ├── SetlistSelector.jsx
│   │   │   └── EditMode.jsx
│   │   └── index.css
│   └── package.json
├── package.json
└── README.md
```

## 🔧 Solución de Problemas

### MIDI no conecta

1. Verifica que loopMIDI esté ejecutándose
2. Verifica que el puerto se llame exactamente "loopMIDI Port"
3. Reinicia la aplicación
4. Revisa el archivo `.env`

### AmpliTube no responde

1. Verifica que AmpliTube esté configurado para recibir MIDI de loopMIDI Port
2. Verifica que el canal MIDI coincida (default: 1)
3. Asegúrate de haber mapeado los CC usando MIDI Learn en AmpliTube

### No puedo acceder desde el celular

1. Verifica que estén en la misma red WiFi
2. Desactiva el firewall de Windows temporalmente para probar
3. Usa la IP correcta (no localhost)

## 📝 Notas Importantes

- ⚠️ **NUNCA** edites durante un show en vivo
- ⚠️ El modo LIVE funciona 100% offline
- ⚠️ Haz backups de tus archivos JSON
- ⚠️ Prueba TODO antes del show

## 🎯 Próximas Características

- [ ] Modo de edición visual (UI)
- [ ] Integración completa con Supabase
- [ ] Autenticación
- [ ] Backup automático
- [ ] Soporte para más de 4 escenas
- [ ] Temas personalizables

## 📄 Licencia

MIT

---

**Desarrollado para músicos que necesitan confiabilidad absoluta en vivo** 🎸🔥


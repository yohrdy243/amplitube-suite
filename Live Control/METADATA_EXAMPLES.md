# 🎨 Ejemplos de Metadata - Live Control

Ejemplos prácticos de cómo usar la metadata opcional en tus canciones.

---

## 📝 Ejemplo 1: Canción de Adoración Moderna

```json
{
  "id": "song-worship-001",
  "name": "Reckless Love",
  "programChange": 0,
  "scenes": [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso", "cc": 21 },
    { "name": "Coro", "cc": 22 },
    { "name": "Puente", "cc": 23 }
  ],
  "metadata": {
    "artist": "Cory Asbury",
    "key": "C",
    "bpm": 67,
    "duration": "5:42",
    "youtubeUrl": "https://www.youtube.com/watch?v=Sc6SSHuZvQE",
    "albumArt": "https://example.com/reckless-love.jpg",
    "notes": "Balada lenta, usar reverb largo. Puente muy dinámico."
  }
}
```

**Visualización en LIVE MODE:**
```
┌─────────────────────────────────────┐
│  Reckless Love                       │
│  🎤 Cory Asbury  🎵 C  ⏱️ 67 BPM    │
│  ⏳ 5:42                             │
└─────────────────────────────────────┘
```

---

## 📝 Ejemplo 2: Himno Tradicional

```json
{
  "id": "song-hymn-001",
  "name": "Amazing Grace",
  "programChange": 1,
  "scenes": [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso 1", "cc": 21 },
    { "name": "Verso 2", "cc": 22 },
    { "name": "Final", "cc": 23 }
  ],
  "metadata": {
    "artist": "John Newton",
    "key": "G",
    "bpm": 80,
    "duration": "3:30",
    "youtubeUrl": "",
    "albumArt": "",
    "notes": "Himno clásico, tempo moderado"
  }
}
```

**Visualización en LIVE MODE:**
```
┌─────────────────────────────────────┐
│  Amazing Grace                       │
│  🎤 John Newton  🎵 G  ⏱️ 80 BPM    │
│  ⏳ 3:30                             │
└─────────────────────────────────────┘
```

---

## 📝 Ejemplo 3: Canción Energética

```json
{
  "id": "song-upbeat-001",
  "name": "Alive",
  "programChange": 2,
  "scenes": [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso", "cc": 21 },
    { "name": "Coro", "cc": 22 },
    { "name": "Solo", "cc": 23 }
  ],
  "metadata": {
    "artist": "Hillsong Young & Free",
    "key": "E",
    "bpm": 145,
    "duration": "4:15",
    "youtubeUrl": "https://www.youtube.com/watch?v=example",
    "albumArt": "https://example.com/alive.jpg",
    "notes": "Muy energético, usar distorsión alta. Solo de guitarra en escena 4."
  }
}
```

**Visualización en LIVE MODE:**
```
┌─────────────────────────────────────┐
│  Alive                               │
│  🎤 Hillsong Y&F  🎵 E  ⏱️ 145 BPM  │
│  ⏳ 4:15                             │
└─────────────────────────────────────┘
```

---

## 📝 Ejemplo 4: Canción Solo con Tonalidad

```json
{
  "id": "song-simple-001",
  "name": "Way Maker",
  "programChange": 3,
  "scenes": [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso", "cc": 21 },
    { "name": "Coro", "cc": 22 },
    { "name": "Puente", "cc": 23 }
  ],
  "metadata": {
    "artist": "Sinach",
    "key": "A",
    "bpm": null,
    "duration": "",
    "youtubeUrl": "",
    "albumArt": "",
    "notes": ""
  }
}
```

**Visualización en LIVE MODE:**
```
┌─────────────────────────────────────┐
│  Way Maker                           │
│  🎤 Sinach  🎵 A                     │
└─────────────────────────────────────┘
```

---

## 📝 Ejemplo 5: Canción Sin Metadata

```json
{
  "id": "song-minimal-001",
  "name": "Mi Canción Original",
  "programChange": 4,
  "scenes": [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso", "cc": 21 },
    { "name": "Coro", "cc": 22 },
    { "name": "Final", "cc": 23 }
  ]
}
```

**Visualización en LIVE MODE:**
```
┌─────────────────────────────────────┐
│  Mi Canción Original                 │
└─────────────────────────────────────┘
```

---

## 📝 Ejemplo 6: Canción con Tonalidad Compleja

```json
{
  "id": "song-complex-001",
  "name": "Oceans",
  "programChange": 5,
  "scenes": [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso", "cc": 21 },
    { "name": "Coro", "cc": 22 },
    { "name": "Puente", "cc": 23 }
  ],
  "metadata": {
    "artist": "Hillsong United",
    "key": "D",
    "bpm": 72,
    "duration": "8:56",
    "youtubeUrl": "https://www.youtube.com/watch?v=dy9nwe9_xzw",
    "albumArt": "https://example.com/oceans.jpg",
    "notes": "Canción larga, cambio de tonalidad en el puente de D a E. Usar delay largo en todo momento."
  }
}
```

**Visualización en LIVE MODE:**
```
┌─────────────────────────────────────┐
│  Oceans                              │
│  🎤 Hillsong United  🎵 D  ⏱️ 72 BPM│
│  ⏳ 8:56                             │
└─────────────────────────────────────┘
```

---

## 📝 Ejemplo 7: Canción en Español

```json
{
  "id": "song-spanish-001",
  "name": "Eres Santo",
  "programChange": 6,
  "scenes": [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso", "cc": 21 },
    { "name": "Coro", "cc": 22 },
    { "name": "Final", "cc": 23 }
  ],
  "metadata": {
    "artist": "Marcos Witt",
    "key": "Am",
    "bpm": 85,
    "duration": "4:45",
    "youtubeUrl": "",
    "albumArt": "",
    "notes": "Tonalidad menor, ambiente contemplativo"
  }
}
```

**Visualización en LIVE MODE:**
```
┌─────────────────────────────────────┐
│  Eres Santo                          │
│  🎤 Marcos Witt  🎵 Am  ⏱️ 85 BPM   │
│  ⏳ 4:45                             │
└─────────────────────────────────────┘
```

---

## 🎯 Casos de Uso Prácticos

### Caso 1: Setlist por Tonalidad
Organiza tus canciones por tonalidad para transiciones suaves:

```json
[
  { "name": "Canción 1", "key": "G" },
  { "name": "Canción 2", "key": "G" },
  { "name": "Canción 3", "key": "D" },  // Quinta arriba
  { "name": "Canción 4", "key": "D" }
]
```

### Caso 2: Control de Tempo
Planifica la energía del setlist usando BPM:

```json
[
  { "name": "Apertura", "bpm": 140 },    // Energético
  { "name": "Adoración 1", "bpm": 72 },  // Lento
  { "name": "Adoración 2", "bpm": 68 },  // Muy lento
  { "name": "Cierre", "bpm": 120 }       // Medio-rápido
]
```

### Caso 3: Duración Total
Calcula la duración total del setlist:

```json
[
  { "name": "Canción 1", "duration": "4:30" },  // 4.5 min
  { "name": "Canción 2", "duration": "5:15" },  // 5.25 min
  { "name": "Canción 3", "duration": "3:45" },  // 3.75 min
  { "name": "Canción 4", "duration": "6:00" }   // 6 min
]
// Total: ~19.5 minutos
```

### Caso 4: Notas de Producción
Usa `notes` para recordatorios técnicos:

```json
{
  "notes": "Cambio de tonalidad en el puente de D a E. Activar delay largo en escena 3. Solo de guitarra en escena 4 (2 minutos)."
}
```

---

## 💡 Tips para Usar Metadata

### 1. Consistencia en Artistas
```json
// ✅ Bueno
"artist": "Hillsong Worship"
"artist": "Hillsong United"
"artist": "Hillsong Young & Free"

// ❌ Evitar
"artist": "Hillsong"
"artist": "hillsong worship"
"artist": "HILLSONG WORSHIP"
```

### 2. Formato de Tonalidad
```json
// ✅ Bueno
"key": "C"
"key": "Am"
"key": "F#"
"key": "Bb"

// ❌ Evitar
"key": "c"
"key": "A minor"
"key": "F sharp"
```

### 3. Duración Consistente
```json
// ✅ Bueno
"duration": "3:45"
"duration": "4:20"
"duration": "10:15"

// ❌ Evitar
"duration": "3 min 45 sec"
"duration": "4:2"
"duration": "225 seconds"
```

### 4. URLs Completas
```json
// ✅ Bueno
"youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

// ❌ Evitar
"youtubeUrl": "youtube.com/watch?v=dQw4w9WgXcQ"
"youtubeUrl": "dQw4w9WgXcQ"
```

---

## 📊 Plantilla Completa

Copia y pega esta plantilla para crear nuevas canciones:

```json
{
  "id": "song-XXX",
  "name": "",
  "programChange": 0,
  "scenes": [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso", "cc": 21 },
    { "name": "Coro", "cc": 22 },
    { "name": "Final", "cc": 23 }
  ],
  "metadata": {
    "artist": "",
    "key": "",
    "bpm": null,
    "duration": "",
    "youtubeUrl": "",
    "albumArt": "",
    "notes": ""
  }
}
```

---

**Usa metadata para organizar mejor tus canciones** 🎵

Todos los campos son opcionales - usa solo lo que necesites.


# 🎵 Metadata de Canciones - Live Control

Guía completa sobre los campos de metadata opcionales para canciones.

## 📋 Estructura Completa de una Canción

```json
{
  "id": "song-001",
  "name": "Nombre de la Canción",
  "programChange": 1,
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
    "notes": "Notas adicionales sobre la canción"
  }
}
```

---

## ✅ Campos Requeridos (Obligatorios)

### `id` (string)
- **Descripción:** Identificador único de la canción
- **Formato:** Cualquier string único (recomendado: "song-001", "song-002", etc.)
- **Ejemplo:** `"song-001"`

### `name` (string)
- **Descripción:** Nombre de la canción
- **Formato:** Texto libre
- **Ejemplo:** `"Cordero y León"`

### `programChange` (number)
- **Descripción:** Número de preset en AmpliTube (1-128)
- **Formato:** Entero entre 1 y 128
- **Ejemplo:** `1` (primer preset), `2` (segundo preset), etc.
- **Nota:** El sistema automáticamente resta 1 antes de enviar por MIDI (preset 1 → MIDI 0)

### `scenes` (array)
- **Descripción:** Array de EXACTAMENTE 4 escenas
- **Formato:** Array de objetos con `name` y `cc`
- **Ejemplo:**
  ```json
  [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso", "cc": 21 },
    { "name": "Coro", "cc": 22 },
    { "name": "Final", "cc": 23 }
  ]
  ```

---

## 🎨 Campos Opcionales (Metadata)

Todos los campos dentro de `metadata` son **completamente opcionales**. Si no los necesitas, puedes dejarlos vacíos o omitir el objeto `metadata` completamente.

### `artist` (string, opcional)
- **Descripción:** Nombre del artista o banda
- **Formato:** Texto libre
- **Ejemplo:** `"Hillsong Worship"`, `"Marcos Witt"`, `"Bethel Music"`
- **Uso:** Se muestra en LIVE MODE debajo del nombre de la canción
- **Icono:** 🎤

### `key` (string, opcional)
- **Descripción:** Tonalidad de la canción
- **Formato:** Notación musical estándar
- **Ejemplos:**
  - Mayores: `"C"`, `"D"`, `"E"`, `"F"`, `"G"`, `"A"`, `"B"`
  - Menores: `"Am"`, `"Dm"`, `"Em"`, `"Fm"`, `"Gm"`, `"Bm"`
  - Con sostenidos: `"C#"`, `"F#"`, `"G#"`
  - Con bemoles: `"Bb"`, `"Eb"`, `"Ab"`
- **Uso:** Útil para músicos que necesitan saber la tonalidad
- **Icono:** 🎵

### `bpm` (number, opcional)
- **Descripción:** Tempo en beats por minuto
- **Formato:** Número entero
- **Ejemplos:** `60` (lento), `120` (medio), `140` (rápido)
- **Uso:** Referencia para el tempo de la canción
- **Icono:** ⏱️

### `duration` (string, opcional)
- **Descripción:** Duración de la canción
- **Formato:** "MM:SS" o "M:SS"
- **Ejemplos:** `"3:45"`, `"4:20"`, `"5:10"`
- **Uso:** Referencia para planificar el setlist
- **Icono:** ⏳

### `youtubeUrl` (string, opcional)
- **Descripción:** URL del video de YouTube
- **Formato:** URL completa de YouTube
- **Ejemplo:** `"https://www.youtube.com/watch?v=dQw4w9WgXcQ"`
- **Uso:** Referencia rápida para escuchar la canción original
- **Nota:** Actualmente solo se guarda, no se muestra en la UI

### `albumArt` (string, opcional)
- **Descripción:** URL de la imagen del álbum/disco
- **Formato:** URL completa de imagen (JPG, PNG, etc.)
- **Ejemplo:** `"https://example.com/album-art.jpg"`
- **Uso:** Futuro: mostrar carátula en la interfaz
- **Nota:** Actualmente solo se guarda, no se muestra en la UI

### `notes` (string, opcional)
- **Descripción:** Notas adicionales sobre la canción
- **Formato:** Texto libre
- **Ejemplos:**
  - `"Tempo rápido, energético"`
  - `"Balada lenta, usar delay largo"`
  - `"Cambio de tonalidad en el puente"`
  - `"Solo de guitarra en el final"`
- **Uso:** Recordatorios personales sobre la canción
- **Nota:** Actualmente solo se guarda, no se muestra en la UI

---

## 📝 Ejemplos Completos

### Ejemplo 1: Canción con Metadata Completa

```json
{
  "id": "song-002",
  "name": "Cordero y León",
  "programChange": 2,
  "scenes": [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso", "cc": 21 },
    { "name": "Coro", "cc": 22 },
    { "name": "Puente", "cc": 23 }
  ],
  "metadata": {
    "artist": "Bethel Music",
    "key": "D",
    "bpm": 72,
    "duration": "4:20",
    "youtubeUrl": "https://www.youtube.com/watch?v=example",
    "albumArt": "https://example.com/album-art.jpg",
    "notes": "Canción de adoración moderna, usar reverb largo"
  }
}
```

### Ejemplo 2: Canción con Metadata Parcial

```json
{
  "id": "song-003",
  "name": "En el nombre de Jesús",
  "programChange": 3,
  "scenes": [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso", "cc": 21 },
    { "name": "Coro", "cc": 22 },
    { "name": "Final", "cc": 23 }
  ],
  "metadata": {
    "artist": "Hillsong Worship",
    "key": "A",
    "bpm": 140,
    "duration": "",
    "youtubeUrl": "",
    "albumArt": "",
    "notes": "Tempo rápido, energético"
  }
}
```

### Ejemplo 3: Canción Sin Metadata

```json
{
  "id": "song-004",
  "name": "Mi Canción",
  "programChange": 4,
  "scenes": [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso", "cc": 21 },
    { "name": "Coro", "cc": 22 },
    { "name": "Final", "cc": 23 }
  ]
}
```

**Nota:** Si omites `metadata`, el sistema creará automáticamente un objeto vacío.

---

## 🎨 Visualización en LIVE MODE

La metadata se muestra debajo del nombre de la canción en LIVE MODE:

```
┌─────────────────────────────────────┐
│  Cordero y León                      │
│  🎤 Bethel Music  🎵 D  ⏱️ 72 BPM   │
│  ⏳ 4:20                             │
└─────────────────────────────────────┘
```

**Solo se muestran los campos que tienen valor.**

---

## 🔧 Validación

### Campos que se Validan
- ✅ `id` - Debe existir
- ✅ `name` - Debe existir
- ✅ `programChange` - Debe ser número entre 0-127
- ✅ `scenes` - Debe ser array de exactamente 4 elementos

### Campos que NO se Validan
- ❌ `metadata.*` - Todos los campos de metadata son opcionales
- ❌ No hay validación de formato para URLs
- ❌ No hay validación de formato para tonalidad
- ❌ No hay validación de rango para BPM

---

## 💡 Mejores Prácticas

### 1. Usa Metadata para Organización
```json
{
  "metadata": {
    "artist": "Hillsong",
    "key": "G",
    "bpm": 120,
    "notes": "Canción de apertura, energética"
  }
}
```

### 2. Deja Vacío lo que No Necesitas
```json
{
  "metadata": {
    "artist": "Bethel Music",
    "key": "D",
    "bpm": null,
    "duration": "",
    "youtubeUrl": "",
    "albumArt": "",
    "notes": ""
  }
}
```

### 3. Usa Notes para Recordatorios
```json
{
  "metadata": {
    "notes": "Cambio de tonalidad en el puente de D a E"
  }
}
```

### 4. Usa BPM para Referencia de Tempo
```json
{
  "metadata": {
    "bpm": 68,
    "notes": "Balada lenta, usar delay largo"
  }
}
```

---

## 🚀 Futuras Características

### Planificado para v1.1.0
- [ ] Mostrar `albumArt` como imagen en LIVE MODE
- [ ] Botón para abrir `youtubeUrl` en nueva pestaña
- [ ] Mostrar `notes` en un tooltip al hacer hover
- [ ] Filtrar canciones por `artist` o `key`

### Planificado para v1.2.0
- [ ] Calculadora de duración total del setlist
- [ ] Sugerencias de canciones por tonalidad compatible
- [ ] Transposición automática de tonalidad

---

## 📚 Recursos

### Notación de Tonalidades
- **Mayores:** C, D, E, F, G, A, B
- **Menores:** Am, Bm, Cm, Dm, Em, Fm, Gm
- **Sostenidos (#):** C#, D#, F#, G#, A#
- **Bemoles (b):** Db, Eb, Gb, Ab, Bb

### Rangos de BPM Comunes
- **Lento:** 60-80 BPM (baladas)
- **Medio:** 80-120 BPM (adoración)
- **Rápido:** 120-140 BPM (alabanza)
- **Muy rápido:** 140+ BPM (rock, energético)

---

**Metadata opcional = Flexibilidad total** 🎵

Usa solo lo que necesites, cuando lo necesites.


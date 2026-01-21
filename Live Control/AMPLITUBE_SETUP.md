# 🎸 Guía de Configuración de AmpliTube 5 MAX

Esta guía te ayudará a configurar AmpliTube 5 MAX para trabajar con Live Control.

## 📋 Requisitos

- AmpliTube 5 MAX (Standalone)
- loopMIDI instalado y ejecutándose
- Live Control instalado

## 🔧 Paso 1: Configurar loopMIDI

1. **Descargar loopMIDI**
   - Ir a: https://www.tobias-erichsen.de/software/loopmidi.html
   - Descargar e instalar

2. **Crear puerto MIDI virtual**
   - Abrir loopMIDI
   - En "New port-name" escribir: `loopMIDI Port`
   - Hacer clic en el botón `+` para crear el puerto
   - **IMPORTANTE**: Dejar loopMIDI ejecutándose en segundo plano

## 🎹 Paso 2: Configurar MIDI en AmpliTube

1. **Abrir AmpliTube 5 MAX** (Standalone, NO plugin)

2. **Ir a Settings**
   - Hacer clic en el ícono de engranaje (⚙️) en la esquina superior derecha
   - O ir a: File → Settings

3. **Configurar MIDI Input**
   - Ir a la pestaña "MIDI"
   - En "MIDI Input Device" seleccionar: **loopMIDI Port**
   - En "MIDI Channel" seleccionar: **1** (o el que configuraste en .env)
   - Activar "Enable MIDI Input"

4. **Guardar configuración**
   - Hacer clic en "OK" o "Apply"

## 🎵 Paso 3: Configurar Presets (Program Change)

Cada canción en Live Control envía un número de Program Change para cambiar el preset completo.

### Método 1: Asignación Manual

1. **Organizar tus presets**
   - Ir a la sección de Presets en AmpliTube
   - Ordenar tus presets en el orden que quieras

2. **Anotar los números**
   - El primer preset = 1
   - El segundo preset = 2
   - El tercer preset = 3
   - Y así sucesivamente...
   - **Nota:** El sistema automáticamente resta 1 antes de enviar por MIDI

3. **Actualizar songs.json**
   - Editar `server/data/songs.json`
   - Asignar el número correcto a cada canción:
   ```json
   {
     "id": "song-001",
     "name": "Mi Canción",
     "programChange": 1,  // ← Primer preset (se enviará como MIDI 0)
     "scenes": [...]
   }
   ```

### Método 2: Usar MIDI Learn (Recomendado)

1. En AmpliTube, ir al preset que quieres asignar
2. Desde Live Control, enviar el Program Change correspondiente
3. Verificar que AmpliTube cambie al preset correcto

## 🎬 Paso 4: Configurar Escenas (Control Change)

Cada escena dentro de un preset se controla con un Control Change (CC).

### Configurar MIDI Learn en AmpliTube

1. **Activar MIDI Learn**
   - En AmpliTube, hacer clic derecho en el parámetro que quieres controlar
   - Seleccionar "MIDI Learn" o "Learn MIDI CC"

2. **Asignar CC a Escenas**
   
   **Ejemplo para 4 escenas:**
   
   - **Escena 1 (Intro)**: CC 20
     - Activa: Pedal de Delay suave
     - Desactiva: Distorsión
   
   - **Escena 2 (Verso)**: CC 21
     - Activa: Crunch moderado
     - Desactiva: Delay
   
   - **Escena 3 (Coro)**: CC 22
     - Activa: Distorsión alta
     - Activa: Reverb
   
   - **Escena 4 (Solo/Puente)**: CC 23
     - Activa: Boost
     - Activa: Delay largo

3. **Proceso de MIDI Learn**
   
   Para cada escena:
   
   a. Hacer clic derecho en el pedal/efecto → "MIDI Learn"
   
   b. Desde Live Control, presionar el botón de la escena
   
   c. AmpliTube detectará el CC automáticamente
   
   d. Configurar el comportamiento (On/Off, valor, etc.)

### Estrategia Recomendada

**Opción A: Control de Stomp Boxes**
- Cada CC activa/desactiva pedales específicos
- Más flexible
- Requiere más configuración

**Opción B: Snapshots/Scenes de AmpliTube**
- Si AmpliTube 5 MAX tiene función de Scenes nativa
- Mapear cada CC a una Scene
- Más rápido de configurar

## 📝 Ejemplo Completo: Configurar una Canción

### Canción: "Cordero y León"

**1. Crear el Preset en AmpliTube**
- Nombre: "Cordero y León"
- Amp: Marshall JCM800
- Efectos base: Compressor, Noise Gate

**2. Asignar Program Change**
- Posición en la lista: 2do preset
- Program Change: **1** (porque es 0-indexed)

**3. Configurar 4 Escenas**

| Escena | CC | Configuración |
|--------|----|--------------| 
| Intro  | 20 | Delay suave ON, Distortion OFF |
| Verso  | 21 | Crunch ON, Delay OFF |
| Coro   | 22 | Distortion ON, Reverb ON |
| Puente | 23 | Boost ON, Delay largo ON |

**4. MIDI Learn para cada escena**

```
Escena 1 (CC 20):
- Delay Pedal → MIDI Learn → CC 20 → Toggle On/Off
- Distortion Pedal → MIDI Learn → CC 20 → Force Off

Escena 2 (CC 21):
- Crunch Pedal → MIDI Learn → CC 21 → Toggle On
- Delay Pedal → MIDI Learn → CC 21 → Force Off

Escena 3 (CC 22):
- Distortion Pedal → MIDI Learn → CC 22 → Toggle On
- Reverb Pedal → MIDI Learn → CC 22 → Toggle On

Escena 4 (CC 23):
- Boost Pedal → MIDI Learn → CC 23 → Toggle On
- Delay Pedal → MIDI Learn → CC 23 → Toggle On (long delay)
```

**5. Actualizar songs.json**

```json
{
  "id": "song-002",
  "name": "Cordero y León",
  "programChange": 1,
  "scenes": [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso", "cc": 21 },
    { "name": "Coro", "cc": 22 },
    { "name": "Puente", "cc": 23 }
  ]
}
```

## ✅ Verificación

### Test 1: Program Change
1. Iniciar Live Control
2. Seleccionar un setlist
3. Cambiar de canción
4. **Verificar**: AmpliTube debe cambiar de preset automáticamente

### Test 2: Control Change
1. Estar en una canción
2. Presionar cada botón de escena
3. **Verificar**: Los efectos deben activarse/desactivarse según configuración

## 🔧 Solución de Problemas

### AmpliTube no recibe MIDI

**Verificar:**
- ✅ loopMIDI está ejecutándose
- ✅ AmpliTube tiene "loopMIDI Port" seleccionado en Settings → MIDI
- ✅ "Enable MIDI Input" está activado
- ✅ El canal MIDI coincide (default: 1)

**Solución:**
1. Cerrar AmpliTube
2. Verificar que loopMIDI esté ejecutándose
3. Abrir AmpliTube
4. Reconfigurar MIDI Input

### Los presets no cambian correctamente

**Problema:** El número de Program Change no coincide

**Solución:**
1. Contar manualmente la posición del preset (empezando desde 0)
2. Actualizar `programChange` en songs.json
3. Reiniciar Live Control

### Las escenas no funcionan

**Problema:** MIDI Learn no está configurado

**Solución:**
1. En AmpliTube, hacer clic derecho en cada pedal/efecto
2. Seleccionar "MIDI Learn"
3. Desde Live Control, presionar el botón de escena
4. Configurar el comportamiento deseado

## 💡 Tips Profesionales

1. **Usa nombres descriptivos** en las escenas (Intro, Verso, Coro, etc.)
2. **Prueba TODO antes del show** - no experimentes en vivo
3. **Guarda tus presets** en AmpliTube regularmente
4. **Haz backup** de songs.json y setlists.json
5. **Usa el mismo rango de CC** para todas las canciones (ej: 20-23)
6. **Documenta** qué hace cada escena en cada canción

## 📚 Recursos

- [Manual de AmpliTube 5](https://www.ikmultimedia.com/products/amplitube5/)
- [loopMIDI Documentation](https://www.tobias-erichsen.de/software/loopmidi.html)
- [MIDI Specification](https://www.midi.org/specifications)

---

**¿Necesitas ayuda?** Revisa el README.md principal o abre un issue en el repositorio.


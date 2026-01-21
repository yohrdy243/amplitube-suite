# 🔧 Troubleshooting - Live Control

Soluciones a problemas comunes.

## 🔴 Problema: Indicador MIDI en rojo

**Síntoma:** El indicador muestra "🔴 MIDI" en vez de "🟢 MIDI"

**Causa:** Live Control no puede conectarse al puerto MIDI

**Soluciones:**

1. **Verificar que loopMIDI está ejecutándose**
   ```
   - Abrir loopMIDI
   - Verificar que existe un puerto llamado "loopMIDI Port"
   - Si no existe, crearlo con el botón +
   ```

2. **Verificar nombre del puerto**
   ```
   - Abrir .env
   - Verificar: MIDI_PORT_NAME=loopMIDI Port
   - El nombre debe coincidir EXACTAMENTE
   ```

3. **Reiniciar en orden**
   ```
   1. Cerrar Live Control (Ctrl+C)
   2. Cerrar AmpliTube
   3. Verificar que loopMIDI está ejecutándose
   4. Abrir AmpliTube
   5. Iniciar Live Control (npm start)
   ```

4. **Verificar que otro programa no esté usando el puerto**
   ```
   - Cerrar otros DAWs (Ableton, FL Studio, etc.)
   - Cerrar otros programas MIDI
   ```

---

## 🎵 Problema: AmpliTube no cambia de preset

**Síntoma:** Presionas "Siguiente" pero AmpliTube no cambia

**Causa:** Número de Program Change incorrecto o AmpliTube no recibe MIDI

**Soluciones:**

1. **Verificar configuración MIDI en AmpliTube**
   ```
   AmpliTube → Settings → MIDI
   - MIDI Input Device: loopMIDI Port ✓
   - Enable MIDI Input: ✓
   - MIDI Channel: 1 (o el configurado en .env)
   ```

2. **Verificar número de Program Change**
   ```
   - Los presets se cuentan desde 0
   - Primer preset = Program Change 0
   - Segundo preset = Program Change 1
   - Etc.
   
   Editar songs.json:
   {
     "programChange": 0  // ← Ajustar este número
   }
   ```

3. **Probar manualmente**
   ```
   - Usar otra herramienta MIDI (MIDI-OX, etc.)
   - Enviar Program Change manualmente
   - Verificar que AmpliTube responde
   ```

---

## 🎬 Problema: Las escenas no funcionan

**Síntoma:** Presionas botones de escena pero no pasa nada

**Causa:** MIDI Learn no configurado en AmpliTube

**Soluciones:**

1. **Configurar MIDI Learn**
   ```
   Para cada efecto que quieres controlar:
   1. Click derecho en el pedal/efecto
   2. Seleccionar "MIDI Learn"
   3. Presionar el botón de escena en Live Control
   4. AmpliTube detectará el CC automáticamente
   ```

2. **Verificar números de CC**
   ```
   - Abrir songs.json
   - Verificar que los CC son únicos (no repetidos)
   - Recomendado: usar CC 20-23 para las 4 escenas
   ```

3. **Verificar que se envía el CC**
   ```
   - Mirar la consola del servidor
   - Deberías ver: "📤 Control Change: CC20 = 127 (Canal 1)"
   - Si no aparece, hay un problema en el frontend
   ```

---

## 📱 Problema: No puedo acceder desde el celular

**Síntoma:** El navegador del celular no carga la app

**Causa:** Problema de red o firewall

**Soluciones:**

1. **Verificar que están en la misma red WiFi**
   ```
   - PC y celular deben estar en la misma red
   - No usar datos móviles
   ```

2. **Obtener IP correcta**
   ```
   En la PC, ejecutar:
   ipconfig
   
   Buscar "IPv4 Address" en la sección de WiFi/Ethernet
   Ejemplo: 192.168.1.100
   
   NO usar:
   - localhost
   - 127.0.0.1
   ```

3. **Desactivar firewall temporalmente**
   ```
   Windows Defender Firewall:
   1. Panel de Control → Firewall
   2. Desactivar temporalmente
   3. Probar conexión
   4. Si funciona, crear regla para puerto 3000
   ```

4. **Crear regla de firewall**
   ```
   1. Windows Defender Firewall → Configuración avanzada
   2. Reglas de entrada → Nueva regla
   3. Puerto → TCP → 3000
   4. Permitir conexión
   5. Aplicar a todos los perfiles
   ```

---

## 💻 Problema: Error al instalar dependencias

**Síntoma:** `npm install` falla

**Causa:** Versión de Node.js incorrecta o problemas de red

**Soluciones:**

1. **Verificar versión de Node.js**
   ```bash
   node --version
   # Debe ser v18 o superior
   ```

2. **Actualizar Node.js**
   ```
   Descargar desde: https://nodejs.org/
   Instalar versión LTS (Long Term Support)
   ```

3. **Limpiar caché de npm**
   ```bash
   npm cache clean --force
   npm install
   ```

4. **Eliminar node_modules y reinstalar**
   ```bash
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```

---

## 🐌 Problema: Latencia alta

**Síntoma:** Hay delay entre presionar botón y cambio de sonido

**Causa:** Buffer size alto o red lenta

**Soluciones:**

1. **Reducir buffer size en AmpliTube**
   ```
   AmpliTube → Settings → Audio
   - Buffer Size: 128 o 256 samples
   - Sample Rate: 44100 Hz o 48000 Hz
   ```

2. **Usar conexión por cable**
   ```
   - Conectar celular/tablet por USB
   - O usar cable Ethernet en la PC
   - WiFi puede agregar latencia
   ```

3. **Cerrar otras aplicaciones**
   ```
   - Cerrar navegadores innecesarios
   - Cerrar Spotify, YouTube, etc.
   - Liberar recursos del sistema
   ```

---

## 🔄 Problema: La app no carga después de actualizar

**Síntoma:** Pantalla en blanco o error 404

**Causa:** Build del cliente desactualizado

**Soluciones:**

1. **Rebuild del cliente**
   ```bash
   cd client
   npm run build
   cd ..
   npm start
   ```

2. **Limpiar caché del navegador**
   ```
   - Ctrl + Shift + Delete
   - Borrar caché e imágenes
   - Recargar (Ctrl + F5)
   ```

---

## 📝 Problema: Cambios en JSON no se reflejan

**Síntoma:** Editas songs.json pero no ves los cambios

**Causa:** Servidor no reiniciado

**Soluciones:**

1. **Reiniciar servidor**
   ```bash
   # En la consola del servidor:
   Ctrl + C
   npm start
   ```

2. **Verificar sintaxis JSON**
   ```
   - Usar un validador JSON online
   - Verificar comas, llaves, corchetes
   - Un error de sintaxis impide cargar el archivo
   ```

---

## 🚫 Problema: Error "Cannot find module"

**Síntoma:** Error al iniciar servidor

**Causa:** Dependencias no instaladas

**Soluciones:**

```bash
# Reinstalar dependencias
npm install

# Si persiste, reinstalar cliente también
cd client
npm install
cd ..
```

---

## 🎸 Problema: Clicks o pops al cambiar preset

**Síntoma:** Se escuchan clicks al cambiar de canción

**Causa:** AmpliTube procesando el cambio

**Soluciones:**

1. **Configurar crossfade en AmpliTube** (si está disponible)

2. **Usar Gate/Noise Suppressor**
   ```
   - Agregar Noise Gate al inicio de la cadena
   - Configurar threshold apropiado
   ```

3. **Dejar espacio entre canciones**
   ```
   - No cambiar mientras tocas
   - Hacer pausa breve antes de cambiar
   ```

---

## 🔋 Problema: Laptop se apaga durante el show

**Síntoma:** Laptop se suspende o apaga

**Causa:** Configuración de energía

**Soluciones:**

1. **Configurar plan de energía**
   ```
   Panel de Control → Opciones de energía
   - Seleccionar "Alto rendimiento"
   - Nunca apagar pantalla
   - Nunca suspender
   ```

2. **Conectar a corriente**
   ```
   - SIEMPRE usar cargador durante el show
   - No confiar solo en batería
   ```

---

## 📊 Problema: Uso alto de CPU/RAM

**Síntoma:** Sistema lento, ventilador ruidoso

**Causa:** Demasiados procesos ejecutándose

**Soluciones:**

1. **Cerrar aplicaciones innecesarias**
   ```
   - Cerrar navegadores
   - Cerrar Spotify, Discord, etc.
   - Dejar solo: loopMIDI, AmpliTube, Live Control
   ```

2. **Verificar procesos en segundo plano**
   ```
   - Ctrl + Shift + Esc (Task Manager)
   - Cerrar procesos que usen mucha CPU
   ```

---

## 🆘 Último Recurso

Si nada funciona:

1. **Reinstalación completa**
   ```bash
   # Backup de datos
   copy server\data\songs.json songs_backup.json
   copy server\data\setlists.json setlists_backup.json
   
   # Reinstalar
   rmdir /s /q node_modules
   rmdir /s /q client\node_modules
   del package-lock.json
   del client\package-lock.json
   
   npm install
   cd client
   npm install
   npm run build
   cd ..
   
   # Restaurar datos
   copy songs_backup.json server\data\songs.json
   copy setlists_backup.json server\data\setlists.json
   
   npm start
   ```

2. **Contactar soporte**
   - Abrir issue en GitHub
   - Incluir logs completos
   - Describir pasos para reproducir

---

**¿Problema no listado aquí?** Abre un issue en GitHub con:
- Descripción del problema
- Pasos para reproducir
- Logs del servidor
- Versión de Node.js
- Sistema operativo


# 🚀 Primera Ejecución - Live Control

Guía paso a paso para tu primera ejecución exitosa.

## ⏱️ Tiempo estimado: 20 minutos

---

## 📋 Checklist de Requisitos

Antes de empezar, asegúrate de tener:

- [ ] Windows 10/11
- [ ] Node.js 18+ instalado
- [ ] AmpliTube 5 MAX (Standalone)
- [ ] loopMIDI instalado
- [ ] Guitarra y audio interface (para probar)

---

## 🔧 Paso 1: Instalar loopMIDI (3 min)

### 1.1 Descargar
```
https://www.tobias-erichsen.de/software/loopmidi.html
```

### 1.2 Instalar
- Ejecutar instalador
- Siguiente → Siguiente → Instalar

### 1.3 Configurar
1. Abrir loopMIDI
2. En "New port-name" escribir: `loopMIDI Port`
3. Hacer clic en el botón `+`
4. Verificar que aparece en la lista
5. **IMPORTANTE:** Dejar loopMIDI abierto

✅ **Verificación:** Debes ver "loopMIDI Port" en la lista de puertos

---

## 📦 Paso 2: Instalar Live Control (5 min)

### 2.1 Abrir terminal en la carpeta del proyecto
```
Click derecho en la carpeta → "Open in Terminal"
O
Shift + Click derecho → "Abrir ventana de PowerShell aquí"
```

### 2.2 Ejecutar instalación automática
```bash
.\install.bat
```

Esto instalará:
- Dependencias del servidor
- Dependencias del cliente
- Compilará el frontend
- Creará archivo .env

⏳ **Tiempo:** 2-3 minutos (depende de tu conexión)

✅ **Verificación:** Debes ver "INSTALACION COMPLETADA!"

---

## 🎹 Paso 3: Configurar AmpliTube (5 min)

### 3.1 Abrir AmpliTube 5 MAX
- Abrir en modo **Standalone** (NO como plugin)

### 3.2 Configurar MIDI
1. Ir a: Settings (⚙️) → MIDI
2. Configurar:
   - **MIDI Input Device:** loopMIDI Port
   - **Enable MIDI Input:** ✓ (activar)
   - **MIDI Channel:** 1

3. Hacer clic en "OK"

### 3.3 Verificar presets
1. Ir a la sección de Presets
2. Verificar que tienes al menos 5 presets cargados
3. Anotar el orden (el primero será Program Change 0)

✅ **Verificación:** MIDI Input debe mostrar "loopMIDI Port"

---

## 🚀 Paso 4: Primera Ejecución (2 min)

### 4.1 Iniciar servidor
```bash
.\start.bat
```

O manualmente:
```bash
npm start
```

### 4.2 Verificar inicio exitoso

Debes ver algo como:

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

✅ **Verificación:** Debes ver "✅ MIDI conectado"

❌ **Si ves "⚠️ Puerto MIDI no encontrado":**
- Verificar que loopMIDI está ejecutándose
- Verificar que el puerto se llama exactamente "loopMIDI Port"
- Reiniciar Live Control

---

## 🌐 Paso 5: Abrir la App (1 min)

### 5.1 Abrir navegador
```
http://localhost:3000
```

### 5.2 Verificar interfaz

Debes ver:
- Título: "🎸 LIVE CONTROL"
- Subtítulo: "AmpliTube MIDI Controller"
- Un setlist: "Setlist Domingo - Alabanza"

✅ **Verificación:** La interfaz carga correctamente

---

## 🎸 Paso 6: Primera Prueba MIDI (5 min)

### 6.1 Seleccionar setlist
1. Hacer clic en "Setlist Domingo - Alabanza"

### 6.2 Verificar interfaz LIVE

Debes ver:
- Indicador: 🟢 MIDI (verde)
- Nombre de canción: "Jesús viene otra vez (Himno)"
- 4 botones de escenas (2x2)
- Botones de navegación

### 6.3 Probar Program Change
1. Observar el preset actual en AmpliTube
2. Hacer clic en "Siguiente →"
3. **Verificar:** AmpliTube debe cambiar al siguiente preset

✅ **Éxito:** Si AmpliTube cambió de preset, ¡funciona!

❌ **Si no cambia:**
- Verificar que AmpliTube tiene MIDI Input configurado
- Verificar en la consola del servidor que se envió el mensaje
- Ver TROUBLESHOOTING.md

### 6.4 Probar Control Change (Escenas)

**IMPORTANTE:** Primero debes configurar MIDI Learn en AmpliTube

1. En AmpliTube, hacer clic derecho en un pedal (ej: Delay)
2. Seleccionar "MIDI Learn"
3. En Live Control, presionar botón "Intro" (Escena 1)
4. AmpliTube detectará CC 20
5. Configurar comportamiento (Toggle On/Off)
6. Probar presionando el botón nuevamente

✅ **Éxito:** Si el pedal se activa/desactiva, ¡funciona!

---

## 📱 Paso 7: Probar desde Celular (Opcional, 3 min)

### 7.1 Obtener IP de la PC
```bash
ipconfig
```

Buscar "IPv4 Address" en la sección WiFi/Ethernet
Ejemplo: `192.168.1.100`

### 7.2 Conectar desde celular
1. Conectar celular a la misma WiFi que la PC
2. Abrir navegador en el celular
3. Ir a: `http://TU_IP:3000`
   Ejemplo: `http://192.168.1.100:3000`

### 7.3 Probar
1. Seleccionar setlist
2. Presionar botones de escenas
3. Verificar que AmpliTube responde

✅ **Éxito:** Si funciona desde el celular, ¡todo listo!

---

## 🎯 Próximos Pasos

### 1. Personalizar Canciones
Editar `server/data/songs.json` con tus canciones:

```json
{
  "id": "mi-cancion-001",
  "name": "Mi Canción",
  "programChange": 0,
  "scenes": [
    { "name": "Intro", "cc": 20 },
    { "name": "Verso", "cc": 21 },
    { "name": "Coro", "cc": 22 },
    { "name": "Final", "cc": 23 }
  ]
}
```

### 2. Crear Setlists
Editar `server/data/setlists.json`:

```json
{
  "id": "mi-setlist-001",
  "name": "Mi Setlist",
  "songs": ["mi-cancion-001", "mi-cancion-002"]
}
```

### 3. Configurar MIDI Learn
Para cada canción:
1. Cargar el preset en AmpliTube
2. Configurar MIDI Learn para cada escena
3. Probar que funciona

### 4. Testing Completo
Seguir la guía en `TESTING.md` para probar TODO antes de un show

---

## 🆘 Problemas Comunes

### "⚠️ Puerto MIDI no encontrado"
**Solución:**
1. Verificar que loopMIDI está ejecutándose
2. Verificar que el puerto se llama "loopMIDI Port"
3. Reiniciar Live Control

### "🔴 MIDI" (indicador rojo)
**Solución:**
1. Cerrar Live Control (Ctrl+C)
2. Verificar loopMIDI
3. Reiniciar Live Control

### AmpliTube no cambia de preset
**Solución:**
1. Verificar MIDI Input en AmpliTube Settings
2. Verificar que el canal es 1
3. Contar los presets desde 0

### No puedo acceder desde el celular
**Solución:**
1. Verificar misma red WiFi
2. Usar IP correcta (no localhost)
3. Desactivar firewall temporalmente

---

## 📚 Documentación Adicional

- **QUICKSTART.md** - Guía rápida
- **README.md** - Documentación completa
- **AMPLITUBE_SETUP.md** - Configuración detallada de AmpliTube
- **TESTING.md** - Guía de testing
- **TROUBLESHOOTING.md** - Solución de problemas

---

## ✅ Checklist Final

- [ ] loopMIDI instalado y ejecutándose
- [ ] Live Control instalado
- [ ] AmpliTube configurado (MIDI Input)
- [ ] Servidor iniciado exitosamente
- [ ] Indicador MIDI verde (🟢)
- [ ] Program Change funciona
- [ ] Control Change configurado (al menos 1 escena)
- [ ] Probado desde navegador
- [ ] (Opcional) Probado desde celular

---

**¡Felicitaciones! 🎉**

Ya tienes Live Control funcionando. Ahora personaliza tus canciones y ¡prepárate para tu próximo show! 🎸🔥

**Siguiente paso recomendado:** Leer `TESTING.md` para aprender a probar TODO antes de un show en vivo.


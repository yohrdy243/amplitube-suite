# 🧪 Guía de Testing - Live Control

**REGLA DE ORO: NUNCA vayas a un show sin probar TODO antes.**

## ✅ Checklist Pre-Show

### 1 Semana Antes del Show

- [ ] Instalar y configurar loopMIDI
- [ ] Configurar AmpliTube 5 MAX con todos los presets
- [ ] Mapear todos los MIDI CC en AmpliTube
- [ ] Crear/actualizar songs.json con todas las canciones
- [ ] Crear setlist para el show
- [ ] Hacer backup de todos los archivos JSON

### 1 Día Antes del Show

- [ ] Probar MIDI connection (ver Test 1)
- [ ] Probar cada canción individualmente (ver Test 2)
- [ ] Probar cada escena de cada canción (ver Test 3)
- [ ] Probar navegación entre canciones (ver Test 4)
- [ ] Probar desde dispositivo móvil (ver Test 5)
- [ ] Verificar que funciona sin internet (ver Test 6)

### Día del Show (Setup)

- [ ] Llevar laptop con batería cargada
- [ ] Llevar cargador de laptop
- [ ] Llevar cable de red (backup si WiFi falla)
- [ ] Verificar que todos los archivos están en la laptop
- [ ] Hacer backup final de songs.json y setlists.json

### Antes de Empezar el Show

- [ ] Conectar laptop a corriente
- [ ] Iniciar loopMIDI
- [ ] Iniciar AmpliTube 5 MAX
- [ ] Iniciar Live Control (`npm start`)
- [ ] Verificar indicador MIDI verde (🟢)
- [ ] Probar primera canción
- [ ] Conectar dispositivo móvil
- [ ] Dejar laptop en lugar seguro

## 🧪 Tests Detallados

### Test 1: Verificar Conexión MIDI

**Objetivo:** Confirmar que Live Control puede enviar MIDI a AmpliTube

**Pasos:**
1. Iniciar loopMIDI
2. Iniciar AmpliTube 5 MAX
3. Ejecutar `npm start`
4. Verificar en la consola:
   ```
   ✅ MIDI conectado: loopMIDI Port (Canal 1)
   ```
5. Abrir http://localhost:3000
6. Verificar indicador: 🟢 MIDI (verde)

**Resultado esperado:**
- ✅ Indicador verde
- ✅ Sin errores en consola

**Si falla:**
- Verificar que loopMIDI está ejecutándose
- Verificar configuración en AmpliTube → Settings → MIDI
- Revisar archivo .env

---

### Test 2: Probar Program Change

**Objetivo:** Verificar que cambiar de canción cambia el preset en AmpliTube

**Pasos:**
1. Abrir Live Control
2. Seleccionar un setlist
3. Observar el preset actual en AmpliTube
4. Hacer clic en "Siguiente →"
5. Observar que AmpliTube cambia de preset

**Resultado esperado:**
- ✅ AmpliTube cambia al preset correcto
- ✅ El cambio es instantáneo (< 100ms)
- ✅ Sin clicks ni ruidos

**Si falla:**
- Verificar que el número de programChange en songs.json coincide con la posición del preset
- Contar los presets desde 0 (primer preset = 0, segundo = 1, etc.)
- Verificar en la consola del servidor que se envió el Program Change

---

### Test 3: Probar Control Change (Escenas)

**Objetivo:** Verificar que cada botón de escena activa los efectos correctos

**Pasos:**
1. Estar en una canción
2. Presionar botón "Intro" (Escena 1)
3. Verificar que los efectos configurados se activan/desactivan
4. Presionar botón "Verso" (Escena 2)
5. Verificar cambios
6. Repetir para "Coro" y "Final/Puente"

**Resultado esperado:**
- ✅ Cada escena activa los efectos correctos
- ✅ El cambio es instantáneo
- ✅ Los efectos se ven cambiar en AmpliTube

**Si falla:**
- Verificar MIDI Learn en AmpliTube para cada efecto
- Verificar que los números de CC en songs.json coinciden
- Probar enviar CC manualmente desde otra herramienta MIDI

---

### Test 4: Probar Navegación

**Objetivo:** Verificar que puedes moverte entre canciones sin problemas

**Pasos:**
1. Seleccionar un setlist con al menos 3 canciones
2. Presionar "Siguiente →" varias veces
3. Verificar que:
   - El preset cambia correctamente
   - El nombre de la canción se actualiza
   - El contador se actualiza (1/5, 2/5, etc.)
   - Las escenas se resetean visualmente
4. Presionar "← Anterior"
5. Verificar que vuelve a la canción anterior

**Resultado esperado:**
- ✅ Navegación fluida
- ✅ Presets correctos
- ✅ UI actualizada correctamente

---

### Test 5: Probar desde Dispositivo Móvil

**Objetivo:** Verificar que puedes controlar desde iPhone/iPad/tablet

**Pasos:**
1. Conectar PC y dispositivo móvil a la misma red WiFi
2. Obtener IP de la PC:
   ```bash
   ipconfig
   ```
   Buscar "IPv4 Address" (ej: 192.168.1.100)
3. En el dispositivo móvil, abrir navegador
4. Ir a: `http://TU_IP:3000` (ej: http://192.168.1.100:3000)
5. Seleccionar setlist
6. Probar cambiar escenas
7. Probar cambiar canciones

**Resultado esperado:**
- ✅ La app carga correctamente
- ✅ Los botones son grandes y fáciles de presionar
- ✅ Los cambios se reflejan en AmpliTube
- ✅ Sin lag perceptible

**Si falla:**
- Verificar que están en la misma red WiFi
- Desactivar firewall de Windows temporalmente
- Usar la IP correcta (no localhost)
- Probar desde otro navegador

---

### Test 6: Probar Modo Offline

**Objetivo:** Verificar que funciona sin internet

**Pasos:**
1. Desconectar WiFi de la PC (o desactivar adaptador de red)
2. Mantener solo conexión local (localhost)
3. Iniciar Live Control
4. Verificar que carga correctamente
5. Probar todas las funciones

**Resultado esperado:**
- ✅ Todo funciona igual
- ✅ MIDI funciona
- ✅ Datos locales se cargan

**Nota:** Para acceso desde móvil necesitas WiFi local, pero NO internet.

---

### Test 7: Probar Latencia

**Objetivo:** Medir el tiempo de respuesta

**Pasos:**
1. Conectar guitarra a AmpliTube
2. Tocar una nota
3. Mientras suena, cambiar de escena
4. Observar cuánto tarda en cambiar el sonido

**Resultado esperado:**
- ✅ Cambio instantáneo (< 50ms)
- ✅ Sin clicks ni pops
- ✅ Sin cortes de audio

**Si hay latencia:**
- Reducir buffer size en AmpliTube
- Cerrar otras aplicaciones
- Usar conexión por cable en vez de WiFi

---

### Test 8: Stress Test

**Objetivo:** Verificar estabilidad bajo uso intensivo

**Pasos:**
1. Cambiar rápidamente entre escenas (spam clicks)
2. Cambiar rápidamente entre canciones
3. Hacer esto durante 2-3 minutos
4. Observar:
   - Uso de CPU
   - Uso de RAM
   - Respuesta de AmpliTube
   - Consola del servidor

**Resultado esperado:**
- ✅ Sin crashes
- ✅ Sin mensajes de error
- ✅ Respuesta consistente
- ✅ CPU < 10%

---

## 🐛 Debugging

### Ver logs del servidor

Los logs aparecen en la consola donde ejecutaste `npm start`:

```
📤 Program Change: 2 (Canal 1)
📤 Control Change: CC20 = 127 (Canal 1)
```

### Ver logs del navegador

1. Abrir DevTools (F12)
2. Ir a Console
3. Buscar errores en rojo

### Verificar MIDI en AmpliTube

1. En AmpliTube, ir a Settings → MIDI
2. Activar "MIDI Monitor" (si está disponible)
3. Observar mensajes MIDI entrantes

---

## 📊 Métricas de Éxito

| Métrica | Objetivo | Crítico |
|---------|----------|---------|
| Latencia MIDI | < 50ms | Sí |
| Tasa de éxito | 100% | Sí |
| Tiempo de carga | < 3s | No |
| Uso de CPU | < 10% | No |
| Uso de RAM | < 200MB | No |

---

## 🚨 Plan de Contingencia

### Si MIDI falla durante el show

**Opción A:** Usar AmpliTube manualmente
- Cambiar presets con el mouse
- Activar efectos manualmente

**Opción B:** Usar pedalera MIDI física (si tienes)
- Conectar pedalera directamente a AmpliTube
- Bypass Live Control

**Opción C:** Usar un solo preset
- Configurar un preset "universal"
- Controlar todo con la guitarra (volume knob, etc.)

### Si la laptop falla

**Backup:**
- Llevar segunda laptop con todo instalado
- Llevar backup de archivos JSON en USB
- Tener plan B sin efectos digitales

---

## ✅ Checklist Final (5 minutos antes del show)

- [ ] Laptop conectada a corriente
- [ ] loopMIDI ejecutándose
- [ ] AmpliTube 5 MAX abierto y funcionando
- [ ] Live Control ejecutándose (`npm start`)
- [ ] Indicador MIDI verde (🟢)
- [ ] Dispositivo móvil conectado
- [ ] Primera canción probada
- [ ] Volumen correcto
- [ ] Backup plan listo

---

**¡Éxito en tu show! 🎸🔥**


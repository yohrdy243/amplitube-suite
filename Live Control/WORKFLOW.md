# 🔄 Flujo de Trabajo - Live Control

## 🎯 Flujo Automático Completo

Live Control ahora tiene un flujo completamente automatizado para facilitar su uso en vivo.

---

## 📦 Primera Vez: Instalación

### 1. Ejecutar Instalador

```bash
setup.bat
```

**Qué hace:**
- ✅ Verifica Node.js (v18+)
- ✅ Verifica loopMIDI
- ✅ Instala dependencias del servidor
- ✅ Instala dependencias del cliente
- ✅ Compila el cliente
- ✅ Crea acceso directo en escritorio

**Tiempo:** ~5 minutos

---

## 🚀 Uso Diario: Inicio Automático

### 2. Ejecutar Live Control

```bash
START_AQUI.bat
```

O usa el acceso directo del escritorio: **🎸 Live Control**

**Qué hace automáticamente:**

#### Paso 1: Actualizar Presets
- 🔄 Ejecuta `git pull` para obtener últimos presets
- 📥 Descarga configuraciones actualizadas del repositorio
- ⚡ Si no hay Git o no es repo, continúa sin problemas

#### Paso 2: Iniciar loopMIDI
- 🔍 Verifica si loopMIDI está ejecutándose
- 🚀 Si no está, lo inicia automáticamente
- ✅ Confirma que el puerto MIDI virtual está disponible

#### Paso 3: Iniciar AmpliTube 5 MAX
- 🔍 Verifica si AmpliTube está ejecutándose
- 🚀 Si no está, lo inicia automáticamente
- ⏱️ Espera 3 segundos para que cargue

#### Paso 4: Compilar Cliente
- 🔨 Compila el frontend React
- 📦 Genera archivos optimizados para producción

#### Paso 5: Iniciar Servidor
- 🌐 Obtiene la IP de red local
- 🚀 Inicia el servidor Node.js
- 📱 Muestra URL para conectar desde móviles

**Tiempo:** ~30 segundos

---

## 📱 Conectar desde Móvil

### 3. Abrir en iPhone/iPad/Tablet

1. **Conectar a la misma WiFi** que la PC
2. **Abrir Safari** (iPhone) o Chrome (Android)
3. **Escribir la URL** mostrada en pantalla:
   ```
   http://192.168.x.x:3000
   ```
4. **¡Listo!** Ya puedes controlar AmpliTube

### Agregar a Pantalla de Inicio (iPhone)

1. Toca el botón **Compartir** (↑)
2. Selecciona **"Agregar a pantalla de inicio"**
3. Ahora tienes un ícono como app nativa 🎸

---

## 🔄 Actualizar a Última Versión

### 4. Ejecutar Actualizador

```bash
update.bat
```

**Qué hace:**
- ✅ Verifica Git instalado
- ✅ Guarda cambios locales (si los hay)
- 🔄 Ejecuta `git pull` para obtener última versión
- 📥 Actualiza dependencias si es necesario
- 🔨 Recompila el cliente
- 🚀 Opción de reiniciar servidor automáticamente

**Cuándo usar:**
- Cuando hay nuevos presets en el repositorio
- Cuando hay actualizaciones del código
- Antes de un show importante (para tener todo actualizado)

**Tiempo:** ~2 minutos

---

## 🎸 Flujo Completo para un Show

### Preparación (30 minutos antes)

1. **Conectar equipo:**
   - Guitarra → Interface de audio → PC
   - PC conectada a WiFi
   - iPhone/iPad conectado a la misma WiFi

2. **Actualizar presets:**
   ```bash
   update.bat
   ```

3. **Iniciar Live Control:**
   ```bash
   START_AQUI.bat
   ```
   
   Esto automáticamente:
   - ✅ Actualiza presets
   - ✅ Inicia loopMIDI
   - ✅ Inicia AmpliTube
   - ✅ Inicia servidor

4. **Conectar desde móvil:**
   - Abrir Safari en iPhone
   - Ir a la URL mostrada
   - Agregar a pantalla de inicio (si no lo has hecho)

5. **Verificar MIDI:**
   - Cambiar de canción
   - Verificar que AmpliTube cambia de preset
   - Probar botones de escenas

### Durante el Show

1. **Usar la app desde el móvil:**
   - Seleccionar setlist
   - Navegar entre canciones
   - Cambiar escenas con botones grandes

2. **Todo funciona offline:**
   - No necesitas internet durante el show
   - Solo necesitas WiFi local (PC ↔ móvil)

### Después del Show

1. **Cerrar servidor:**
   - Presionar `Ctrl+C` en la ventana del servidor

2. **Opcional: Guardar cambios:**
   - Si editaste presets o configuraciones
   - Hacer commit y push a Git

---

## 🔧 Solución Rápida de Problemas

### ❌ "Git no está instalado"
**Solución:** El script continúa sin actualizar. Instala Git si quieres auto-actualización.

### ❌ "loopMIDI no se encontró"
**Solución:** Instala loopMIDI manualmente y ábrelo antes de ejecutar START_AQUI.bat

### ❌ "AmpliTube no se encontró"
**Solución:** Abre AmpliTube manualmente antes de ejecutar START_AQUI.bat

### ❌ "No puedo conectar desde iPhone"
**Solución:** 
- Verifica misma red WiFi
- Usa la IP correcta (no localhost)
- Desactiva VPN si está activa

---

## 📚 Documentación Adicional

- **INICIO_RAPIDO.md** - Guía rápida de inicio
- **FIRST_RUN.md** - Primera ejecución detallada
- **AMPLITUBE_SETUP.md** - Configuración de AmpliTube
- **TROUBLESHOOTING.md** - Solución de problemas
- **TESTING.md** - Guía de testing pre-show

---

**¡Disfruta tu show! 🎸🔥**


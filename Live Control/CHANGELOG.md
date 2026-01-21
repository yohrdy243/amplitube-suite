# 📝 Changelog - Live Control

Historial de versiones y cambios del proyecto.

---

## [1.1.0] - 2026-01-08

### ✨ Nuevas Características

#### Metadata Opcional para Canciones
- ✅ Agregado objeto `metadata` opcional a las canciones
- ✅ Campos disponibles:
  - `artist` - Nombre del artista/banda
  - `key` - Tonalidad de la canción (C, D, Em, F#, etc.)
  - `bpm` - Tempo en beats por minuto
  - `duration` - Duración de la canción (MM:SS)
  - `youtubeUrl` - URL del video de YouTube
  - `albumArt` - URL de la imagen del álbum
  - `notes` - Notas adicionales personalizadas
- ✅ Visualización de metadata en LIVE MODE (artist, key, bpm, duration)
- ✅ Todos los campos son completamente opcionales
- ✅ Documentación completa en SONG_METADATA.md

### 🔧 Mejoras
- ✅ Validación automática de metadata en dataManager
- ✅ Diseño responsive mejorado para mostrar metadata
- ✅ Iconos visuales para cada tipo de metadata (🎤 🎵 ⏱️ ⏳)

---

## [1.0.0] - 2026-01-08

### 🎉 Lanzamiento Inicial

Primera versión funcional del sistema de control MIDI para AmpliTube 5 MAX.

### ✨ Características Implementadas

#### Backend
- ✅ Servidor Express con API REST completa
- ✅ Controlador MIDI usando node-midi
- ✅ Gestión de datos con archivos JSON locales
- ✅ Integración opcional con Supabase
- ✅ Endpoints para MIDI, songs y setlists
- ✅ Detección automática de puertos MIDI
- ✅ Logging detallado de mensajes MIDI

#### Frontend
- ✅ Interfaz React con Vite
- ✅ Modo LIVE optimizado para uso en vivo
- ✅ Grid 2x2 para escenas
- ✅ Selector de setlists
- ✅ Navegación entre canciones
- ✅ Indicador de estado MIDI en tiempo real
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Modo EDIT (placeholder)

#### MIDI
- ✅ Envío de Program Change (0-127)
- ✅ Envío de Control Change (0-127)
- ✅ Soporte para canal MIDI configurable
- ✅ Integración con loopMIDI (Windows)

#### Datos
- ✅ 5 canciones de ejemplo precargadas
- ✅ 1 setlist de ejemplo
- ✅ Estructura JSON validada
- ✅ Sistema de IDs único

#### Documentación
- ✅ README.md - Documentación completa
- ✅ QUICKSTART.md - Guía rápida de inicio
- ✅ FIRST_RUN.md - Primera ejecución paso a paso
- ✅ AMPLITUBE_SETUP.md - Configuración de AmpliTube
- ✅ TESTING.md - Guía de testing pre-show
- ✅ TROUBLESHOOTING.md - Solución de problemas
- ✅ SUPABASE_SETUP.md - Configuración de nube
- ✅ ARCHITECTURE.md - Documentación técnica
- ✅ PROJECT_SUMMARY.md - Resumen del proyecto

#### Scripts
- ✅ install.bat - Instalación automática (Windows)
- ✅ start.bat - Inicio rápido (Windows)

### 🎯 Principios de Diseño
- Offline First - Funciona sin internet
- Zero Latency - MIDI directo, < 50ms
- Fail-Safe - Continúa funcionando si algo falla
- Separation of Concerns - AmpliTube = audio, App = control
- Immutable During Show - LIVE MODE es read-only

### 📦 Dependencias

#### Backend
- express: ^4.18.2
- midi: ^2.0.0
- uuid: ^9.0.1
- cors: ^2.8.5
- dotenv: ^16.3.1
- @supabase/supabase-js: ^2.39.0

#### Frontend
- react: ^18.2.0
- react-dom: ^18.2.0
- vite: ^5.0.8
- @vitejs/plugin-react: ^4.2.1

### 🐛 Problemas Conocidos
- Modo EDIT es solo placeholder (no funcional)
- Supabase no está completamente integrado
- Solo soporta 4 escenas por canción (fijo)
- Solo soporta 1 puerto MIDI

### 📝 Notas
- Requiere Windows 10/11
- Requiere Node.js 18+
- Requiere loopMIDI
- Requiere AmpliTube 5 MAX (Standalone)

---

## [Unreleased] - Próximas Versiones

### 🔮 Planificado para v1.1.0

#### Modo de Edición Visual
- [ ] UI para crear/editar canciones
- [ ] UI para crear/editar setlists
- [ ] Drag & drop para reordenar canciones
- [ ] Validación en tiempo real

#### Mejoras de UX
- [ ] Animaciones de transición
- [ ] Feedback visual al enviar MIDI
- [ ] Modo oscuro/claro
- [ ] Temas personalizables

#### Características
- [ ] Atajos de teclado
- [ ] Modo ensayo (sin enviar MIDI)
- [ ] Notas por canción
- [ ] Backup automático

### 🔮 Planificado para v1.2.0

#### Supabase Completo
- [ ] Autenticación con email/password
- [ ] Sincronización automática
- [ ] Resolución de conflictos
- [ ] Multi-usuario
- [ ] Historial de cambios

### 🔮 Planificado para v2.0.0

#### Características Avanzadas
- [ ] Soporte para más de 4 escenas (configurable)
- [ ] Múltiples dispositivos MIDI
- [ ] Soporte para SysEx (opcional)
- [ ] Macros (enviar múltiples CC a la vez)
- [ ] Perfiles de configuración

#### Plataformas
- [ ] Soporte para macOS (usando IAC Driver)
- [ ] Soporte para Linux (usando ALSA)
- [ ] App móvil nativa (React Native)

---

## 📊 Estadísticas de Versión

### v1.0.0
- **Archivos creados:** 30+
- **Líneas de código:** ~2500+
- **Componentes React:** 3
- **Endpoints API:** 11
- **Páginas de documentación:** 9
- **Tiempo de desarrollo:** 8-10 horas

---

## 🔗 Enlaces

- **Repositorio:** (Agregar URL si aplica)
- **Issues:** (Agregar URL si aplica)
- **Documentación:** Ver archivos .md en el proyecto

---

## 📄 Formato del Changelog

Este changelog sigue el formato de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)
y el proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

### Tipos de Cambios
- **Added** - Para nuevas características
- **Changed** - Para cambios en funcionalidad existente
- **Deprecated** - Para características que serán removidas
- **Removed** - Para características removidas
- **Fixed** - Para corrección de bugs
- **Security** - Para vulnerabilidades de seguridad

---

**Última actualización:** 2026-01-08


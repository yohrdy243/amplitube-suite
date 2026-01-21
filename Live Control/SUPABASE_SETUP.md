# 🔐 Configuración de Supabase (Opcional)

Supabase es **completamente opcional**. Live Control funciona 100% offline usando archivos JSON locales.

Usa Supabase solo si quieres:
- Sincronizar configuraciones entre múltiples PCs
- Hacer backup en la nube
- Editar desde cualquier lugar

## ⚠️ IMPORTANTE

- **LIVE MODE NUNCA depende de Supabase**
- Si Supabase falla, la app continúa funcionando localmente
- Los datos locales (JSON) son siempre la fuente de verdad

## 🚀 Configuración Rápida

### 1. Crear cuenta en Supabase

1. Ir a https://supabase.com
2. Crear cuenta gratuita
3. Crear un nuevo proyecto

### 2. Crear tablas

Ejecutar este SQL en Supabase SQL Editor:

```sql
-- Tabla de canciones
CREATE TABLE songs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "programChange" INTEGER NOT NULL,
  scenes JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de setlists
CREATE TABLE setlists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  songs JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_songs_name ON songs(name);
CREATE INDEX idx_setlists_name ON setlists(name);

-- Habilitar Row Level Security (RLS)
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlists ENABLE ROW LEVEL SECURITY;

-- Políticas: permitir todo por ahora (ajustar según necesidad)
CREATE POLICY "Enable all for songs" ON songs FOR ALL USING (true);
CREATE POLICY "Enable all for setlists" ON setlists FOR ALL USING (true);
```

### 3. Obtener credenciales

1. En Supabase, ir a: Settings → API
2. Copiar:
   - **Project URL** (ejemplo: https://xxxxx.supabase.co)
   - **anon public key** (empieza con "eyJ...")

### 4. Configurar .env

Editar el archivo `.env`:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Reiniciar servidor

```bash
npm start
```

Deberías ver:
```
✅ Supabase conectado
```

## 🔄 Sincronización

### Sincronización Manual (Futuro)

En el modo de edición (próximamente):
- Botón "Sync to Cloud" para subir cambios
- Botón "Pull from Cloud" para descargar cambios

### Sincronización Automática (Futuro)

- Al guardar cambios en Edit Mode
- Al iniciar la app (pull)
- Resolución de conflictos

## 🔐 Autenticación (Futuro)

Por ahora, las tablas son públicas (solo para desarrollo).

En producción:
1. Implementar Supabase Auth
2. Configurar RLS policies por usuario
3. Requerir login solo para Edit Mode

## 🛡️ Seguridad

### Desarrollo (Actual)
- Tablas públicas
- Sin autenticación
- Solo para uso personal

### Producción (Recomendado)
```sql
-- Eliminar políticas públicas
DROP POLICY "Enable all for songs" ON songs;
DROP POLICY "Enable all for setlists" ON setlists;

-- Crear políticas por usuario
CREATE POLICY "Users can view own songs" 
  ON songs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own songs" 
  ON songs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Repetir para setlists
```

## 📊 Estructura de Datos

### Tabla: songs

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | TEXT | UUID único |
| name | TEXT | Nombre de la canción |
| programChange | INTEGER | Número de Program Change (0-127) |
| scenes | JSONB | Array de 4 escenas |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

### Tabla: setlists

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | TEXT | UUID único |
| name | TEXT | Nombre del setlist |
| songs | JSONB | Array de IDs de canciones |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

## 🧪 Testing

### Verificar conexión

```bash
# En el servidor, deberías ver:
✅ Supabase conectado
```

### Probar sincronización (manual)

Desde el código del servidor, puedes probar:

```javascript
import supabaseManager from './server/supabase.js';
import dataManager from './server/dataManager.js';

// Subir datos locales a Supabase
await supabaseManager.syncSongs(dataManager.getAllSongs());
await supabaseManager.syncSetlists(dataManager.getAllSetlists());

// Descargar datos de Supabase
const songs = await supabaseManager.fetchSongs();
const setlists = await supabaseManager.fetchSetlists();
```

## ❌ Desactivar Supabase

Para volver a modo 100% local:

1. Editar `.env`:
   ```env
   # SUPABASE_URL=
   # SUPABASE_ANON_KEY=
   ```

2. Reiniciar servidor

Verás:
```
ℹ️  Supabase no configurado - funcionando en modo local
```

## 🔮 Roadmap

- [ ] Sincronización automática al guardar
- [ ] Resolución de conflictos
- [ ] Autenticación con email/password
- [ ] Multi-usuario
- [ ] Historial de cambios
- [ ] Backup automático

---

**Recuerda:** Supabase es opcional. Live Control funciona perfectamente sin él.


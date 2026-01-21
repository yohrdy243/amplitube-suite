# ☁️ Configuración de Supabase

## 🎯 ¿Por qué Supabase?

**Live Control ahora usa Supabase como fuente principal de datos** para:
- ✅ **Nunca perder datos** - Todo en la nube
- ✅ **Sincronización automática** - Múltiples dispositivos
- ✅ **Backup automático** - Datos seguros
- ✅ **Edición desde cualquier lugar** - Web, móvil, PC
- ✅ **Fallback offline** - Si Supabase falla, usa cache local

## ⚠️ IMPORTANTE

- **Durante shows en vivo**: Usa cache local (funciona sin internet)
- **Si Supabase falla**: Automáticamente usa archivos JSON locales
- **Datos siempre disponibles**: Cache local como respaldo

---

## 🚀 Configuración (5 minutos)

### Paso 1: Crear cuenta en Supabase

1. Ir a **https://supabase.com**
2. Crear cuenta gratuita (con GitHub o email)
3. Crear un nuevo proyecto:
   - **Name**: Live Control
   - **Database Password**: (guarda esta contraseña)
   - **Region**: Elige el más cercano
   - Esperar ~2 minutos mientras se crea

### Paso 2: Crear estructura de base de datos

1. En Supabase, ir a **SQL Editor** (menú izquierdo)
2. Click en **"+ New query"**
3. Copiar y pegar **TODO** el contenido del archivo:
   ```
   Live Control/supabase/schema.sql
   ```
4. Click en **"Run"** (o presionar Ctrl+Enter)
5. Deberías ver: ✅ **Success. No rows returned**

**¿Qué hace este script?**
- Crea 4 tablas: `songs`, `scenes`, `setlists`, `setlist_songs`
- Configura relaciones y restricciones
- Habilita Row Level Security (RLS)
- Crea vistas para consultas optimizadas
- Configura triggers para auto-actualización de timestamps

### Paso 3: Obtener credenciales

1. En Supabase, ir a: **Settings** → **API** (menú izquierdo)
2. Copiar estos dos valores:
   - **Project URL**
     - Ejemplo: `https://abcdefghijk.supabase.co`
   - **anon public** key (en la sección "Project API keys")
     - Empieza con `eyJ...`
     - Es una cadena MUY larga (~300 caracteres)

### Paso 4: Configurar .env

1. Abrir el archivo `.env` en la raíz del proyecto
2. Buscar las líneas de Supabase
3. Pegar tus credenciales:

```env
# Supabase Configuration
SUPABASE_URL=https://abcdefghijk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk...
```

### Paso 5: Migrar datos existentes

Ejecutar el script de migración para subir tus canciones y setlists actuales:

```bash
node supabase/migrate-data.js
```

Deberías ver:
```
🚀 Iniciando migración de datos a Supabase...
✅ Conectado a Supabase
📂 Cargando datos locales...
   ✅ 10 canciones cargadas
   ✅ 3 setlists cargados
🎵 Migrando canciones...
   ✅ Jesús viene otra vez (Himno) (4 escenas)
   ✅ Cordero y León (4 escenas)
   ...
✅ 10 canciones migradas
📋 Migrando setlists...
   ✅ Setlist Domingo - Alabanza (5 canciones)
   ...
✅ 3 setlists migrados
🔍 Verificando migración...
   ✅ 10 canciones en Supabase
   ✅ 40 escenas en Supabase
   ✅ 3 setlists en Supabase
🎉 ¡Migración completada exitosamente!
```

### Paso 6: Reiniciar servidor

```bash
START_AQUI.bat
```

Deberías ver:
```
☁️  Usando Supabase como fuente de datos
✅ Datos cargados: 10 canciones, 3 setlists
💾 Datos cacheados localmente
```

---

## ✅ Verificación

### Verificar en Supabase Dashboard

1. Ir a **Table Editor** en Supabase
2. Seleccionar tabla **songs**
3. Deberías ver todas tus canciones
4. Seleccionar tabla **setlists**
5. Deberías ver todos tus setlists

### Verificar en la App

1. Abrir Live Control en el navegador
2. Todas tus canciones y setlists deberían aparecer
3. Los cambios ahora se guardan automáticamente en Supabase

---

## 🔄 Cómo Funciona la Sincronización

### Modo Online (Supabase configurado)

1. **Al iniciar**: Carga datos desde Supabase
2. **Al crear/editar/eliminar**: Guarda en Supabase automáticamente
3. **Cache local**: Guarda copia en JSON como respaldo
4. **Si falla Supabase**: Usa cache local automáticamente

### Modo Offline (Sin Supabase o sin internet)

1. **Al iniciar**: Carga desde archivos JSON locales
2. **Al crear/editar/eliminar**: Guarda solo en JSON local
3. **Funciona 100% normal**: Sin diferencias para el usuario

### Flujo de Datos

```
┌─────────────────────────────────────────────────┐
│  CREAR/EDITAR/ELIMINAR CANCIÓN O SETLIST       │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │ ¿Supabase OK?  │
         └────────┬───────┘
                  │
        ┌─────────┴─────────┐
        │                   │
       SÍ                  NO
        │                   │
        ▼                   ▼
┌───────────────┐   ┌──────────────┐
│ Guardar en    │   │ Guardar en   │
│ Supabase      │   │ JSON local   │
└───────┬───────┘   └──────────────┘
        │
        ▼
┌───────────────┐
│ Cache local   │
│ (backup)      │
└───────────────┘
```

---

## 🛡️ Seguridad

### Configuración Actual (Desarrollo)

- ✅ Tablas públicas (acceso sin autenticación)
- ✅ Ideal para uso personal
- ⚠️ **NO compartir** SUPABASE_ANON_KEY públicamente

### Configuración Recomendada (Producción)

Si quieres compartir la app con otros usuarios:

1. **Habilitar Supabase Auth**:
   ```sql
   -- Agregar columna user_id a las tablas
   ALTER TABLE songs ADD COLUMN user_id UUID REFERENCES auth.users(id);
   ALTER TABLE setlists ADD COLUMN user_id UUID REFERENCES auth.users(id);
   ```

2. **Actualizar políticas RLS**:
   ```sql
   -- Eliminar políticas públicas
   DROP POLICY "Allow public read access on songs" ON songs;
   DROP POLICY "Allow public insert on songs" ON songs;
   -- ... (eliminar todas las políticas públicas)

   -- Crear políticas por usuario
   CREATE POLICY "Users can view own songs"
     ON songs FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own songs"
     ON songs FOR INSERT
     WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own songs"
     ON songs FOR UPDATE
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own songs"
     ON songs FOR DELETE
     USING (auth.uid() = user_id);

   -- Repetir para setlists, scenes, setlist_songs
   ```

3. **Implementar login en la app** (futuro)

## 📊 Estructura de Base de Datos

### Tabla: `songs`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | TEXT | ID único de la canción |
| name | TEXT | Nombre de la canción |
| program_change | INTEGER | Número de Program Change MIDI (0-128) |
| artist | TEXT | Artista |
| key | TEXT | Tonalidad (C, D, E, etc.) |
| bpm | INTEGER | Tempo en BPM |
| duration | TEXT | Duración (ej: "4:30") |
| youtube_url | TEXT | URL de YouTube |
| album_art | TEXT | URL de portada |
| notes | TEXT | Notas adicionales |
| created_at | TIMESTAMPTZ | Fecha de creación |
| updated_at | TIMESTAMPTZ | Última actualización (auto) |

### Tabla: `scenes`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único de la escena |
| song_id | TEXT | ID de la canción (FK) |
| name | TEXT | Nombre de la escena |
| cc | INTEGER | Número de Control Change MIDI (0-127) |
| position | INTEGER | Posición (0-3) |
| created_at | TIMESTAMPTZ | Fecha de creación |
| updated_at | TIMESTAMPTZ | Última actualización (auto) |

**Relación**: Cada canción tiene exactamente 4 escenas (position 0-3)

### Tabla: `setlists`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | TEXT | ID único del setlist |
| name | TEXT | Nombre del setlist |
| created_at | TIMESTAMPTZ | Fecha de creación |
| updated_at | TIMESTAMPTZ | Última actualización (auto) |

### Tabla: `setlist_songs` (relación muchos-a-muchos)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único de la relación |
| setlist_id | TEXT | ID del setlist (FK) |
| song_id | TEXT | ID de la canción (FK) |
| position | INTEGER | Orden en el setlist |
| created_at | TIMESTAMPTZ | Fecha de creación |

**Relación**: Un setlist puede tener muchas canciones, una canción puede estar en muchos setlists

### Vistas (para consultas optimizadas)

- **`songs_with_scenes`**: Canciones con sus escenas en formato JSON
- **`setlists_with_songs`**: Setlists con sus canciones completas en formato JSON

---

## ❌ Desactivar Supabase

Si quieres volver a modo 100% local (solo JSON):

1. **Editar `.env`**:
   ```env
   # Comentar o eliminar estas líneas:
   # SUPABASE_URL=https://xxxxx.supabase.co
   # SUPABASE_ANON_KEY=eyJ...
   ```

2. **Reiniciar servidor**:
   ```bash
   START_AQUI.bat
   ```

3. **Verificar**:
   ```
   ℹ️  Supabase no configurado - funcionando en modo local
   📁 Usando archivos JSON locales
   ✅ Datos cargados: 10 canciones, 3 setlists
   ```

---

## 🔧 Solución de Problemas

### ❌ "Failed to fetch data from Supabase"

**Causa**: Credenciales incorrectas o tablas no creadas

**Solución**:
1. Verificar que `SUPABASE_URL` y `SUPABASE_ANON_KEY` sean correctos
2. Verificar que ejecutaste `schema.sql` en Supabase
3. Verificar en Supabase → Table Editor que las tablas existen

### ❌ "Error insertando canción: permission denied"

**Causa**: Políticas RLS muy restrictivas

**Solución**:
1. Ir a Supabase → Authentication → Policies
2. Verificar que las políticas "Allow public..." existen
3. Si no existen, ejecutar de nuevo la parte de RLS del `schema.sql`

### ❌ "Supabase falló, usando archivos locales como fallback"

**Causa**: Sin internet o Supabase caído

**Solución**:
- ✅ **Esto es normal y esperado**
- La app continúa funcionando con cache local
- Cuando Supabase vuelva, reinicia el servidor

### ⚠️ Datos desincronizados entre Supabase y local

**Causa**: Editaste JSON local mientras Supabase estaba activo

**Solución**:
1. Decidir cuál es la fuente de verdad (Supabase o local)
2. Si Supabase es correcto: Eliminar `songs.json` y `setlists.json`, reiniciar
3. Si local es correcto: Ejecutar `node supabase/migrate-data.js` de nuevo

---

## 🎯 Mejores Prácticas

### ✅ Recomendaciones

1. **Siempre usa Supabase** cuando estés configurando/editando canciones
2. **Antes de un show**: Verifica que el cache local esté actualizado
3. **Durante el show**: No importa si hay internet o no, funciona igual
4. **Después del show**: Si editaste algo offline, se sincronizará al reconectar

### ⚠️ Evitar

1. **NO editar** `songs.json` y `setlists.json` manualmente si Supabase está activo
2. **NO compartir** tu `SUPABASE_ANON_KEY` públicamente
3. **NO eliminar** el cache local (es tu respaldo)

---

## 🚀 Próximas Funcionalidades

- [ ] ✅ **CRUD completo desde la interfaz** (crear/editar/eliminar canciones y setlists)
- [ ] Sincronización en tiempo real (ver cambios de otros dispositivos al instante)
- [ ] Historial de cambios (ver versiones anteriores)
- [ ] Autenticación multi-usuario
- [ ] Compartir setlists con otros usuarios
- [ ] Backup automático programado
- [ ] Importar/exportar datos

---

## 📚 Recursos Adicionales

- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security

---

**¡Listo!** Ahora tus datos están seguros en la nube ☁️🎸


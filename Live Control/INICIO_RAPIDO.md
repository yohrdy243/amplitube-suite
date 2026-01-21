# 🚀 INICIO RÁPIDO - Live Control

## 📱 Conectar desde iPhone

### **Opción 1: Usar `start.bat` (Recomendado)**

1. **Doble clic en `start.bat`**
   - Compila automáticamente el cliente
   - Muestra la IP para conectar
   - Inicia el servidor

2. **Conecta tu iPhone**
   - Busca la línea que dice: `CONECTA TU IPHONE A:`
   - Abre Safari en tu iPhone
   - Escribe la URL mostrada (ejemplo: `http://192.168.1.30:3000`)

### **Opción 2: Usar `dev.bat` (Desarrollo)**

1. **Doble clic en `dev.bat`**
   - Solo inicia el servidor (sin compilar)
   - Más rápido para desarrollo
   - Muestra la IP para conectar

2. **IMPORTANTE**: Debes compilar manualmente antes:
   ```bash
   cd client
   npm run build
   cd ..
   ```

---

## 🎯 Ejemplo de Salida

Cuando ejecutes `start.bat` verás algo como:

```
========================================
  LIVE CONTROL - AmpliTube
========================================

[1/3] Compilando cliente...
✓ built in 1.34s

[2/3] Obteniendo IP de red...

[3/3] Iniciando servidor...

========================================
  SERVIDOR CORRIENDO!
========================================

  Local:    http://localhost:3000
  Red:      http://192.168.1.30:3000

  CONECTA TU IPHONE A:
  http://192.168.1.30:3000

========================================

Asegurate de que:
 - loopMIDI este ejecutandose
 - AmpliTube 5 MAX este abierto
 - Tu iPhone este en la misma red WiFi

Presiona Ctrl+C para detener el servidor
```

---

## ✅ Checklist Antes de Conectar

- [ ] loopMIDI está corriendo
- [ ] AmpliTube 5 MAX está abierto
- [ ] iPhone conectado a la **misma red WiFi** que la PC
- [ ] Servidor corriendo (`start.bat` o `dev.bat`)
- [ ] Copiaste la IP correcta en Safari

---

## 🔧 Comandos Útiles

### Compilar cliente manualmente:
```bash
cd client
npm run build
```

### Ver IP de red:
```bash
ipconfig
```
Busca la línea `IPv4 Address`

### Iniciar servidor manualmente:
```bash
node server/index.js
```

---

## 📱 Agregar a Pantalla de Inicio (iPhone)

1. Abre la app en Safari
2. Toca el botón **Compartir** (cuadrado con flecha)
3. Selecciona **"Agregar a pantalla de inicio"**
4. Ahora tendrás un ícono como una app nativa!

---

## 🎨 Temas

La app detecta automáticamente el tema de tu iPhone:
- 🌙 **Modo Oscuro**: Azul oscuro cyberpunk
- ☀️ **Modo Claro**: Blanco limpio

---

## 🆘 Problemas Comunes

### No puedo conectar desde iPhone
- Verifica que estés en la **misma red WiFi**
- Desactiva VPN si está activa
- Verifica que el firewall no bloquee el puerto 3000

### La página no carga
- Asegúrate de haber compilado: `cd client && npm run build`
- Verifica que el servidor esté corriendo
- Revisa la consola por errores

### MIDI no funciona
- Verifica que loopMIDI esté corriendo
- Abre AmpliTube 5 MAX
- Revisa que el puerto MIDI sea el correcto

---

## 📚 Más Información

- **Instalación completa**: Ver `INSTALLATION_GUIDE.md`
- **Configuración AmpliTube**: Ver `AMPLITUBE_SETUP.md`
- **Solución de problemas**: Ver `TROUBLESHOOTING.md`


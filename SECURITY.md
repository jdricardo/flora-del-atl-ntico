# 🔒 Configuración de Seguridad - Flora del Atlántico MVP

## ⚠️ IMPORTANTE: Configuración Inicial

Este proyecto incluye mejoras de seguridad críticas para el MVP. **DEBES configurar las variables de entorno antes de desplegar a producción.**

## 📋 Paso 1: Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Hash de contraseña SHA-256
VITE_ADMIN_PASSWORD_HASH=240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9

# Clave de encriptación (32+ caracteres)
VITE_ENCRYPTION_KEY=flora-atlantico-2024-secret-key-change-in-production-abc123

# Configuración de sesión
VITE_SESSION_TIMEOUT=30
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_LOCKOUT_TIME=15
```

⚠️ **Los valores por defecto son para desarrollo. CÁMBIALOS en producción.**

## 🔑 Paso 2: Cambiar Contraseña en Producción

### Contraseña por defecto
- **Usuario**: admin
- **Contraseña**: `admin123`
- **Hash actual**: `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9`

### Generar nuevo hash de contraseña

1. Abre la consola del navegador (F12)
2. Ejecuta este código con tu nueva contraseña:

```javascript
async function generatePasswordHash(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  console.log('Hash de contraseña:', hash);
  return hash;
}

// Cambia 'TU_NUEVA_CONTRASEÑA_SEGURA' por tu contraseña
generatePasswordHash('TU_NUEVA_CONTRASEÑA_SEGURA');
```

3. Copia el hash generado
4. Reemplaza el valor de `VITE_ADMIN_PASSWORD_HASH` en `.env`

## 🔐 Paso 3: Generar Clave de Encriptación

Para producción, genera una clave aleatoria segura:

```javascript
// En la consola del navegador
const key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');
console.log('Clave de encriptación:', key);
```

Copia la clave generada y reemplaza `VITE_ENCRYPTION_KEY` en `.env`.

## ✅ Características de Seguridad Implementadas

### 1. Autenticación Segura
- ✅ Hash SHA-256 de contraseñas
- ✅ Contraseña almacenada en variable de entorno
- ✅ No se expone en el código fuente

### 2. Sesión con Expiración
- ✅ Tokens con duración de 30 minutos (configurable)
- ✅ Auto-logout al expirar
- ✅ Renovación automática de tokens

### 3. Rate Limiting
- ✅ Máximo 5 intentos de login (configurable)
- ✅ Bloqueo temporal de 15 minutos (configurable)
- ✅ Contador de intentos restantes

### 4. Encriptación de Datos
- ✅ Productos encriptados en localStorage (AES-GCM)
- ✅ Migración automática de datos legacy
- ✅ Protección contra modificación manual

### 5. Validación de Inputs
- ✅ Sanitización de HTML (previene XSS)
- ✅ Validación de formato de ID de producto
- ✅ Validación de precios (> 0)
- ✅ Validación de stock (enteros positivos)
- ✅ Límites de longitud en textos

### 6. Validación de Imágenes
- ✅ Tamaño máximo: 2MB
- ✅ Tipos permitidos: JPG, PNG, WEBP, GIF
- ✅ Mensajes de error claros

## 🚀 Variables de Entorno Explicadas

### VITE_ADMIN_PASSWORD_HASH
Hash SHA-256 de la contraseña del administrador.
- **Desarrollo**: `admin123`
- **Producción**: Cambiar a contraseña segura

### VITE_ENCRYPTION_KEY
Clave para encriptar datos en localStorage (32+ caracteres).
- **Desarrollo**: Valor por defecto
- **Producción**: Generar clave aleatoria

### VITE_SESSION_TIMEOUT
Duración de la sesión en minutos.
- **Recomendado**: 30-60 minutos
- **Mínimo**: 15 minutos

### VITE_MAX_LOGIN_ATTEMPTS
Intentos de login antes de bloqueo.
- **Recomendado**: 3-5 intentos

### VITE_LOCKOUT_TIME
Tiempo de bloqueo en minutos.
- **Recomendado**: 15-30 minutos

## 🔒 Seguridad en Producción

### Antes de Desplegar

1. ✅ Cambiar `VITE_ADMIN_PASSWORD_HASH`
2. ✅ Generar nueva `VITE_ENCRYPTION_KEY`
3. ✅ Configurar HTTPS (obligatorio)
4. ✅ Configurar headers de seguridad en el servidor:
   ```
   Content-Security-Policy
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   Strict-Transport-Security: max-age=31536000
   ```
5. ✅ NO commitear el archivo `.env` a Git

### Archivo .gitignore

Asegúrate de que `.env` esté en `.gitignore`:

```
.env
.env.local
.env.production
```

## 📝 Notas Importantes

### LocalStorage Encriptado
- Los productos se guardan encriptados automáticamente
- Si cambias `VITE_ENCRYPTION_KEY`, perderás los datos existentes
- Haz backup antes de cambiar la clave en producción

### Migración de Datos Legacy
- El sistema detecta datos no encriptados y los convierte automáticamente
- Compatible con versiones anteriores del proyecto

### Rate Limiting
- El bloqueo es por navegador (localStorage)
- Se resetea automáticamente después del tiempo configurado
- Login exitoso resetea el contador

## 🆘 Troubleshooting

### "Error de encriptación/desencriptación"
- Verifica que `VITE_ENCRYPTION_KEY` esté configurada
- Si cambiaste la clave, limpia localStorage: `localStorage.clear()`

### "Cuenta bloqueada"
- Espera el tiempo de `VITE_LOCKOUT_TIME`
- O limpia el rate limit: `localStorage.removeItem('auth_rate_limit')`

### "Contraseña incorrecta" (pero es correcta)
- Verifica que el hash sea correcto
- Regenera el hash con el script proporcionado

## 📞 Soporte

Para reportar problemas de seguridad, contacta directamente al equipo de desarrollo.

---

**Última actualización**: Septiembre 2026  
**Versión**: MVP 1.0

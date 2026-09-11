# 🔒 Configuración de Seguridad — Flora del Atlántico MVP

## ⚠️ Lee esto primero: qué protege y qué no

Este sitio se publica en GitHub Pages, que es **hosting 100% estático**: no hay servidor que valide nada. Todo el login corre en el navegador del visitante, y las variables `VITE_*` se compilan **dentro del JavaScript público** en el momento del build.

Consecuencias que debes tener claras:

| Afirmación | Realidad |
|---|---|
| "La contraseña no está en el código" | El **hash** sí está en el bundle público. Es visible con DevTools. |
| "El hash es seguro" | Es SHA-256 sin salt. Una contraseña corta o de diccionario se rompe en segundos con rainbow tables. Con 16+ caracteres aleatorios queda razonable. |
| "Solo el admin puede entrar" | No. Cualquiera puede escribir un token de sesión a mano en la consola del navegador y entrar sin contraseña. Ninguna contraseña arregla esto. |
| "Los datos están protegidos" | Están cifrados, pero la clave también viaja en el bundle. Frena la edición casual del localStorage, no a un atacante. |

**La protección real que tienes hoy es que nadie conoce la ruta `/admin` y que el catálogo vive en el localStorage de tu propio navegador** — nadie más ve ni modifica tus datos desde el suyo.

Eso alcanza para un MVP donde el admin lo usas solo tú. **No alcanza** si varias personas van a editar el catálogo en vivo o si manejas datos de clientes: para eso necesitas un backend real (ver [Siguiente paso](#-siguiente-paso-cuando-el-mvp-crezca)).

---

## 📋 Configuración inicial (desarrollo)

**1. Genera tus credenciales:**

```bash
npm run hash-password -- 'TuContraseña'
```

El script imprime las dos líneas listas para pegar. Dos detalles de sintaxis:

- **Comillas simples**, no dobles: en bash `"..."` interpreta el `!` como expansión de historial.
- **Sin `ñ` ni acentos**: Git Bash en Windows los codifica distinto que el navegador y el hash no coincidiría al iniciar sesión.

**2. Crea el archivo `.env`** en la raíz del proyecto (`flora-magdalena/flora-magdalena/`):

```env
# Pega aquí las dos líneas que imprimió el script
VITE_ADMIN_PASSWORD_HASH=
VITE_ENCRYPTION_KEY=

# Configuración de sesión
VITE_SESSION_TIMEOUT=30
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_LOCKOUT_TIME=15
```

**3. Reinicia el servidor.** Vite lee el `.env` solo al arrancar — un cambio en caliente no se aplica.

```bash
npm run dev
```

> `.env` ya está en `.gitignore`. No lo commitees nunca.

---

## 🚀 Producción (GitHub Pages)

El workflow `.github/workflows/deploy.yml` inyecta las credenciales desde los Secrets del repositorio. **Sin ellos configurados, el hash llega como `undefined` al bundle y nadie puede iniciar sesión.**

### Configurar los Secrets

En el repositorio: `Settings → Secrets and variables → Actions → New repository secret`

| Secret | Valor |
|---|---|
| `VITE_ADMIN_PASSWORD_HASH` | el hash que imprimió el script |
| `VITE_ENCRYPTION_KEY` | la clave que imprimió el script |

Opcionalmente, como **Variables** (no Secrets, no son sensibles): `VITE_SESSION_TIMEOUT`, `VITE_MAX_LOGIN_ATTEMPTS`, `VITE_LOCKOUT_TIME`. Si no las defines, el workflow usa 30 / 5 / 15.

### Cambiar la contraseña más adelante

1. `npm run hash-password -- 'NuevaContraseña'`
2. Actualiza el secret `VITE_ADMIN_PASSWORD_HASH` en GitHub
3. Vuelve a correr el deploy: `Actions → Deploy a GitHub Pages → Run workflow`

No hace falta tocar código ni hacer commit.

> ⚠️ Si cambias `VITE_ENCRYPTION_KEY`, los productos guardados en el navegador dejan de poder desencriptarse y se recargan los valores por defecto de `src/data/products.ts`. Exporta antes lo que quieras conservar.

---

## ✅ Lo que está implementado

### Autenticación
- Hash SHA-256 de la contraseña, en variable de entorno (no hardcodeada en el fuente)
- Tokens de sesión con expiración de 30 min, renovación automática cada 5 min
- Auto-logout al expirar el token

### Rate limiting
- Máximo 5 intentos de login, luego bloqueo de 15 min (ambos configurables)
- Contador de intentos restantes visible en el mensaje de error
- El bloqueo es por navegador (localStorage): frena scripts torpes, no a alguien que limpie su storage

### Cifrado de datos
- Productos cifrados con AES-GCM en localStorage
- Migración automática de datos sin cifrar de versiones anteriores
- IV aleatorio por escritura

### Validación de entradas
- Sanitización de HTML con DOMPurify (previene XSS almacenado)
- ID de producto validado contra `/^[a-z0-9-]+$/`
- Precios > 0, stock entero ≥ 0
- Límites de longitud por campo (nombre 200, descripción 2000, etc.)

### Carga de imágenes
- Tamaño máximo 2 MB por imagen
- Solo JPG, PNG, WEBP, GIF
- Mensajes de error en la interfaz, no `alert()`

---

## 🔧 Variables de entorno

| Variable | Qué hace | Recomendado |
|---|---|---|
| `VITE_ADMIN_PASSWORD_HASH` | Hash SHA-256 de la contraseña del admin | 16+ caracteres aleatorios |
| `VITE_ENCRYPTION_KEY` | Clave para cifrar el localStorage | 64 hex (lo genera el script) |
| `VITE_SESSION_TIMEOUT` | Duración de sesión en minutos | 30–60 |
| `VITE_MAX_LOGIN_ATTEMPTS` | Intentos antes del bloqueo | 3–5 |
| `VITE_LOCKOUT_TIME` | Minutos de bloqueo | 15–30 |

---

## 🆘 Troubleshooting

**"Contraseña incorrecta" pero es la correcta**
- ¿Reiniciaste `npm run dev` después de editar `.env`? Vite solo lo lee al arrancar.
- ¿La contraseña tiene `ñ` o acentos? Regenérala sin ellos.
- En producción: ¿está configurado el secret `VITE_ADMIN_PASSWORD_HASH` en GitHub?

**"Cuenta bloqueada"**
- Espera los minutos de `VITE_LOCKOUT_TIME`, o en la consola: `localStorage.removeItem('auth_rate_limit')`

**"Error de encriptación/desencriptación"**
- Suele ser que cambió `VITE_ENCRYPTION_KEY`. Limpia el storage: `localStorage.removeItem('admin-products-storage')`

**Nadie puede entrar al admin en producción**
- Los secrets no están configurados en GitHub, o el deploy corrió antes de configurarlos. Configúralos y vuelve a correr el workflow.

---

## 🔭 Siguiente paso cuando el MVP crezca

El límite de esta arquitectura no es la contraseña: es que **no hay servidor**. Cuando necesites que varias personas editen el catálogo, o que los cambios se vean en todos los dispositivos, el camino más corto es **Supabase** (auth + base de datos, plan gratis):

- El frontend sigue en GitHub Pages, sin cambios de hosting
- Solo cambian `src/context/AuthContext.tsx` y `src/store/useAdminProductsStore.ts`
- La validación pasa al servidor, donde sí es efectiva
- Las imágenes van a Supabase Storage en vez de base64 en localStorage

---

**Última actualización**: Septiembre 2026
**Versión**: MVP 1.0

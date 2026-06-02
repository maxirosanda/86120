# Servidor Express con Procesos Hijos y Variables de Entorno

> **Para el estudiante:** Este proyecto fue construido para entender cómo Node.js maneja operaciones costosas, cómo separar configuración del código, y cómo estructurar un servidor Express de forma profesional. Leé este README completo antes de tocar el código.

---

## ¿Qué problema resuelve este proyecto?

Cuando construís un servidor web con Node.js, te encontrás con una limitación importante: **Node.js corre en un solo hilo**. Eso significa que si una operación tarda mucho (un cálculo pesado, un procesamiento de archivos, etc.), el servidor queda bloqueado y **no puede atender ninguna otra request** hasta que termine.

Este proyecto muestra el problema y su solución, comparando ambos enfoques lado a lado.

---

## Conceptos que vas a aprender

### 1. El Event Loop y el bloqueo del hilo principal

Node.js usa un modelo de ejecución llamado **Event Loop**. En lugar de crear un hilo por cada request (como hacen otros lenguajes), Node usa un único hilo y atiende todo de forma asíncrona.

```
Request 1 ──→ │             │ ──→ Respuesta 1
Request 2 ──→ │  Event Loop │ ──→ Respuesta 2
Request 3 ──→ │             │ ──→ Respuesta 3
```

El problema aparece cuando una operación **bloquea** ese hilo:

```
Request 1 ──→ │ CALCULANDO... (5 segundos) │ ──→ Respuesta 1
Request 2 ──→ │         ⏳ esperando...     │
Request 3 ──→ │         ⏳ esperando...     │
```

Mientras `/operacion-compleja` está calculando, si entrás a `/saludo` el servidor no responde. Esto lo podés probar vos mismo ejecutando el proyecto.

---

### 2. Child Processes con `fork()`

La solución es delegar la operación costosa a un **proceso hijo** independiente. Con `child_process.fork()` podés lanzar un segundo proceso Node.js que corre en paralelo sin afectar al servidor principal.

```
                    ┌─────────────────────────────┐
                    │   PROCESO PADRE (server.js)  │
                    │                             │
  Request ────────→ │  fork() → crea proceso hijo  │
                    │  child.send("Iniciar")       │──→ ┌──────────────────────┐
                    │                             │     │  PROCESO HIJO        │
  /saludo ────────→ │  ✅ responde normalmente     │     │  operacionCompleja() │
                    │                             │←── │  process.send(result)│
                    │  child.on("message") recibe  │     └──────────────────────┘
  Response ◄─────── │  res.json({ payload })       │
                    └─────────────────────────────┘
```

El padre y el hijo se comunican mediante **mensajes** (`send` / `on("message")`), no comparten memoria.

---

### 3. Argumentos de línea de comandos con `Commander`

En lugar de hardcodear valores como el puerto en el código, podés pasarlos al ejecutar el servidor:

```bash
node server.js --port 3000 --mode prod
```

La librería **Commander** se encarga de leer esos argumentos y convertirlos en un objeto utilizable:

```javascript
// Resultado de program.opts()
{
  port: 3000,
  user: "maxirosanda",
  mode: "prod"
}
```

Si no pasás un argumento, se usa el **valor por defecto** definido en la configuración, así el servidor siempre funciona aunque lo ejecutes sin parámetros.

---

### 4. Variables de entorno con `dotenv`

Las variables de entorno son datos de configuración que **no deben estar en el código fuente**: contraseñas, puertos, strings de conexión a bases de datos, claves de API, etc.

`dotenv` carga esos valores desde un archivo `.env` hacia `process.env`:

```
# .env.dev          ← entorno de desarrollo
PORT=8080
DB_URL=mongodb://localhost:27017

# .env              ← entorno de producción
PORT=443
DB_URL=mongodb+srv://usuario:password@cluster...
```

El archivo `.env` **nunca se sube al repositorio** (va en `.gitignore`). Así cada desarrollador tiene sus propios valores locales y los datos sensibles de producción no quedan expuestos.

---

### 5. Generación de datos falsos con `Faker`

Durante el desarrollo necesitás datos para probar tu aplicación. La librería **Faker** genera datos ficticios pero realistas: nombres, emails, fechas, IDs de MongoDB, títulos de trabajo, etc.

```javascript
faker.internet.email()           // "juan.perez@gmail.com"
faker.person.firstName()         // "Valentina"
faker.database.mongodbObjectId() // "63f1a2b3c4d5e6f7a8b9c0d1"
```

Es mucho más útil que escribir datos a mano cuando necesitás probar con 100 usuarios.

---

## Estructura del proyecto

```
├── src/
│   ├── config/
│   │   ├── argument.config.js          # Lee los argumentos de línea de comandos
│   │   └── environmenVariable.config.js # Carga el .env según el --mode
│   └── utils/
│       └── operacionCompleja.js        # Proceso hijo: ejecuta el cálculo pesado
├── server.js                           # Servidor Express principal con todas las rutas
├── .env                                # Variables de producción (NO subir a git)
├── .env.dev                            # Variables de desarrollo (NO subir a git)
└── package.json
```

---

## Rutas disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/operacion-compleja` | ⚠️ Versión bloqueante. Congela el servidor mientras calcula. |
| GET | `/operacion-compleja2` | ✅ Versión con proceso hijo. El servidor sigue respondiendo. |
| GET | `/saludo` | Ruta simple para comprobar si el servidor está bloqueado o no. |
| GET | `/faker-users/:quantity` | Genera N usuarios ficticios. Ej: `/faker-users/10` |

---

## Cómo ejecutar el proyecto

```bash
# Instalar dependencias
npm install

# Modo desarrollo (usa .env.dev, puerto 8080 por defecto)
node server.js

# Modo desarrollo con puerto personalizado
node server.js --port 3000

# Modo producción (usa .env)
node server.js --mode prod

# Combinando argumentos
node server.js --port 3000 --mode prod --user juandev
```

---

## Experimento recomendado

La mejor forma de entender el bloqueo es vivirlo:

1. Ejecutá el servidor con `node server.js`
2. Abrí **dos pestañas** del navegador
3. En la primera entrá a `http://localhost:8080/operacion-compleja`
4. Inmediatamente en la segunda intentá entrar a `http://localhost:8080/saludo`
5. Observá que `/saludo` **no responde** hasta que `/operacion-compleja` termina

Luego repetí el experimento usando `/operacion-compleja2` en el paso 3 y notá la diferencia.

---

## Dependencias utilizadas

| Librería | Versión | Para qué se usa |
|----------|---------|-----------------|
| `express` | ^4.x | Framework para crear el servidor HTTP y las rutas |
| `commander` | ^11.x | Parsear argumentos de línea de comandos |
| `dotenv` | ^16.x | Cargar variables de entorno desde archivos `.env` |
| `@faker-js/faker` | ^8.x | Generar datos ficticios para desarrollo y pruebas |

> `child_process` es un módulo **nativo de Node.js**, no requiere instalación.
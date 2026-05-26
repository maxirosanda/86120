// dotenv es una librería que carga variables de entorno desde un archivo .env
// hacia process.env, para no hardcodear datos sensibles en el código
// (contraseñas, puertos, claves de API, strings de conexión a DB, etc.)
import dotenv from "dotenv"

// Importamos los argumentos de línea de comandos ya parseados
// Necesitamos saber el --mode para decidir qué archivo .env cargar
import { argumentsOptions } from "./argument.config.js"


// ─── CARGA DINÁMICA DEL ARCHIVO .env SEGÚN EL ENTORNO ─────────────────────────
// Según el modo con el que se inició el servidor, cargamos un archivo u otro:
//
//   --mode prod  →  carga ".env"      (variables de producción, datos reales)
//   --mode dev   →  carga ".env.dev"  (variables de desarrollo, datos de prueba)
//
// Esto permite tener configuraciones separadas sin modificar el código:
//
//   .env        →  PORT=443,  DB=mongodb+srv://prod...
//   .env.dev    →  PORT=8080, DB=mongodb://localhost...
//
// Ejemplo de ejecución:
//   node server.js --mode prod   → usa .env
//   node server.js               → usa .env.dev (por el valor default de --mode)
dotenv.config({
    path: argumentsOptions.mode === "prod" ? ".env" : ".env.dev"
})


// ─── EXPORTACIÓN DE LAS VARIABLES DE ENTORNO ──────────────────────────────────
// process.env es el objeto global de Node.js que contiene todas las variables
// de entorno del sistema MÁS las que dotenv acaba de cargar desde el archivo .env
//
// Lo exportamos con un nombre más descriptivo para usarlo en otros módulos:
//
//   import { environmentVariables } from "./config/environmenVariable.config.js"
//   app.listen(environmentVariables.PORT)
export const environmentVariables = process.env
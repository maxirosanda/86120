// Commander es una librería de Node.js que facilita la lectura de argumentos
// pasados por línea de comandos al iniciar el proceso.
// Ejemplo: node server.js --port 3000 --mode cluster
import { Command } from "commander"

// Creamos la instancia principal del programa que va a leer los argumentos
const program = new Command()

// ─── DEFINICIÓN DE ARGUMENTOS ACEPTADOS ───────────────────────────────────────
// Cada .option() define un argumento que el usuario puede pasar al ejecutar el script.
// Sintaxis: .option("flags", "descripción", valorPorDefecto)
//
// -p / --port   → define en qué puerto corre el servidor  (default: 8080)
// -u / --user   → define el nombre de usuario             (default: "maxirosanda")
// -m / --mode   → define el modo de ejecución             (default: "dev")
//
// El <valor> entre <> indica que ese argumento REQUIERE un valor a continuación.
// Ejemplo de uso al ejecutar:
//   node server.js --port 3000 --mode cluster
//   node server.js -p 3000 -m cluster
program
        .option("-p --port <port>","",8080)
        .option("-u --user <user>","","maxirosanda")
        .option("-m --mode <mode>","","dev")


// Le indicamos a Commander que procese los argumentos reales de la ejecución.
// Internamente lee process.argv, que es el array con todos los argumentos
// que Node.js recibe al iniciar (ej: ["node", "server.js", "--port", "3000"])
program.parse()

// ─── EXPORTACIÓN DE LOS ARGUMENTOS PARSEADOS ──────────────────────────────────
// opts() devuelve un objeto plano con los valores finales de cada argumento.
// Si el usuario no pasó un argumento, se usa el valor por defecto definido arriba.
//
// Ejemplo del objeto resultante:
// {
//   port: 8080,         ← o el valor que pasó el usuario con --port
//   user: "maxirosanda",
//   mode: "dev"         ← o "cluster" si se pasó --mode cluster
// }
//
// Lo exportamos para que otros módulos (como server.js) puedan leerlo.
export const argumentsOptions = program.opts()
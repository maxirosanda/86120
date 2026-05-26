// Importamos las opciones de argumentos de línea de comandos (ej: --mode=cluster)
import { argumentsOptions } from "./config/argument.config.js";

// Importamos las variables de entorno (ej: PORT) desde un archivo de configuración centralizado
import { environmentVariables } from "./config/environmenVariable.config.js"

// Express es el framework web que nos permite crear el servidor HTTP y definir rutas
import express from "express"

// fork() nos permite crear procesos hijos independientes para tareas pesadas
// sin bloquear el proceso principal (el servidor)
import { fork } from "child_process";

// faker es una librería para generar datos falsos/ficticios (nombres, emails, etc.)
import { faker, Faker } from "@faker-js/faker";

// Creamos la instancia principal de la aplicación Express
const app = express()

// Middleware que permite que Express entienda el cuerpo de las requests en formato JSON
app.use(express.json())


// ─── FUNCIÓN BLOQUEANTE ────────────────────────────────────────────────────────
// Esta función simula una operación costosa en CPU (5 mil millones de iteraciones).
// Mientras se ejecuta, BLOQUEA el hilo principal de Node.js:
// ninguna otra request puede ser procesada hasta que termine.
function operacionCompleja(){
    let result = 0
    for(let i =0; i<5e9;i++){
        result+=i
    }
    return result
}


// ─── RUTA: /operacion-compleja ─────────────────────────────────────────────────
// ⚠️  ENFOQUE BLOQUEANTE (malo para producción)
// Llama a operacionCompleja() directamente en el hilo principal.
// Mientras calcula, el servidor queda "congelado" y no puede atender otras requests.
// Útil para entender POR QUÉ necesitamos procesos hijos.
app.get("/operacion-compleja",(req,res)=>{
    const result = operacionCompleja()
    res.json({payload:result})
})


// ─── RUTA: /operacion-compleja2 ────────────────────────────────────────────────
// ✅  ENFOQUE NO BLOQUEANTE con child_process.fork()
// En lugar de ejecutar el cálculo en el hilo principal, creamos un proceso hijo
// separado que corre en su propio hilo. Así el servidor sigue respondiendo
// otras requests mientras el hijo trabaja.
app.get("/operacion-compleja2",(req,res)=>{

    // fork() lanza un nuevo proceso Node.js ejecutando el archivo indicado
    const child = fork("./src/utils/operacionCompleja.js")

    // Le enviamos un mensaje al proceso hijo para que inicie el cálculo
    // El hijo escucha esto con process.on("message", ...)
    child.send("Iniciar calculo")

    // Cuando el hijo termina, nos envía el resultado con process.send()
    // Aquí lo recibimos y respondemos al cliente
    child.on("message",result => {
        console.log("hola")
        res.json({payload:result})
    })
})


// ─── RUTA: /saludo ─────────────────────────────────────────────────────────────
// Ruta simple de prueba para verificar que el servidor está activo.
// También sirve para demostrar que /operacion-compleja BLOQUEA esta ruta,
// mientras que /operacion-compleja2 NO la bloquea.
app.get("/saludo",(req,res)=>{
    res.json({payload:"Hola"})
})


// ─── RUTA: /faker-users/:quantity ──────────────────────────────────────────────
// Genera una lista de usuarios ficticios usando la librería Faker.
// :quantity es un parámetro dinámico de la URL (ej: /faker-users/10)
app.get("/faker-users/:quantity",(req,res)=>{

    // Convertimos el parámetro de string a número
    const quantity = Number(req.params.quantity) 

    // Validación: si quantity es 0, NaN o no fue enviado, cortamos la ejecución
    if(!quantity){
        res.json({message:"quantity required"})
    }

    const users = []

    // Generamos tantos usuarios ficticios como indique quantity
    for(let i = 0; i<quantity;i++){
        const user = {
            _id:faker.database.mongodbObjectId(),  // ID de MongoDB falso
            email:faker.internet.email(),           // Email aleatorio
            firstName:faker.person.firstName(),     // Nombre
            lastName:faker.person.lastName(),       // Apellido
            age:faker.date.birthdate(),             // Fecha de nacimiento
            job:faker.person.jobTitle(),            // Título del trabajo
            sex:faker.person.sex()                  // Género
        }
        users.push(user)
    }

    res.json({payload:users})
})


// ─── INICIO DEL SERVIDOR ───────────────────────────────────────────────────────
// El servidor empieza a escuchar en el puerto definido en las variables de entorno
app.listen(environmentVariables.PORT,() => console.log("server in port: " + environmentVariables.PORT))
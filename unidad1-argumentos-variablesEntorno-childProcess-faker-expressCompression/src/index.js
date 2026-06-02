// Importamos las opciones de argumentos de línea de comandos (ej: --mode=cluster)
import { argumentsOptions } from "./config/argument.config.js";

// Importamos las variables de entorno (ej: PORT) desde un archivo de configuración centralizado
import { environmentVariables } from "./config/environmenVariable.config.js"

// Express es el framework web que nos permite crear el servidor HTTP y definir rutas
import express from "express"

// express-compression es un middleware que comprime las respuestas HTTP automáticamente.
// Soporta gzip, deflate y Brotli. Reducir el tamaño de las respuestas mejora
// la velocidad de transferencia, especialmente en conexiones lentas.
import compression from "express-compression";

// fork() nos permite crear procesos hijos independientes para tareas pesadas
// sin bloquear el proceso principal (el servidor)
import { fork } from "child_process";

// faker es una librería para generar datos falsos/ficticios (nombres, emails, etc.)
import { faker } from "@faker-js/faker";

// path es un módulo nativo de Node.js para trabajar con rutas y extensiones de archivos
// Lo usamos para extraer la extensión de la URL y decidir si comprimir o no
import path from "path";

// Creamos la instancia principal de la aplicación Express
const app = express()

// Middleware que permite que Express entienda el cuerpo de las requests en formato JSON
app.use(express.json())


// ─── MIDDLEWARE DE COMPRESIÓN ──────────────────────────────────────────────────
// Comprime automáticamente todas las respuestas que pasen el filtro.
// Esto reduce el tamaño del payload que viaja por la red, mejorando
// la performance percibida por el cliente.
app.use(compression({

    // Solo comprime respuestas que superen 1KB.
    // Comprimir respuestas muy pequeñas no vale la pena: el overhead
    // del algoritmo puede hacer la respuesta más pesada, no más liviana.
    threshold: 1024,

    // Activa el algoritmo Brotli como método de compresión.
    // Brotli produce archivos más pequeños que gzip, especialmente en texto y JSON,
    // pero requiere que el cliente soporte el header: Accept-Encoding: br
    brotli: { enabled: true },

    // filter decide por cada request si aplicar compresión o no.
    // Recibe (req, res) y debe devolver true (comprimir) o false (no comprimir).
    filter: (req, res) => {

        // Extraemos la extensión del archivo pedido en la URL
        // Ej: /imagen.jpg → ".jpg" | /api/users → ""
        const ext = path.extname(req.path).toLowerCase()

        // Archivos multimedia: ya vienen comprimidos de origen (codecs propios).
        // Volver a comprimirlos solo consume CPU sin reducir el tamaño,
        // y puede incluso aumentarlo levemente.
        const notCompression = [".jpg", ".jpeg", ".png", ".mp4"]
        if(notCompression.includes(ext)) return false

        // Para el resto, delegamos al filtro por defecto de compression.
        // Esto respeta headers como Cache-Control: no-transform que
        // indican explícitamente que la respuesta no debe ser modificada.
        return compression.filter(req, res)
    }
}))


// ─── FUNCIÓN BLOQUEANTE ────────────────────────────────────────────────────────
// Esta función simula una operación costosa en CPU (5 mil millones de iteraciones).
// Mientras se ejecuta, BLOQUEA el hilo principal de Node.js:
// ninguna otra request puede ser procesada hasta que termine.
function operacionCompleja(){
    let result = 0
    for(let i = 0; i < 5e9; i++){
        result += i
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
    child.on("message", result => {
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
    for(let i = 0; i < quantity; i++){
        const user = {
            _id: faker.database.mongodbObjectId(),  // ID de MongoDB falso
            email: faker.internet.email(),           // Email aleatorio
            firstName: faker.person.firstName(),     // Nombre
            lastName: faker.person.lastName(),       // Apellido
            age: faker.date.birthdate(),             // Fecha de nacimiento
            job: faker.person.jobTitle(),            // Título del trabajo
            sex: faker.person.sex()                  // Género
        }
        users.push(user)
    }

    res.json({payload:users})
})


// ─── RUTA: /json-grande ────────────────────────────────────────────────────────
// Genera un string enorme para demostrar dos cosas:
// 1. Cómo se comporta el servidor con respuestas muy pesadas
// 2. Cómo la compresión Brotli reduce drásticamente el tamaño en la red
//
// Podés comparar el tamaño real de la respuesta en las DevTools del navegador:
// Network → /json-grande → Headers → Content-Length (sin comprimir)
//                                  → Content-Encoding: br (comprimido)
app.get("/json-grande",(req,res)=>{
    let string = "Hola coders, soy un string ridiculamente largo"

    // 10e5 = 1.000.000 iteraciones: suficiente para generar un payload
    // pesado sin agotar la RAM ni tirar un RangeError
    for(let i = 0; i < 10e5; i++){
        string = string + "Hola coders, soy un string ridiculamente largo"
    }
    res.json({payload:string})
})


// ─── RUTA: /json-chico ─────────────────────────────────────────────────────────
// Contraparte de /json-grande para comparar el efecto de la compresión.
// Al pesar menos de 1KB no supera el threshold, por lo que compression
// la deja pasar sin comprimir: no tiene sentido el overhead del algoritmo.
app.get("/json-chico",(req,res)=>{
    let string = "Hola coders, soy un string ridiculamente largo"
    res.json({payload:string})
})


// ─── INICIO DEL SERVIDOR ───────────────────────────────────────────────────────
// El servidor empieza a escuchar en el puerto definido en las variables de entorno
app.listen(environmentVariables.PORT, () => console.log("server in port: " + environmentVariables.PORT))
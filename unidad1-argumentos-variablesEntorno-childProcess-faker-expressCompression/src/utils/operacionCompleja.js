// ─── FUNCIÓN BLOQUEANTE (proceso hijo) ────────────────────────────────────────
// Esta es la misma operación costosa del archivo principal.
// La diferencia clave es que aquí corre en un PROCESO HIJO separado,
// por lo que no bloquea el hilo principal del servidor Express.
function operacionCompleja(){
    let result = 0
    for(let i = 0; i < 5e9; i++){  // 5e9 = 5.000.000.000 iteraciones
        result += i
    }
    return result
}


// ─── COMUNICACIÓN CON EL PROCESO PADRE ────────────────────────────────────────
// process.on("message") escucha los mensajes que el proceso PADRE le envía
// con child.send() desde el archivo principal.
// Cuando el padre dice "Iniciar calculo", este proceso se activa.
process.on("message", message => {

    // Ejecutamos la operación pesada (aquí SÍ puede bloquear, pero solo
    // afecta a este proceso hijo, no al servidor principal)
    const result = operacionCompleja()

    // Una vez terminado el cálculo, enviamos el resultado de vuelta al padre
    // El padre lo recibe con child.on("message", result => {...})
    process.send(result)
})
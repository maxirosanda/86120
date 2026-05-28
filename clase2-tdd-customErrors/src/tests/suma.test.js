import { suma } from "../utils/suma.util.js"


const metrics = {
    totalTests:5,
    past:0

}

const todosLosPametrosTieneQueSerNumeros = () => {
    console.log("la funcion suma debe devolver el string error si los parametros no son numeros")
    const result = suma(12,"s")
    if(result === "error"){
        metrics.past = metrics.past + 1
        return "ok"
    }
    return "failed"
}

const minimoDosParametros = () => {
    console.log("Test: minimo dos parametros para hacer la suma")
    const result = suma(1)
    if(result === "error parameter"){
        metrics.past = metrics.past + 1
        return "ok"
    }
    return "failed"
}


const sumarElNumeroDosyCuatro = () => {
   console.log("Sumar: dos y cuatro")
   const result = suma(2,4)
   if(result === 6){
    metrics.past = metrics.past + 1
    return "ok"
   }
   return "failed"
}

const sumarCincoySeis = () => {
    console.log("Test: Sumar cinco y seis")
    const result = suma(5,6)
    if(result === 11){
    metrics.past = metrics.past + 1
    return "ok"
   }
   return "failed"
}

const sumarOchoySieteyDiez = () => {
    console.log("sumar ocho, siete y diez")
    const result = suma(8,7,10)
    if(result === 25){
    metrics.past = metrics.past + 1
    return "ok"
   }
   return "failed"
}

console.log(minimoDosParametros())
console.log(todosLosPametrosTieneQueSerNumeros())
console.log(sumarElNumeroDosyCuatro())
console.log(sumarCincoySeis())
console.log(sumarOchoySieteyDiez())
console.log("Tests totales: " + metrics.totalTests)
console.log("Tests pasados: " + metrics.past)
console.log(metrics.totalTests === metrics.past ? "todos los test fueron pasados":"error en los test")
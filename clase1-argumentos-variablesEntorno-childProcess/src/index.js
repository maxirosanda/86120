
import { argumentsOptions } from "./config/argument.config.js";
import { environmentVariables } from "./config/environmenVariable.config.js"
import express from "express"
import { fork } from "child_process";

const app = express()


app.use(express.json())

function operacionCompleja(){
    let result = 0
    for(let i =0; i<5e9;i++){
        result+=i
    }
    return result
}

app.get("/operacion-compleja",(req,res)=>{
    const result = operacionCompleja()
    res.json({payload:result})
})

app.get("/operacion-compleja2",(req,res)=>{
    const child = fork("./src/utils/operacionCompleja.js")
    child.send("Iniciar calculo")
    child.on("message",result => {
        console.log("hola")
        res.json({payload:result})
    })
})

app.get("/saludo",(req,res)=>{
    res.json({payload:"Hola"})
})


app.listen(environmentVariables.PORT,() => console.log("server in port: " + environmentVariables.PORT))

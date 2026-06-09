import express from "express"
import cluster from "cluster"
import { cpus } from "os"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(express.json())

app.get("/",(req,res)=>{
    res.json({status:"success"})
})

if(cluster.isPrimary){
    console.log("Primary pid: " + process.pid)
    const cpusQuantity = cpus().length
    for(let i = 1; i < cpusQuantity; i++){
        cluster.fork()
    }
    cluster.on("exit",worker => {
        console.log("Exit worker pid: " + worker.pid)
        cluster.fork()
    })
} else {
    app.listen(process.env.PORT,()=> console.log("server in port: " + process.env.PORT + " Worker pid: " + process.pid))
}


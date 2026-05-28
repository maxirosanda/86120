import express from "express"
import { createError, EErrors, generateUserErrorCause } from "./utils/createError.util.js"
import { errorHandler } from "./middlewares/errors.middlewares.js"

const app = express()

app.use(express.json())

app.get("/api/users",(req,res)=>{
    const user = {
        email:"fdsdfsd",
        firstName:"dsfsf",
        lastName:"fsdfsd"
    }
    createError({
        name:"error get users",
        cause:generateUserErrorCause(user),
        message:"error al traer el usuario",
        code:EErrors.DATABASE_ERROR
    })
})
app.use(errorHandler)
app.listen(8080,()=> console.log("server in port: " + 8080))
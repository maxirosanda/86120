import {createLogger,transports,format,addColors} from "winston";
import dotenv from "dotenv"

dotenv.config()

const levels = {
    error:0,
    warn:1,
    info:2,
    http:3
}

const colors = {
    error:"red",
    warn:"yellow",
    info:"green",
    http:"blue"
}

addColors(colors)

const loggerDev = createLogger({
    levels,
    format: format.combine(
        format.colorize({all:true}),
        format.timestamp({format:"YYYY-MM-DD HH:mm:ss"}),
        format.printf(({timestamp,level,message})=>{
            return `${timestamp} ${level} ${message}`
        })
    ),
    transports:[
        new transports.Console()
    ]
})

const loggerProd = createLogger({
    level:"warn",
    levels,
    format: format.combine(
        format.timestamp({format:"YYYY-MM-DD HH:mm:ss"}),
        format.printf(({timestamp,level,message})=>{
            return `${timestamp} ${level} ${message}`
        })
    ),
    transports:[
        new transports.File({filename:"logs/errores.log"})
    ]
})


export const logger = process.env.NODE_ENV === "prod" ? loggerProd : loggerDev
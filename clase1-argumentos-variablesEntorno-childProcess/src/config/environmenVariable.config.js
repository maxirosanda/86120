import dotenv from "dotenv"
import { argumentsOptions } from "./argument.config.js"

dotenv.config({
    path:argumentsOptions.mode==="prod"?".env":".env.dev"
})

export const environmentVariables = process.env
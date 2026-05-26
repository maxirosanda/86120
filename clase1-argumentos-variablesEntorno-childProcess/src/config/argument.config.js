import { Command } from "commander"

const program = new Command()

program
        .option("-p --port <port>","",8080)
        .option("-u --user <user>","","maxirosanda")
        .option("-m --mode <mode>","","dev")



program.parse()

export const argumentsOptions = program.opts()

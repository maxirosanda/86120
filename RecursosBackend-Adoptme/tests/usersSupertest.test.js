import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()
mongoose.connect(process.env.MONGO)

const requester = supertest("http://localhost:8080")
const user = {
    email:"maxi_rosanda7@hotmail.com",
    password:"123456"
}

const cookie = {
    name:"",
    value:""
}

describe("Test de enpoints de users y sessions",()=>{

    before(async()=>{
            await mongoose.connection.collection("users").deleteMany({})
    })

    it("registrar un usuario",async ()=>{
         const userRegister = {
                first_name:"dfsfasf",
                last_name:"dsfasfasf",
                email:user.email,
                password:user.password
        }
        const response = await requester.post("/api/sessions/register").send(userRegister)
        expect(response._body).to.have.property("status","success")
        const responseTwo = await requester.get("/api/users").send(response._body.payload)
        expect(responseTwo._body).to.have.property("status","success")
    })

    it("Login de el usuario",async ()=> {
        const response = await requester.post("/api/sessions/login").send(user)
        cookie.name = response.headers["set-cookie"][0].split("=")[0]
        cookie.value = response.headers["set-cookie"][0].split("=")[1]
        expect(cookie).to.have.property("name","coderCookie")
    })

    it("Probar permirsos",async ()=>{
        const response = await requester.get("/api/sessions/current").set("Cookie",[`${cookie.name}=${cookie.value}`])
        expect(response._body.payload).to.have.property("email",user.email)
    })
})
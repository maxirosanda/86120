import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()
mongoose.connect(process.env.MONGO)

const requester = supertest("http://localhost:8080")

describe("Test de enpoints de users y sessions",()=>{

    before(async()=>{
            await mongoose.connection.collection("users").deleteMany({})
    })

    it("registrar un usuario",async ()=>{
         const user = {
                first_name:"dfsfasf",
                last_name:"dsfasfasf",
                email:"maxi_rosanda7@hotmail.com",
                password:"123456"
        }
        const response = await requester.post("/api/sessions/register").send(user)
        expect(response._body).to.have.property("status","success")
        const responseTwo = await requester.get("/api/users").send(response._body.payload)
        expect(responseTwo._body).to.have.property("status","success")
    })
})
import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()
mongoose.connect(process.env.MONGO)

const requester = supertest("http://localhost:8080")

describe("Tests para Pets",()=>{

    before(async()=>{
                await mongoose.connection.collection("Pets").deleteMany({})
    })

    it("crear pets con imagen",async ()=>{
        const pet = {
            name:"Pitu",
            specie:"Perro",
            birthDate:"10-10-2022"
        }
        const response = await requester.post("/api/pets/withimage")
        .field("name",pet.name)
        .field("specie",pet.specie)
        .field("birthDate",pet.birthDate)
        .attach("image","./tests/images/image.jpg")
        
        expect(response._body).to.have.property("status","success")
        expect(response._body.payload).to.have.property("image")
    })

})
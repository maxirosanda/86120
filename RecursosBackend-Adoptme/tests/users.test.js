import { expect } from "chai";
import mongoose from "mongoose";
import dotenv from "dotenv"
import Users from "../src/dao/Users.dao.js";


dotenv.config()
mongoose.connect(process.env.MONGO)
const UserDao = new Users()
const userTest = {
    _id:""
}


describe("Testing DAO de users",()=>{

    before(async()=>{
        await mongoose.connection.collection("users").deleteMany({})
    })

    it("Crear un usuario completo",async()=>{
            const user = {
                first_name:"dfsfasf",
                last_name:"dsfasfasf",
                email:"maxi_rosanda6@hotmail.com",
                password:"123456"
            }
            const userCreated = await UserDao.save(user)
            expect(userCreated).to.have.property("_id")
            userTest._id = userCreated._id
    })

    it("Eliminar un usuario",async () =>{
        const userDeleted = await UserDao.delete(userTest._id)
         expect(userDeleted).to.have.property("_id")
         expect(userDeleted._id.toString()).to.equal(userTest._id.toString())
    })

})



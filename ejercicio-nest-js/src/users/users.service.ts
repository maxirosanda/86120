import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/createUser.dto";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel:Model<UserDocument>){}
    create(createUserDto:CreateUserDto){
        return
    }

    findByEmail(email:string){
        return
    }
    findById(id:string){
        return
    }
}
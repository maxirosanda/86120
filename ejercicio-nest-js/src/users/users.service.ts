import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
    async findByEmail(email:string){
        const user = await this.userModel.findOne({email});
        if(!user){
            return null;
        }
        return user
    }

    async create(registerDto:RegisterDto){
        const newUser = new this.userModel(registerDto);
        return await newUser.save();
    }
}

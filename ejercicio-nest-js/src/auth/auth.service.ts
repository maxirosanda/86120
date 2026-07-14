import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService:UsersService,
    private jwtService:JwtService
  ) {}      
  async register(registerDto:RegisterDto){
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if(existingUser){
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = await this.usersService.create({ ...registerDto, password: hashedPassword });
    return this.jwtService.sign({ email: newUser.email, sub: newUser._id });
  }

    async login(loginDto:LoginDto){
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if(!user){
            throw new Error('Invalid credentials');
        }
        const userExists = await this.usersService.findByEmail(loginDto.email);
        const validatePassword = await bcrypt.compare(loginDto.password, userExists?.password || '');
        if(!userExists || !validatePassword){
            throw new Error('Invalid credentials');
        }
        return this.jwtService.sign({ email: user.email, sub: user._id });
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        
        return user;
    }
}

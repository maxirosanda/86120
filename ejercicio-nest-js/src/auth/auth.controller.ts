import { Controller, Post, Get, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import type { Response } from 'express';
import { LoginDto } from './dto/login.dto';



@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto:RegisterDto,@Res({passthrough:true}) res:Response){
    const result = await this.authService.register(registerDto);
    res.cookie('access_token', result, {httpOnly:true});
    return {status:"success",payload:result}
  }

  @Post("login")
  async login(@Body() loginDto:LoginDto,@Res({passthrough:true}) res:Response){
    const result = await this.authService.login(loginDto);
    res.cookie('access_token', result, {httpOnly:true});
    return {status:"success",payload:result}
  }

  @Get("profile")
  profile(){

  }

  @Get("logout")
  logout(@Res({passthrough:true}) res:Response){
    res.clearCookie('access_token');
    return {status:"success",message:"logged out"}
  }


}

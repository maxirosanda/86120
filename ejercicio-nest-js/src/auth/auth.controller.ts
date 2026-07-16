import { Controller, Post, Get, Body, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import type { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './decorators/roles.decorator';
import { RoleGuard } from './guards/roles.guard';



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

  @UseGuards(AuthGuard("jwt"),RoleGuard)
  @Roles("user")
  @Get("profile")
  profile(){
    return {status:"success"}
  }

  @Get("logout")
  logout(@Res({passthrough:true}) res:Response){
    res.clearCookie('access_token');
    return {status:"success",message:"logged out"}
  }


}

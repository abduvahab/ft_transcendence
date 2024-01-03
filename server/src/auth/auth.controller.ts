import {  
    Controller, 
    Get,
    UseGuards,
    Req,
    Res,
    UnauthorizedException,
    Request,
    Post,
    UsePipes,
    ValidationPipe,
  
  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { fortyTwoAuthGuard } from './guards/fortyTwo-auth.guard';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt_auth.guard';
import { PasswordAuthGuard } from './guards/pass_local.guard';
import { ConfigService } from '@nestjs/config';


@Controller('auth')
export class AuthController {
constructor(
          private readonly authService: AuthService,
          private readonly jwt:JwtService, 
          private readonly config:ConfigService
  ) {}

@Post('user')
@UseGuards(PasswordAuthGuard)
login_user(@Request() req){
  if(req.user){
    const token = this.jwt.sign({id:req.user.id,username:req.user.username})
    return({
      id:req.user.id,
      username:req.user.username,
      twoFAenabled:req.user.twoFAenabled,
      token:token
    })
  }
  throw new UnauthorizedException('username or password not exist!')
}


@Get('/42')
@UseGuards(fortyTwoAuthGuard)
login(){ }


@Get('/callback')
@UseGuards(fortyTwoAuthGuard)
async callBack_42(@Req() req, @Res() res:Response){
  try{
    if(!req.user)
      throw new UnauthorizedException();
    const acce_token = this.jwt.sign({id:req.user.id,username:req.user.username})
    res.cookie('token',acce_token)
    res.cookie('twoFa','off')
    if(req.user.twoFAenabled)
    {
      //if twoFAenable , go to check
        res.cookie('twoFa','on')
    }
    res.redirect(this.config.get('C_URL')+"/login");
    // res.redirect('http://localhost:5173/login');
  }
  catch{
    throw new UnauthorizedException();
  }
}

@Get('/profile')
@UseGuards(JwtAuthGuard)
async getProfile(@Request() req){
  return await this.authService.get_profile(req.user)
}

@Get('/twoFa')
@UseGuards(JwtAuthGuard)
async sendFaCode(@Request() req){
  return await this.authService.get_profile(req.user)
}



}
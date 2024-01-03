import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IUser_42, jw_user } from './types/types';
import { UserService } from 'src/user/user.service';
import { NotFoundError } from 'rxjs';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
              private readonly userService:UserService,
              private readonly jwt:JwtService
            ){}
 
  async validate_42_User(profile:IUser_42): Promise<any> {
    let user = await this.userService.findByUsername(profile.username)
    if(!user){
      user = await this.userService.create_42(profile)
    }
      return user;
  }

  async valide_password(username:string, password:string):Promise<any>{
    const exitUser = await this.userService.findByUsername(username);
    if(exitUser){
      const pass_match = await argon.verify(exitUser.password,password)
      if(pass_match)
      {
        return exitUser
      }
    }
    throw new UnauthorizedException('username or password not exist!')

  }

  async get_profile(j_user:jw_user): Promise<any> {
    const user = await this.userService.findByUsername(j_user.username)
    if(!user){
      throw new NotFoundException
    }
    return user;
      // return {
      //   id:user.id,
      //   username:user.username,
      //   name:user.name,
      //   email:user.email,
      //   onLine:user.onLine,
      //   inGame:user.inGame,
      //   avatar:user.avatar,
      //   twoFAenabled:user.twoFAenabled,
      //   createAt:user.createAt
      // };
  }
  // http://localhost:3000/auth/42

  async sendFaCode(j_user:jw_user): Promise<any>{
    const user = await this.userService.findByUsername(j_user.username)
    if(!user){
      throw new NotFoundException
    }
    
  }
  
}
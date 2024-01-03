import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from "../auth.service";



@Injectable()
export class PasswordStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService:AuthService){
        super()
    }

    async validate(username:string, password:string){
        const user = await this.authService.valide_password(username,password)
        if(!user)
            throw new UnauthorizedException('username or password not exist!')
        return user;
    }
}
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';
import { IUser_42 } from '../types/types';


@Injectable()
export class fortyTwoStrategy extends PassportStrategy(Strategy,'42'){
    constructor(private readonly config:ConfigService,
                private readonly authService:AuthService
                
        ){
        super({
            clientID: config.get('F_UID'),
            clientSecret: config.get('F_SECRET'),
            callbackURL: config.get('F_CALLBACK'),
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        try{
            const payload =await this.authService.validate_42_User({
                username:profile.username,
                name:profile.displayName,
                email:profile._json.email,
                avatar:profile._json.image.link,
            });
            return payload;
        }
        catch{
            throw new UnauthorizedException();
        }

    }



}
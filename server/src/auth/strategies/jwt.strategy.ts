import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jw_user } from "../types/types";
import { Injectable } from "@nestjs/common";



@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy){
    constructor(readonly config:ConfigService){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('T_SECRET'),
        });
    }

    async validate(user:jw_user){

        return  {id:user.id,username:user.username};
    
    }
}
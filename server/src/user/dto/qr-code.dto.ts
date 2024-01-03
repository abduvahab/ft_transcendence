import {IsNumber, IsNumberString, IsString} from 'class-validator';

export class QRCodeDto{

 
    @IsNumberString()
    readonly twoFAsecret:string
}
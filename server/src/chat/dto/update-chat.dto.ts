import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString } from 'class-validator';


export class UpdatePrivateChatDto {

    @IsNumber()
    chat:number

    @IsNumber()
    sender:number
    
    @IsString()
    text:string
}
export class UpdateChatDto {

    @IsNumber()
    chat:number

    @IsNumber()
    sender:number
    
    @IsString()
    text:string
}

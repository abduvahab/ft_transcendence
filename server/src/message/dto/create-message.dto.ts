import { IsNumber, IsString } from "class-validator"


export class CreatePrivateMessageDto {

    @IsNumber()
    sender:number

    @IsNumber()
    chat:number

    @IsString()
    text:string
}
export class CreateMessageDto {

    @IsNumber()
    sender:number

    @IsNumber()
    chat:number

    @IsString()
    text:string
}

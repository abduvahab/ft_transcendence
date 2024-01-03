import { IsEmail, IsNotEmpty, MinLength, } from "class-validator"



export class CreateUserDto {
    
    @IsNotEmpty()
    username:string;

    @IsNotEmpty()
    name:string

    @IsEmail()
    email:string

    @MinLength(2,{message:"pass word less than 2 character"})
    password:string

    avatar?:string
}

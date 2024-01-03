import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto  {


    @IsNotEmpty()
    name:string

    @IsEmail()
    email:string

    @IsOptional()
    avatar?:string

    // @IsBoolean()
    twoFAenabled:any
}

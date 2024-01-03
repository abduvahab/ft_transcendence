import { IsNotEmpty, IsNumber, IsObject } from "class-validator";
import { User } from "src/user/entities/user.entity";


export class CreateUserBlockDto {


    // @IsNotEmpty()
    // blocking_user:number


    @IsNotEmpty()
    blocked_user:number

}

import { IsNotEmpty } from "class-validator"
import { User } from "src/user/entities/user.entity"


export class CreateFriendDto {

    // @IsNotEmpty()
    // first_user:number

    @IsNotEmpty()
    second_user:number
}

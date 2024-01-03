import { PartialType } from '@nestjs/mapped-types';
import { CreateFriendDto } from './create-friend.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFriendDto extends PartialType(CreateFriendDto) {

    //id for the friend entity 
    @IsNotEmpty()
    id:number

    @IsString()
    status:"rejected" | "accepted"
}

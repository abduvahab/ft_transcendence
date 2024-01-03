import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserBlockDto } from './dto/create-user-block.dto';
import { UpdateUserBlockDto } from './dto/update-user-block.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBlock } from './entities/user-block.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserBlockService {
  constructor(
            @InjectRepository(UserBlock) private readonly userBlock:Repository<UserBlock>
  ){}


  async create(id:number,createUserBlockDto: CreateUserBlockDto) {
    // console.log(createUserBlockDto)
    const one = await this.findOneBlocked(id, createUserBlockDto.blocked_user)
    if (one)
      throw new BadRequestException("you have already blocked this user")
    return await this.userBlock.save({blocking_user:{id:id}, blocked_user:{id:createUserBlockDto.blocked_user}});
  }


  async findAllBlocked(id: number) {
    return await this.userBlock.find({
      where:{
        blocking_user:{id:id}
      },
      relations:['blocking_user','blocked_user']
    });
  }
  
  async findOneBlocked(id: number, blocked_id:number) {
    return await this.userBlock.findOne({
      where:{
        blocking_user:{id:id},
        blocked_user:{id:blocked_id}
      },
      relations:['blocking_user','blocked_user']
    });
  }

  async remove(id: number, blocked_id:number) {
    const one = await this.findOneBlocked(id, blocked_id)
    if(!one)
      throw new BadRequestException('blocked user no exist!')
    try{
      await this.userBlock.delete(one.id);
      return { success: true, message: 'User block removed successfully' };
    }catch(error){
      throw new InternalServerErrorException('Failed to remove user block');
    }
  }

}

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend) private readonly friend:Repository<Friend>
  ){}


  async create(id:number, createFriendDto: CreateFriendDto) {
    if(id === +createFriendDto.second_user)
      throw new BadRequestException("you can't add yourelf as friend")
    const one = await this.findOneByIds(id,createFriendDto.second_user);
    if(one)
      throw new BadRequestException("you already have the user as friend")
    return await this.friend.save({first_user:{id},second_user:{id:createFriendDto.second_user},status:"pending"});
  }


  async findAll(id: number) {
    const user1:Friend[] = await this.friend.find({
      where:{
        first_user:{id:id},
        status:"accepted"
      },
      relations:['first_user','second_user']
    })
    const user2:Friend[] = await this.friend.find({
      where:{
        second_user:{id:id},
        status:"accepted"
      },
      relations:['first_user','second_user']
    })

    return [...user1, ...user2];
  }

  async findAllRequest(id: number) {

    const user2:Friend[] = await this.friend.find({
      where:{
        second_user:{id:id},
        status:"pending"
      },
      relations:['first_user','second_user']
    })

    return user2;
  }


  async findOneByIds(id1: number, id2:number) {
    let user = await this.friend.findOne({
      where:{
        first_user:{id:id1},
        second_user:{id:id2},
        status:"accepted"
      },
      relations:['first_user','second_user']
    })
    if (user)
      return user
    user = await this.friend.findOne({
      where:{
        first_user:{id:id2},
        second_user:{id:id1},
        status:"accepted"
      },
      relations:['first_user','second_user']
    })
    if (user)
      return user
    return null;
  }


  async findByName(id: number, name:string)
  {
    const user1:Friend[] = await this.friend.find({
      where:{
        first_user:{id:id},
        second_user:{name:name},
        status:"accepted"
      },
      relations:['first_user','second_user']
    })
    const user2:Friend[] = await this.friend.find({
      where:{
        second_user:{id:id},
        first_user:{name:name},
        status:"accepted"
      },
      relations:['first_user','second_user']
    })
    return [...user1, ...user2];
  }

  async findByFriendId(id:number){
    return await this.friend.findOne({
      where:{
        id:id
      },
      relations:['first_user','second_user']
    })
  }


  async update(id: number, updateFriendDto: UpdateFriendDto) {
    const one = await this.findByFriendId(updateFriendDto.id)
    if(!one && (one.first_user.id!=id || one.second_user.id!=id))
      throw new BadRequestException();
     await this.friend.update(one.id, {status:updateFriendDto.status})
     if(updateFriendDto.status === 'accepted')
        return {success:true,message:"you have accepted friend request!"}
    await this.removeFriendId(one.id)
    return {success:true,message:"you have rejected friend request!"}
  }


  async removeByIds(id1: number, id2:number) {
    const  one = await this.findOneByIds(id1, id2)
    if(!one)
      throw new BadRequestException('not fond');
    try{
      await this.friend.delete(one.id)
      return { success: true, message: 'frind removed successfully' };
    }catch(error){
      throw new InternalServerErrorException('Failed to remove user block');
    } 
  }
  
  async removeFriendId(id:number) {
    const  one = await this.findByFriendId(id)
    if(!one)
      throw new BadRequestException('not fond');
    try{
      const re=await this.friend.delete(one.id)
      return { success: true, message: 'you refused friend request' };
    }catch(error){
      throw new InternalServerErrorException('Failed to refuse user ');
    } 
  }

}

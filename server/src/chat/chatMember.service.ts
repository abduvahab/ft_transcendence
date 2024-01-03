import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-chat.dto';
import { } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ChatMemeber } from './entities/chatMember.entity';


@Injectable()
export class ChatMemberService {

  constructor(
      @InjectRepository(ChatMemeber) private readonly member:Repository<ChatMemeber>,
  ){}

  async createMember(Dto:CreateMemberDto){

    const exist = await this.findByChatAndUser(+Dto.chat, +Dto.user)
    if(exist)
        throw new BadRequestException("you are alredy member of this room")
    return await this.member.save({
        user:{id:+Dto.user},
        chat:{id:+Dto.chat},
        isCreator:(Dto.isCreator ? Dto.isCreator : false),
        isAdmin:(Dto.isAdmin ? Dto.isAdmin: false)
    })
  }

  async setAdmin(member_id:number){
    try{
        await this.member.update(member_id,{isAdmin:true})
        return {success:true,message:"you set the user a admin"}
    }catch{
        throw new BadRequestException("failed to set admin")
    }
  }

  async setMute(member_id:number){
    try{
        await this.member.update(member_id,{isMuted:true})
        return {success:true,message:"you set the user muted"}
    }catch{
        throw new BadRequestException("failed to set muted")
    }
  }
  async setUnMute(member_id:number){
    try{
        await this.member.update(member_id,{isMuted:false})
        return {success:true,message:"you set the user unmuted"}
    }catch{
        throw new BadRequestException("failed to set unmuted")
    }
  }
  async setBanned(member_id:number){
    try{
        await this.member.update(member_id,{isBanned:true})
        return {success:true,message:"you banned the user "}
    }catch{
        throw new BadRequestException("failed to ban the user")
    }
  }

  async setUnBanned(member_id:number){
    try{
        await this.member.update(member_id,{isBanned:false})
        return {success:true,message:"you remove restriction from the user "}
    }catch{
        throw new BadRequestException("failed to remove restriction from the user")
    }
  }

  async remove(member_id:number){
    try{
        await this.member.delete(member_id)
        return {success:true,message:"you kick the user"}
    }catch{
        throw new BadRequestException("failed to kick user")
    }
  }

  async findByChatAndUser(chatid:number,userid:number){
    return await this.member.findOne({
        where:{
            user:{id:+userid},
            chat:{id:+chatid}
        },
        relations:["user","chat"]
    })
  }



  async findByUserId(user_id:number){
    return await this.member.find({
        where:{
            user:{id:user_id},
            isBanned:false
        },
        relations:["user","chat","chat.creator"]
    })
  }

  async findByChatId(chatid:number){
    return await this.member.find({
        where:{
          chat:{id:+chatid},
            isBanned:false
        },
        relations:["user","chat"]
    })
  }
  async findAllMemberByChatId(chatid:number){
    return await this.member.find({
        where:{
          chat:{id:+chatid},
        },
        relations:["user","chat"]
    })
  }

  async findByMemberId(member_id:number){
    return await this.member.findOne({
        where:{
            id:member_id
        },
        relations:["user","chat"]
    })
  }



}
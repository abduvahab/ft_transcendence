import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePrivateDto, CreateProtectedDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { In, Repository } from 'typeorm';
import { ChatMemeber } from './entities/chatMember.entity';
import * as argon from 'argon2';
import { PrivateChat } from './entities/privateChat.entity';
import { PrivateMessage } from 'src/message/entities/privateMessage.entity';
import { UserBlockService } from 'src/user-block/user-block.service';
import { UpdatePrivateChatDto } from './dto/update-chat.dto';
import { PrivateMessageService } from 'src/message/privateMessage.service';

@Injectable()
export class PrivateChatService {

  constructor(
      @InjectRepository(PrivateChat) private readonly privateChat:Repository<PrivateChat>,
      private readonly block:UserBlockService,
      private readonly messageService:PrivateMessageService

  ){}


  async create_private_chat(mem1:number,mem2:number){
    const exist=await this.findOneChat(+mem1,+mem2)
    if(exist)
        return {success:true,message:"exist"}
    return await this.privateChat.save({member1:{id:+mem1},member2:{id:+mem2},messages:[]})

  }
//find one private chat by two members ids 
  async findOneChat(memb1:number,memb2:number){
    let one = await this.privateChat.findOne({
        where:{
            member1:{id:memb1},
            member2:{id:memb2}
        },
        relations:["member1","member2","messages","messages.sender","messages.chat"]
    })
    if(one)
        return one;
    one = await this.privateChat.findOne({
        where:{
            member1:{id:memb2},
            member2:{id:memb1}
        },
        relations:["member1","member2","messages","messages.sender","messages.chat"]
    })

    return one
  }
//find one private chat by chat id 
  async findOneChatByChatId(chatId:number){
    return await this.privateChat.findOne({
        where:{
            id:chatId
        },
        relations:["member1","member2","messages","messages.sender","messages.chat"]
    })
  }
  //find all private chat by member id 
  async findAllChatByUserId(userId:number){
    const user1:PrivateChat[]=await this.privateChat.find({
        where:{
            member1:{id:userId}
        },
        relations:["member1","member2"]
    })
    const user2:PrivateChat[]=await this.privateChat.find({
        where:{
            member2:{id:userId}
        },
        relations:["member1","member2"]
    })

    return [...user1,...user2]
  }

  async addMessageToChat(chatId:number,Dto:any){

    let chat = await this.findOneChatByChatId(chatId)
    const one = await this.block.findOneBlocked(chat.member1.id === Dto.sender ? chat.member2.id : chat.member1.id,Dto.sender)
    if(one){
        return {success:true,message:"you have ben blocked"};
    }
    if(!chat)
        throw new BadRequestException("no chat ")
    try{
        const message = await this.messageService.create({sender:Dto.sender,chat:Dto.chat,text:Dto.text})
        chat.messages.push(message)
        await this.privateChat.save(chat)
        return {success:true,message:"you have added a message"}
    }catch{
        throw new BadRequestException("Failed to add message to chat")
    }

  }

}
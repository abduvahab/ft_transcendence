import { BadRequestException, Injectable } from '@nestjs/common';
import {CreateProtectedDto, CreatePublicDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { In, Like, Repository } from 'typeorm';
import * as argon from 'argon2';
import { ChatMemberService } from './chatMember.service';
import { ChatMemeber } from './entities/chatMember.entity';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class ChatService {

  constructor(
      @InjectRepository(Chat) 
      private readonly chat:Repository<Chat>,
      private readonly memberService:ChatMemberService,
      private readonly messageService:MessageService,

  ){}


  async create_protected_chat(id:number,Dto:CreateProtectedDto){
      const one=await this.findOneByName(Dto.name)
      if(one)
        throw new BadRequestException('the roon name already exist')
      let _chat = await this.chat.save({
            type:Dto.type,
            isProtected:true,
            creator:{id:id},
            name:Dto.name,
            password:await argon.hash(Dto.password),
            members:[],
            messages:[],
      })
      const creator:ChatMemeber = await this.memberService.createMember({user:+id,chat:_chat.id,isCreator:true,isAdmin:true})
      _chat.members.push(creator)
      await this.chat.save(_chat)
      return {success:true,message:"you have created a protected room "}
  }

  async create_public_chat(id:number,Dto:CreatePublicDto){
    const one=await this.findOneByName(Dto.name)
    if(one)
      throw new BadRequestException('the roon name already exist')
    let _chat = await this.chat.save({
          type:Dto.type,
          creator:{id:id},
          name:Dto.name,
          members:[],
          messages:[],
    })
    const creator:ChatMemeber = await this.memberService.createMember({user:+id,chat:_chat.id,isCreator:true,isAdmin:true})
    _chat.members.push(creator)
    await this.chat.save(_chat)
    return {success:true,message:"you have created a public room "}
  }

  async changeProtectedToPublic(chatId:number){
    const one = await this.findOneByChatid(chatId)
    if(!one && one.isProtected)
      throw new BadRequestException('the room no exist')
    try{
        await this.chat.update(one.id,{type:"public",password:"",isProtected:false})
        return {success:true,message:"you have setted the room public"}
    }catch{
      throw new BadRequestException('setting to public failed')
    }
  }

  async resetPassWordToProtected(chatId:number, password:string){
    const one = await this.findOneByChatid(chatId)
    if(!one && one.isProtected)
      throw new BadRequestException('the room no exist')
    try{
        await this.chat.update(one.id,{password:await argon.hash(password)})
        return {success:true,message:"you have setted the room new password"}
    }catch{
      throw new BadRequestException('setting to password failed')
    }
  }

  async changePublicToProtected(chatId:number, password:string){
    const one = await this.findOneByChatid(chatId)
    if(!one && !one.isProtected)
      throw new BadRequestException('the room no exist')
    try{
        await this.chat.update(one.id,{password:await argon.hash(password),type:"protected",isProtected:true})
        return {success:true,message:"you have setted the room protected"}
    }catch{
      throw new BadRequestException('setting the room protected failed')
    }

  }


  async addMemberToProtected(chatid:number, userid:number,password:string){
    let member:ChatMemeber = await this.memberService.findByChatAndUser(chatid,userid)
    let one_chat = await this.findOneByChatid(chatid)
    if(!member){
        const isTrue = await argon.verify(one_chat.password,password)
        if(!isTrue)
          throw new BadRequestException("wrong password")
        member = await this.memberService.createMember({user:userid, chat:chatid})
        // one_chat.members.push(member);
        // await this.chat.save(one_chat)
        return {success:true,message:"you become member of the room"}
    }else{
      if(member.isBanned)
        throw new BadRequestException("you have been banned")
      throw new BadRequestException("you have already member of the room")
    }
  }

  async addMemberToPublic(chatid:number, userid:number){
    let member:ChatMemeber = await this.memberService.findByChatAndUser(chatid,userid)
    let one_chat = await this.findOneByChatid(chatid)
    if(!member){
        member = await this.memberService.createMember({user:userid, chat:chatid})
        // one_chat.members.push(member);
        // await this.chat.save(one_chat)
        return {success:true,message:"you become member of the room"}
    }else{
      if(member.isBanned)
        throw new BadRequestException("you have been banned")
      throw new BadRequestException("you have already member of the room")
    }
  }

  async leaveFromRoom(chatid:number, userid:number){
    // try{
        let member_one:ChatMemeber = await this.memberService.findByChatAndUser(chatid,userid)
        if(!member_one)
          throw new BadRequestException("the user is not the member of the room")
        let one_chat = await this.findOneByChatid(chatid)
        const len = one_chat.members.length;
        if(member_one.isCreator ){
          if(one_chat.members.length === 1)
            return await this.deleteRoomByIdAndMemberId(+one_chat.id,+member_one.id)
            // return await this.deleteRoomById(one_chat.id)
          let i = 0;
          while(i < len){
            if(one_chat.members[i].isAdmin && one_chat.members[i].id !== member_one.id)
              break
            i++;
          }
          if(len === i)
            throw new BadRequestException("set other user admin, then you can leave")
        }
        if(member_one.isAdmin)
        {
          if(one_chat.members.length === 1)
            return await this.deleteRoomByIdAndMemberId(+one_chat.id,+member_one.id)
          let j=0;
          while(j < len){
            if(one_chat.members[j].isAdmin && one_chat.members[j].id !== member_one.id)
              break
            j++;
          }
          if(len === j)
            throw new BadRequestException("set other user admin, then you can leave")
        }

        await this.memberService.remove(member_one.id)
        return {success:true,message:"you left from of the room"}

    // }catch{
    //   throw new BadRequestException("failed to leave from group ")
    // }
   
  }

  async deleteRoomByIdAndMemberId(chatid:number,memberId:number){
    try{
      await this.memberService.remove(memberId)
      await this.chat.delete(chatid)
      return {success:true,message:"you delete the chat "}
    }catch(error:any){
      console.error(error);
      throw new BadRequestException("failed to delete the chat")
    }
  }

  async deleteTheRoom(chatid:number, userid:number){
    try{
      let member_one:ChatMemeber = await this.memberService.findByChatAndUser(chatid,userid)
      if(!member_one)
        throw new BadRequestException("the user is not the member of the room")
      let one_chat = await this.findOneByChatid(chatid)
      const len = one_chat.members.length;
      if(member_one.isAdmin)
      {
        return await this.deleteRoomById(one_chat.id)
      }
      throw new BadRequestException("failed to delete the group ")
    }
    catch{
      throw new BadRequestException("failed to delete the group ")
    }

  }

  async deleteRoomById(chatid:number){
    let one_chat = await this.findOneByChatid(chatid)
    if(!one_chat)
      throw new BadRequestException("the chat no exist")
    try{
      await this.chat.delete(chatid)
      return {success:true,message:"you delete the chat "}
    }catch{
      throw new BadRequestException("failed to delete the chat")
    }
  }

  // admin_user_Id :user id , chatId:chatid, memId:chatmember id
  async setAdmin(admin_user_Id:number, chatId:number,memberId:number){
    const admin_one:ChatMemeber = await this.memberService.findByChatAndUser(chatId,admin_user_Id)
    const member_one:ChatMemeber = await this.memberService.findByMemberId(memberId)
    if(!admin_one)
      throw new BadRequestException("you are not the member of the room")
    if(!member_one)
      throw new BadRequestException("the user is not the member of the room")
    if(!admin_one.isCreator)
      throw new BadRequestException("you are not creator")
    if(member_one.isAdmin)
      throw new BadRequestException("the user is already adminstrator in the room")
    return await this.memberService.setAdmin(memberId)
  }

  // admin_user_Id :user id , chatId:chatid, memId:chatmember id
  async setMute(admin_user_Id:number, chatId:number,memberId:number){
    const admin_one:ChatMemeber = await this.memberService.findByChatAndUser(chatId,admin_user_Id)
    const member_one:ChatMemeber = await this.memberService.findByMemberId(memberId)
    if(!admin_one)
      throw new BadRequestException("you are not the member of the room")
    if(!member_one)
      throw new BadRequestException("the user is not the member of the room")
    if(!admin_one.isAdmin)
      throw new BadRequestException("you are not adminstrator in the room")
    if(member_one.isCreator)
      throw new BadRequestException("the user is creator")
    if(member_one.isMuted)
      throw new BadRequestException("the user is already muted")
    return await this.memberService.setMute(memberId)
  }

  // admin_user_Id :user id , chatId:chatid, memId:chatmember id
  async setUnMute(admin_user_Id:number, chatId:number,memberId:number){
    const admin_one:ChatMemeber = await this.memberService.findByChatAndUser(chatId,admin_user_Id)
    const member_one:ChatMemeber = await this.memberService.findByMemberId(memberId)
    if(!admin_one)
      throw new BadRequestException("you are not the member of the room")
    if(!member_one)
      throw new BadRequestException("the user is not the member of the room")
    if(!admin_one.isAdmin)
      throw new BadRequestException("you are not adminstrator in the room")
    if(member_one.isCreator)
      throw new BadRequestException("the user is creator")
    if(!member_one.isMuted)
      throw new BadRequestException("the user is already unMuted")
    return await this.memberService.setUnMute(memberId)
  }
  // admin_user_Id :user id , chatId:chatid, memId:chatmember id
  async setKick(admin_user_Id:number, chatId:number,memberId:number){
    const admin_one:ChatMemeber = await this.memberService.findByChatAndUser(chatId,admin_user_Id)
    const member_one:ChatMemeber = await this.memberService.findByMemberId(memberId)
    if(!admin_one)
      throw new BadRequestException("you are not the member of the room")
    if(!member_one)
      throw new BadRequestException("the user is not the member of the room")
    if(!admin_one.isAdmin)
      throw new BadRequestException("you are not adminstrator in the room")
    if(member_one.isCreator)
      throw new BadRequestException("the user is creator")
    // if(member_one.isMuted)
    //   throw new BadRequestException("the user is already muted")
    return await this.memberService.remove(memberId)
  }


  // admin_user_Id :user id , chatId:chatid, memId:chatmember id
  async setBanned(admin_user_Id:number, chatId:number,memberId:number){
    const admin_one:ChatMemeber = await this.memberService.findByChatAndUser(chatId,admin_user_Id)
    const member_one:ChatMemeber = await this.memberService.findByMemberId(memberId)
    if(!admin_one)
      throw new BadRequestException("you are not the member of the room")
    if(!member_one)
      throw new BadRequestException("the user is not the member of the room")
    if(!admin_one.isAdmin)
      throw new BadRequestException("you are not adminstrator in the room")
    if(member_one.isCreator)
      throw new BadRequestException("the user is creator")
    if(member_one.isBanned)
      throw new BadRequestException("the user is already banned")
    return await this.memberService.setBanned(memberId)
  }

  // admin_user_Id :user id , chatId:chatid, memId:chatmember id
  async setUnBanned(admin_user_Id:number, chatId:number,memberId:number){
    const admin_one:ChatMemeber = await this.memberService.findByChatAndUser(chatId,admin_user_Id)
    const member_one:ChatMemeber = await this.memberService.findByMemberId(memberId)
    if(!admin_one)
      throw new BadRequestException("you are not the member of the room")
    if(!member_one)
      throw new BadRequestException("the user is not the member of the room")
    if(!admin_one.isAdmin)
      throw new BadRequestException("you are not adminstrator in the room")
    if(member_one.isCreator)
      throw new BadRequestException("the user is creator")
    if(!member_one.isBanned)
      throw new BadRequestException("the user is already unbanned")
    return await this.memberService.setUnBanned(memberId)
  }



  async findOneByName(name:string){
        return await this.chat.findOne({
          where:{
            name:name
          },
          relations:['members',"creator","messages","members.user","members.chat"]
        })
  }

  //find by chatid 
  async findOneByChatid(id:number){
        return await this.chat.findOne({
          where:{
            id:id
          }, 
          relations:['members',"creator","messages","members.user","members.chat"]
        })
  }

  // this return all chatMembers[] and there we find the groupchats[]
  async findAllGroupChatByUserId(id:number){
    return await this.memberService.findByUserId(id)
  }
  // this return all chatMembers[] and there we find the groupchats[]
  async getOneChatmember(user_id:number, chatId:number){
    return await this.memberService.findByChatAndUser(chatId,user_id)
  }
  // this return all chatMembers[] and there we find the groupchats[]
  async getAllChatmember(chatId:number){

    const data = await this.memberService.findAllMemberByChatId(chatId)
    // console.log("data",data)
    return data
    // return await this.memberService.findAllMemberByChatId(chatId)
  }

  // this return all chatMembers[] and there we find the groupchats[]
  async findAllGroupChatByName(name:string){
    return await this.chat.find({
      where:{
        name: Like(`%${name}%`),
      }
    })
  }


//find all protected chat where the user exist 
  async findAllProtectedChatInUser(id:number){
    return await this.chat.find({
      where:{
          type:'protected',
          members:In([id])
      },
      relations:['members',"creator","messages","members.user","members.chat"]
    })
  }

//find all protected chat 
  async findAllProtectedChat(){
    return await this.chat.find({
      where:{
          type:'protected',
      },
      relations:['members',"creator","messages","members.user","members.chat"]
    })
  }

//find all protected chat 
  async findAllPublicChat(){
    return await this.chat.find({
      where:{
          type:'public',
      },
      relations:['members',"creator","messages","members.user","members.chat"]
    })
  }

  async addMessageToChat(chatId:number,Dto:UpdateChatDto){

    let chat = await this.findOneByChatid(chatId)
    const mem_chat = await this.memberService.findByChatAndUser(chatId,+Dto.sender)
    if(!chat || !mem_chat )
        throw new BadRequestException("no chat or member")
    if(mem_chat.isMuted){
        return {success:true,message:"you have ben muted"};
    }
    try{
        const message = await this.messageService.create({sender:Dto.sender,chat:Dto.chat,text:Dto.text})
        // chat.messages.push(message)
        // await this.chat.save(chat)
        return {success:true,message:"you have added a message"}
    }catch{
        throw new BadRequestException("Failed to add message to chat")
    }

  }




}

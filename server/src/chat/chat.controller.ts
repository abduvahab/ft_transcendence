import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Query, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateProtectedDto, CreatePublicDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt_auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("protected")
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  async createProtectedChat(@Req() req:any,@Body() Dto:CreateProtectedDto) {
    return await this.chatService.create_protected_chat(+req.user.id,Dto);
  }

  @Post("public")
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  async createPublicdChat(@Req() req:any,@Body() Dto:CreatePublicDto) {
    return await this.chatService.create_public_chat(+req.user.id,Dto);
  }

      // this return all chatMembers[] and there we find the groupchats[]
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllGroupChatByUserId(@Req() req:any){
    return await this.chatService.findAllGroupChatByUserId(+req.user.id)
  }
      // this return all chatMembers[] and there we find the groupchats[]
  @Get("name/:id")
  @UseGuards(JwtAuthGuard)
  async findAllGroupChatByName(@Param('id') id:string){
    return await this.chatService.findAllGroupChatByName(id)
  }
  @Get("member/:chatId")
  @UseGuards(JwtAuthGuard)
  async getOneChatmember(@Req() req:any, @Param('chatId') chatId:string){
    return await this.chatService.getOneChatmember(+req.user.id,+chatId)
  }
  @Get("allMember/:chatId")
  @UseGuards(JwtAuthGuard)
  async getAllChatmember(@Param('chatId') chatId:string){
    return await this.chatService.getAllChatmember(+chatId)
  }

  //id : id of chat
  @Get("setPublic/:id")
  @UseGuards(JwtAuthGuard)
  async changeProtectedToPublic(@Param('id') id:string){
    return await this.chatService.changeProtectedToPublic(+id)
  }

  //id : id of chat
  @Get("setpassword/:id")
  @UseGuards(JwtAuthGuard)
  async resetPassWordToProtected(@Param('id') id:string,@Query("password") password:string){
    return await this.chatService.resetPassWordToProtected(+id, password)
  }

  //id : id of chat
  @Get("setProtected/:id")
  @UseGuards(JwtAuthGuard)
  async changePublicToProtected(@Param('id') id:string,@Query("password") password:string){
    return await this.chatService.changePublicToProtected(+id, password)
  }

    //id:id for user, chatid:for chat
  @Get("addProtected/:chatid")
  @UseGuards(JwtAuthGuard)
  async addMemberToProtected(@Req() req:any,@Param('chatid') chatid:string,@Query("password") password:string){
    return await this.chatService.addMemberToProtected(+chatid,+req.user.id, password)
  }

  //id:id for user ,chatid:for chat
  @Get("addPublic/:chatid")
  @UseGuards(JwtAuthGuard)
  async addMemberToPublic(@Req() req:any,@Param('chatid') chatid:string){
    return await this.chatService.addMemberToPublic(+chatid,+req.user.id)
  }

  //chatid:for chat
  @Get("leave/:chatid")
  @UseGuards(JwtAuthGuard)
  async leaveFromRoom(@Req() req:any,@Param('chatid') chatid:string){
    return await this.chatService.leaveFromRoom(+chatid,+req.user.id)
  }
  
  //chatid:for chat
  @Get("delete/:chatid")
  @UseGuards(JwtAuthGuard)
  async deleteTheRoom(@Req() req:any,@Param('chatid') chatid:string){
    return await this.chatService.deleteTheRoom(+chatid,+req.user.id)
  }

  @Get("setAdmin/:chatid/:memberid")
  @UseGuards(JwtAuthGuard)
  async setAdmin(@Req() req:any,@Param('memberid') memberid:string,@Param('chatid') chatid:string){
    return await this.chatService.setAdmin(+req.user.id,+chatid,+memberid)
  }
  @Get("setMute/:chatid/:memberid")
  @UseGuards(JwtAuthGuard)
  async setMute(@Req() req:any,@Param('memberid') memberid:string,@Param('chatid') chatid:string){
    return await this.chatService.setMute(+req.user.id,+chatid,+memberid)
  }

  @Get("setUnMute/:chatid/:memberid")
  @UseGuards(JwtAuthGuard)
  async setUnMute(@Req() req:any,@Param('memberid') memberid:string,@Param('chatid') chatid:string){
    return await this.chatService.setUnMute(+req.user.id,+chatid,+memberid)
  }

  @Get("kick/:chatid/:memberid")
  @UseGuards(JwtAuthGuard)
  async setKick(@Req() req:any,@Param('memberid') memberid:string,@Param('chatid') chatid:string){
    return await this.chatService.setKick(+req.user.id,+chatid,+memberid)
  }

  @Get("banned/:chatid/:memberid")
  @UseGuards(JwtAuthGuard)
  async setBanned(@Req() req:any,@Param('memberid') memberid:string,@Param('chatid') chatid:string){
    return await this.chatService.setBanned(+req.user.id,+chatid,+memberid)
  }
  @Get("unbanned/:chatid/:memberid")
  @UseGuards(JwtAuthGuard)
  async setUnBanned(@Req() req:any,@Param('memberid') memberid:string,@Param('chatid') chatid:string){
    return await this.chatService.setUnBanned(+req.user.id,+chatid,+memberid)
  }


  @Get("protected")
  async findAllProtected() {
    return await this.chatService.findAllProtectedChat();
  }
  @Get("public")
  async findAllPublic() {
    return await this.chatService.findAllPublicChat();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async addMessageToChat(@Req() req:any,@Body() Dto:UpdateChatDto) {

    return await this.chatService.addMessageToChat(+Dto.chat,Dto)
  }


}

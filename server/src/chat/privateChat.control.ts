import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { CreatePrivateDto } from './dto/create-chat.dto';
import { UpdatePrivateChatDto } from './dto/update-chat.dto';
import { PrivateChatService } from './privateChat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt_auth.guard';
import { PrivateMessageService } from 'src/message/privateMessage.service';

@Controller('privatechat')
export class PrivateChatController {
  constructor(
            private readonly chatService: PrivateChatService,
            private readonly messageService:PrivateMessageService
    ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  async create(@Req() req:any,@Body() createChatDto: CreatePrivateDto) {
    return await this.chatService.create_private_chat(+req.user.id,createChatDto.member2);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllChatByUserId(@Req() req:any) {
    return await this.chatService.findAllChatByUserId(+req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOneChat(@Req() req:any,@Param('id') id: string) {
    return await this.chatService.findOneChat(+req.user.id,+id);
  }

  @Get('chat/:id')
  @UseGuards(JwtAuthGuard)
  async findOneChatByChatId(@Param('id') id: string) {
    return await this.chatService.findOneChatByChatId(+id);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async addMessageToChat(@Req() req:any,@Body() Dto:UpdatePrivateChatDto) {

    return await this.chatService.addMessageToChat(+Dto.chat,Dto)
  }

}
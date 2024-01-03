import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto, CreatePrivateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrivateMessageService } from './privateMessage.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt_auth.guard';

@Controller('privateMessage')
export class PrivateMessageController {
  constructor(
    private readonly messageService: PrivateMessageService,
    ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createMessageDto: CreatePrivateMessageDto) {
    return await this.messageService.create(createMessageDto);
  }
  @Get("chatId/:id")
  @UseGuards(JwtAuthGuard)
  async findAllByChatId(@Param('id') id:string) {
    return await this.messageService.findAllByChatId(+id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllMessageByUserId(@Req() req:any) {
    return await this.messageService.findBySenderId(+req.user.id);
  }
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOneByMessageId(@Req() req:any,@Param('id') id:string) {
    return await this.messageService.findOneByMessageId(+id);
  }

}
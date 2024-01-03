import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt_auth.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createMessageDto: CreateMessageDto) {
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

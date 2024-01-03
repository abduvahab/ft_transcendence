import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateMessage } from './entities/privateMessage.entity';
import { Message } from './entities/message.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { PrivateChat } from 'src/chat/entities/privateChat.entity';
import { PrivateMessageController } from './privateMessage.control';
import { PrivateMessageService } from './privateMessage.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([PrivateMessage,Message,PrivateChat,User])],
  controllers: [MessageController,PrivateMessageController],
  providers: [MessageService, PrivateMessageService],
})
export class MessageModule {}

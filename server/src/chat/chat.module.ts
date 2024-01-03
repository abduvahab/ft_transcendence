import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatMemeber } from './entities/chatMember.entity';
import { User } from 'src/user/entities/user.entity';
import { Message } from 'src/message/entities/message.entity';
import { PrivateChat } from './entities/privateChat.entity';
import { PrivateChatController } from './privateChat.control';
import { PrivateChatService } from './privateChat.service';
import { PrivateMessageService } from 'src/message/privateMessage.service';
import { PrivateMessage } from 'src/message/entities/privateMessage.entity';
import { UserBlockService } from 'src/user-block/user-block.service';
import { UserBlock } from 'src/user-block/entities/user-block.entity';
import { ChatMemberService } from './chatMember.service';
import { MessageService } from 'src/message/message.service';

@Module({
  imports:[TypeOrmModule.forFeature([Chat,ChatMemeber,Message,PrivateChat,PrivateMessage,UserBlock])],
  controllers: [ChatController,PrivateChatController],
  providers: [ChatService,PrivateChatService,PrivateMessageService,UserBlockService,ChatMemberService,MessageService],
})
export class ChatModule {}

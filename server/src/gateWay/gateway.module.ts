import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { ChatMemeber } from 'src/chat/entities/chatMember.entity';
import { ChatMemberService } from 'src/chat/chatMember.service';


@Module({
  imports: [ConfigModule,TypeOrmModule.forFeature([User,Chat,ChatMemeber])],
  controllers: [],
  providers: [GatewayService,ConfigService,UserService,ChatMemberService],
})
export class GatewayModule {}
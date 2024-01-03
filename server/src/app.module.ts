import { Module } from '@nestjs/common';
import { DataModule } from './typeorm/data.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AvatarsModule } from './avatars/avatars.module';
import { FriendModule } from './friend/friend.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { UserBlockModule } from './user-block/user-block.module';
import { GatewayModule } from './gateWay/gateway.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
            DataModule,
            UserModule,
            AuthModule,
            AvatarsModule,
            FriendModule,
            ChatModule,
            MessageModule,
            UserBlockModule,
            GatewayModule,
            GameModule
          
          ],
  controllers: [],
  providers: [],
})
export class AppModule {}

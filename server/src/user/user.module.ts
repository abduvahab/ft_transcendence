import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from 'src/helper/file.service';
import { GameService } from 'src/game/game.service';
import { Game } from 'src/game/entities/game.entity';
import { GameAuthGuard } from 'src/game/jwt/jwt.strategy';
import { GameModule } from 'src/game/game.module';

@Module({
  imports:[
            TypeOrmModule.forFeature([User]),
            JwtModule.registerAsync({
              imports:[ConfigModule],
              useFactory:(config:ConfigService)=> ({
                          
                          secret:config.get('T_SECRET'),
                          signOptions:{expiresIn:'1d'}
                      }),
                inject:[ConfigService]
            }),
          ],
  controllers: [UserController],
  providers: [UserService,FileService],
  exports:[UserService]
})
export class UserModule {}

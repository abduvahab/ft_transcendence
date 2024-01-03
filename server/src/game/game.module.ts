import { Module } from '@nestjs/common';
import { Game } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import GameGateway from './game.gateway';
import { GameService } from './game.service';
import { GameAuthGuard } from "./jwt/jwt.strategy";
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from "../user/user.service";
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { GameController } from './game.control';

@Module({
    imports: [
        TypeOrmModule.forFeature([Game,User]),
        ConfigModule,
		JwtModule,
        UserModule
    ],
    controllers:[GameController],
	providers: [GameGateway, GameService, GameAuthGuard,UserService,ConfigService],
	exports: [GameGateway, GameService]
})

export class GameModule {}

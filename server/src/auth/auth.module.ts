import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { fortyTwoStrategy } from './strategies/fortyTwo.strategy';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtStrategy } from './strategies/jwt.strategy';
import { PasswordStrategy } from './strategies/password.strategy';



@Module({
  imports:[
            UserModule,
            PassportModule,
            JwtModule.registerAsync({
              imports:[ConfigModule],
              useFactory:(config:ConfigService)=> ({
                          
                          secret:config.get('T_SECRET'),
                          signOptions:{expiresIn:'1d'}
                      }),
              inject:[ConfigService]
            }),


          ],
  controllers: [AuthController],
  providers: [AuthService,fortyTwoStrategy, jwtStrategy, PasswordStrategy]
})
export class AuthModule {}
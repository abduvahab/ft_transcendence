import { Module } from '@nestjs/common';
import { UserBlockService } from './user-block.service';
import { UserBlockController } from './user-block.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBlock } from './entities/user-block.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserBlock])],
  controllers: [UserBlockController],
  providers: [UserBlockService],
})
export class UserBlockModule {}

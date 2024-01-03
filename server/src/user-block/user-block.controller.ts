import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { UserBlockService } from './user-block.service';
import { CreateUserBlockDto } from './dto/create-user-block.dto';
import { UpdateUserBlockDto } from './dto/update-user-block.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt_auth.guard';

@Controller('user-block')
export class UserBlockController {
  constructor(private readonly userBlockService: UserBlockService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  async create(@Req() req:any,@Body() createUserBlockDto: CreateUserBlockDto) {
    return await this.userBlockService.create(+req.user.id,createUserBlockDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllBlocked(@Req() req:any) {
    return await this.userBlockService.findAllBlocked(+req.user.id);
  }

  @Get(':blocked_id')
  @UseGuards(JwtAuthGuard)
  async findOneBlocked(@Req() req:any,@Param('blocked_id') blocked_id: string) {
    return await this.userBlockService.findOneBlocked(+req.user.id, +blocked_id);
  }


  @Delete(':blocked_id')
  @UseGuards(JwtAuthGuard)
  async remove(@Req() req:any,@Param('blocked_id') blocked_id: string) {
    return this.userBlockService.remove(+req.user.id, +blocked_id);
  }

}

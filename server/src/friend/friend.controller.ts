import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Req, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt_auth.guard';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  async create(@Req() req:any, @Body() createFriendDto: CreateFriendDto) {
    return await this.friendService.create(+req.user.id, createFriendDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req:any) {
    return this.friendService.findAll(+req.user.id);
  }

  @Get('request')
  @UseGuards(JwtAuthGuard)
  async findAllRequest(@Req() req:any) {
    return this.friendService.findAllRequest(+req.user.id);
  }


  @Get('id/:id2')
  @UseGuards(JwtAuthGuard)
  async findOneByIds(@Req() req:any, @Param('id2') id2: string) {
    return this.friendService.findOneByIds(+req.user.id, +id2);
  }
  @Get('name/:name')
  @UseGuards(JwtAuthGuard)
  async findByName(@Req() req:any, @Param('name') name: string) {
    return this.friendService.findByName(+req.user.id, name);
  }


  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(@Req() req:any, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.update(+req.user.id, updateFriendDto);
  }

  @Delete('id/:id2')
  @UseGuards(JwtAuthGuard)
  async removeByIds(@Req() req:any, @Param('id2') id2: string) {
    return await this.friendService.removeByIds(+req.user.id, +id2);
  }
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async removeFriendId(@Param('id') id: string) {
    return await this.friendService.removeFriendId(+id);
  }
}

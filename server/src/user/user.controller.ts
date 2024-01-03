import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UsePipes, ValidationPipe, UseGuards, Res, BadRequestException, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, ParseFilePipe, MaxFileSizeValidator } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt_auth.guard';
import { AuthorGuard } from 'src/guard/auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as QRCode  from "qrcode";
import { Response } from 'express';
import { QRCodeDto } from './dto/qr-code.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/helper/file.service';

@Controller('user')
export class UserController {
  constructor(
            // @InjectRepository(User) private readonly user:Repository<User>,
              private readonly userService: UserService,
              private readonly fileSer:FileService
            ) {}

  // private activeGames: User[] = [];
  private sanitizeUserState(user: User): User {
    const sanitized = {...user};
    delete sanitized.password;
    delete sanitized.twoFAsecret;
    return sanitized;
  }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create_user(createUserDto);
  }

  @Get('qr')
  @UseGuards(JwtAuthGuard)
  async create_qr(@Req() req,@Res() res:Response) {
      const qrcode=await this.userService.create_qr(req.user);
      if (!qrcode)
        throw new BadRequestException()
      res.send(qrcode)
      return 
  }

  @Post('qr')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  async validate_qr(@Req() req,@Body() qrCode: QRCodeDto) {
    return await this.userService.validate_qr(req.user,qrCode);
  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  async update_info(
                @Req() req,
                @UploadedFile() file: Express.Multer.File, 
                @Body() updateUserDto: UpdateUserDto
              )
  {

    const one = await this.userService.findById(+req.user.id)
    if(one.name !== updateUserDto.name)
    {
      const second = await this.userService.findByname(updateUserDto.name)
      if(second)
      {
        throw new BadRequestException('the nick name already exist')
      }
    }

    let avatar_name:string;
    if(file){
      if(file.size > 1024*1024)
        throw new BadRequestException('image size must samller than 1 MB')
      avatar_name=this.fileSer.storeFile(file,""+req.user.id)
    }
    return await this.userService.update_info(+req.user.id,avatar_name,updateUserDto)
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('user/:id')
  @UseGuards(JwtAuthGuard)
  async findOneId(@Param('id') id: string) {
    return await this.userService.findById(+id);
    // return this.sanitizeUserState(one)
  }
  @Get('name/:name')
  @UseGuards(JwtAuthGuard)
  async findByName(@Param('name') name: string) {
    return await this.userService.findByname(name);
    // return this.sanitizeUserState(one)
  }
  @Get('username/:username')
  @UseGuards(JwtAuthGuard)
  async findByUsername(@Param('username') username: string) {
    return await this.userService.findByUsername(username);
    // return this.sanitizeUserState(one)
  }

  @Patch('user/:id')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }


}

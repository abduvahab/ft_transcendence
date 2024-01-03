import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { Response } from 'express';
import * as fs from "fs"


@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Get(':name')
  async getAvatar(@Param('name') name:string, @Res() res:Response){
    const imagePath = "./upload/"+name;
    if(fs.existsSync(imagePath))
    {
      const fileStream = fs.createReadStream(imagePath);
      fileStream.pipe(res);
    }
    else{
      res.status(404).send('Image not found');
    }
  }

}

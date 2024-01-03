import { Injectable } from '@nestjs/common';
import { CreateMessageDto, CreatePrivateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PrivateMessage } from './entities/privateMessage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PrivateMessageService {
    constructor(
        @InjectRepository(PrivateMessage) private readonly privatemessage:Repository<PrivateMessage>,
  
    ){}
  async create(Dto: CreatePrivateMessageDto) {

    return await this.privatemessage.save({sender:{id:+Dto.sender},chat:{id:+Dto.chat},text:Dto.text});

  }

  async findBySenderId(id:number) {

    return await this.privatemessage.find({
        where:{sender:{id:id}},
        relations:["sender","chat"]
    });
  }
  async findOneByMessageId(id:number) {

    return await this.privatemessage.findOne({
        where:{id:id},
        relations:["sender","chat"]
    });

  }
  async findAllByChatId(id:number) {

    return await this.privatemessage.find({
        where:{
          chat:{id:id}
        },
        relations:["sender","chat"],
        order:{
          createAt:'DESC'
        }
    });

  }








}
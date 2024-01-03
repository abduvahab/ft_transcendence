import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private readonly memessage:Repository<Message>,
  ){}

  async create(Dto: CreateMessageDto) {
  return await this.memessage.save({sender:{id:+Dto.sender},chat:{id:+Dto.chat},text:Dto.text});

  }

  async findBySenderId(id:number) {

    return await this.memessage.find({
        where:{sender:{id:id}},
        relations:["sender","chat"]
    });
  }
  async findOneByMessageId(id:number) {

    return await this.memessage.findOne({
        where:{id:id},
        relations:["sender","chat"]
    });

  }
  async findAllByChatId(id:number) {

    return await this.memessage.find({
        where:{
          chat:{id:id}
        },
        relations:["sender","chat"],
        order:{
          createAt:"DESC"
        }
    });
  }

}

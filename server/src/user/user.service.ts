import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { jw_user } from 'src/auth/types/types';
import { generateNumber, generateQRCode } from 'src/helper/tool';
import { QRCodeDto } from './dto/qr-code.dto';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class UserService {
  constructor(
              @InjectRepository(User) private readonly user:Repository<User>,
              private readonly config:ConfigService,
              ){}

  // private activeGames: User[] = [];
  private sanitizeGameState(user: User): User {
    const sanitized = {...user};
    delete sanitized.password;
    delete sanitized.twoFAsecret;
    return sanitized;
  }
  
  async create(createUserDto: CreateUserDto) {
   const user= await this.user.save({
      username:createUserDto.username,
      name:createUserDto.name,
      email:createUserDto.email,
      avatar:createUserDto.avatar 
    });
    return user;
  }
  async create_42(profile: any) {
   const user= await this.user.save({
      username:profile.username,
      name:profile.name,
      email:profile.email,
      avatar:profile.avatar 
    });
    return user;
  }

  async create_qr(user:jw_user){
    const e_user =await this.findById(user.id)
    if(!e_user)
      throw new BadRequestException()
    const ran_num=""+generateNumber()

    console.log(ran_num)
    const qrCode=await generateQRCode(ran_num)
    if(!qrCode)
      throw new BadRequestException()
    const res = await this.user.update(e_user.id, {twoFAsecret:await argon.hash(ran_num)})
    if(!res)
      throw new BadRequestException()
    return {qr:ran_num}
    return qrCode;
  }

  async validate_qr(user:jw_user,qrCode: QRCodeDto){
    const e_user =await this.findById(user.id)
    if(!e_user)
      throw new BadRequestException()
    const verify = await argon.verify( e_user.twoFAsecret, qrCode.twoFAsecret)
    if(verify)
      return e_user
    throw new BadRequestException('not a right code ')
  }

  async create_user(createUserDto: CreateUserDto) {
    const exitUser = await this.findByUsername(createUserDto.username)
    if(exitUser)
      throw new BadRequestException('user name laready exist!')
   const user= await this.user.save({
    username:createUserDto.username,
    name:createUserDto.name,
    email:createUserDto.email,
    password:await argon.hash(createUserDto.password)
  })
    return user;
  }

  async findAll() {
    return await this.user.find();
  }

  async findByUsername(username: string) {
    return await this.user.findOne({
      where:{username:username}
    });
     
  }
  async findByname(name: string) {
    return await this.user.findOne({
      where:{name:name}
    });
     
  }
  async findById(id: number) {
    return await this.user.findOne({
      where:{id:id}
    });
    
  }

  ///code ------------------------------
  quickFix(user: User): User {
		if (!user)
			return undefined;

		if (!(user.wins >= 0))
			user.wins = 0;
		if (!(user.lose >= 0))
			user.lose = 0;
		if (!(user.streak >= 0))
			user.streak = 0;
		return user;
	}

  async updateUser(target: number, user: User)
	{
		await this.user.update(target, user);
	}

 ///code ------------------------------

  async update_info(id: number,avatar_name:string, updateUserDto: UpdateUserDto) {
    if(avatar_name)
      updateUserDto.avatar=this.config.get('N_URL')+"/avatars/"+avatar_name;
      // updateUserDto.avatar="http://localhost:3000/avatars/"+avatar_name;
    
    await this.user.update(id,{name:updateUserDto.name,email:updateUserDto.email,avatar:updateUserDto.avatar,twoFAenabled:(updateUserDto.twoFAenabled==='true'?true:false)})
    return await this.findById(id);
  }
  
  async update(id: number, updateUserDto: UpdateUserDto) {
   return await this.user.update(id,updateUserDto)

  }

  async updateOnLine(id: number) {
   return await this.user.update(id,{onLine:true})
  }
  async updateOffLine(id: number) {
   return await this.user.update(id,{onLine:false})
  }

  async updateInGame(id: number) {
   return await this.user.update(id,{inGame:true})
  }
  async updateOutGame(id: number) {
   return await this.user.update(id,{inGame:false})
  }
  
  async updateHaveInvitation(id: number) {
   return await this.user.update(id,{haveInvitatio:false})
  }
  async updateNoINvitation(id: number) {
   return await this.user.update(id,{haveInvitatio:false})
  }




}

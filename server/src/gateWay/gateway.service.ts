import { BadGatewayException, BadRequestException, Injectable, OnModuleInit, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server,Socket} from "socket.io";
import { JwtAuthGuard } from "src/auth/guards/jwt_auth.guard";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jw_user } from "src/auth/types/types";
import * as jwt from 'jsonwebtoken';
import { UserService } from "src/user/user.service";
import { ChatMemberService } from "src/chat/chatMember.service";



@WebSocketGateway({
  cors:{
      // origin:"http://localhost:5173"
      origin:process.env.C_URL
  }
})

export class GatewayService implements OnModuleInit, OnGatewayDisconnect {

  constructor(
            private readonly config:ConfigService,
            private readonly userSer:UserService,
            private readonly member:ChatMemberService,
  ){}

  userSocketMap:Map<number, string> = new Map();;
  // lists: Map<string, string> = new Map();


  @WebSocketServer()
  server:Server

  async handleDisconnect(socket:Socket) {
    const id=this.getUserIdBySocketId(socket.id)
    if(id){
      await this.userSer.updateOffLine(+id)
      this.removeUserSocket(id)
      console.log(`handleDisconnect: Client ${id}  disconnected to ${socket.id}`)
    }
  }

  onModuleInit() {

    this.server.use((socket:Socket,next)=>{
      try{
        let tokens = socket.handshake.query.token
        const token = Array.isArray(tokens) ? tokens[0] : tokens;
        const user =jwt.verify(token,this.config.get('T_SECRET'))
        if(!user)
        {
          console.error('Authentication failed');
          socket.disconnect(true);
        }else{
          socket.data=user;
          next()
        }
      }catch(error:any){
        console.error('Authentication failed:', error.toString());
        socket.disconnect(true);
        
      }
    })

      this.server.on("connection",async (socket:Socket)=>{
        await this.userSer.updateOnLine(+socket.data.id)
        this.addUserSocket(socket.data.id,socket.id)
        this.userSocketMap.forEach((value,key)=>{
          console.log(key,value)
        })
        console.log(`1Client ${socket.data.username}  connected to ${socket.id}`)
        socket.data={}

      })

      this.server.on("disconnect",async (socket:Socket)=>{
        const id=this.getUserIdBySocketId(socket.id)
        await this.userSer.updateOffLine(+id)
        this.removeUserSocket(id)
        console.log(`1Client ${id}  disconnected to ${socket.id}`)
        socket.disconnect(true);
      })
  }

      //this is event
      @SubscribeMessage('my_disconnect')
      async My_disconnect(@MessageBody() body:any, @ConnectedSocket() socket:Socket){
        try{

          const id=this.getUserIdBySocketId(socket.id)
          await this.userSer.updateOffLine(+id)
          this.removeUserSocket(id)
          console.log(`my_disconnect:Client ${id}  disconnected to ${socket.id}`)
          socket.disconnect(true);
        }
        catch{
          
        }    
      }
      //this is event
      @SubscribeMessage('sendPrivateMessage')
      sendPrivateMessage(@MessageBody() body:any, @ConnectedSocket() socket:Socket){
        // console.log("body",body)
        const {chatId, member1,member2} = body
        const socket_id1 = this.getSocketId(+member1)
        const socket_id2 = this.getSocketId(+member2)
        if(socket_id1)
          this.server.to(socket_id1).emit("havePrivateMessage")
        if(socket_id2)
          this.server.to(socket_id2).emit("havePrivateMessage")
      }


      @SubscribeMessage('createNewPrivateChat')
      createNewPrivateChat(@MessageBody() body:any, @ConnectedSocket() socket:Socket){
        const {chatId, member1,member2} = body
        const socket_id1 = this.getSocketId(+member1)
        const socket_id2 = this.getSocketId(+member2)
        if(socket_id1)
          this.server.to(socket_id1).emit("newConversation")
        if(socket_id2)
          this.server.to(socket_id2).emit("newConversation")
      }


      @SubscribeMessage('friendRequest')
      async friendRequest(@MessageBody() body:any, @ConnectedSocket() socket:Socket){

         const socket_id:string = this.getSocketId(+body.second_user)
         if(socket_id){
           this.server.to(socket_id).emit("haveRequest")
         }
      }

      @SubscribeMessage('inviteToGame')
      async inviteToGame(@MessageBody() body:any, @ConnectedSocket() socket:Socket){

         const socket_id:string = this.getSocketId(+body.to)
         if(socket_id){
          this.userSer.updateHaveInvitation(+body.to)
          // this.userSer.updateHaveInvitation(+body.from)
          this.server.to(socket_id).emit("haveInvitationToGame",{from:body.from})
         }
      }

      @SubscribeMessage('refuseINvitation')
      async refuseINvitation(@MessageBody() body:any, @ConnectedSocket() socket:Socket){

        this.userSer.updateNoINvitation(+body.to)
        // this.userSer.updateNoINvitation(+body.from)
         const socket_id:string = this.getSocketId(+body.from)
         if(socket_id){
          this.server.to(socket_id).emit("haveBeenRefused")
         }
      }


      @SubscribeMessage('setAdmin')
      async setAdmin(@MessageBody() body:any, @ConnectedSocket() socket:Socket){
        
         const socket_id:string = this.getSocketId(+body.user)
         if(socket_id){
           this.server.to(socket_id).emit("haveSetAdmin")
         }
      }
      @SubscribeMessage('setBan')
      async setBan(@MessageBody() body:any, @ConnectedSocket() socket:Socket){
        
         const socket_id:string = this.getSocketId(+body.user)
         if(socket_id){
           this.server.to(socket_id).emit("haveSetBan")
         }
      }
      @SubscribeMessage('setUnBan')
      async setUnBan(@MessageBody() body:any, @ConnectedSocket() socket:Socket){
        
         const socket_id:string = this.getSocketId(+body.user)
         if(socket_id){
           this.server.to(socket_id).emit("haveUnSetBan")
         }
      }



      // @SubscribeMessage('joinGroup')
      // async joinGroup(@MessageBody() body:any, @ConnectedSocket() socket:Socket){

      //    const socket_id:string = this.getSocketId(+body.join)
      //    if(socket_id){
      //      this.server.to(socket_id).emit("haveJoinedGroup")
      //    }
      // }

      @SubscribeMessage('joinGroup')
      async joinGroup(@MessageBody() body:any, @ConnectedSocket() socket:Socket){
        const {chatId, join} = body
        const mem_chats = await this.member.findByChatId(+chatId)
        // const socket_id:string = this.getSocketId(+join)
        // if(socket_id){
        //   this.server.to(socket_id).emit("haveJoinedGroup1")
        // }
        this.userSocketMap.forEach((value, key)=>{
          for (const member of mem_chats){
            if(member.user.id === +key){
              this.server.to(value).emit("haveJoinedGroup")
              break;
            }
          }
        })
      }

      @SubscribeMessage('leaveGroup')
      async leaveGroup(@MessageBody() body:any, @ConnectedSocket() socket:Socket){
        const {chatId, user} = body
        const mem_chats = await this.member.findByChatId(+chatId)
        // const socket_id:string = this.getSocketId(+user)
        // if(socket_id){
        //   this.server.to(socket_id).emit("haveLeftGroup1")
        // }
        if(mem_chats){
          this.userSocketMap.forEach((value, key)=>{
            for (const member of mem_chats){
              if(member.user.id === +key){
                this.server.to(value).emit("haveLeftGroup")
                break;
              }
            }
          })
        }
      }
      @SubscribeMessage('setKick')
      async setKick(@MessageBody() body:any, @ConnectedSocket() socket:Socket){
        const {chatId, user} = body
        const mem_chats = await this.member.findByChatId(+chatId)
        const socket_id:string = this.getSocketId(+user)
        if(socket_id){
          this.server.to(socket_id).emit("haveBeenKicked1")
        }
        if(mem_chats){
          this.userSocketMap.forEach((value, key)=>{
            for (const member of mem_chats){
              if(member.user.id === +key){
                this.server.to(value).emit("haveBeenKicked2")
                break;
              }
            }
          })
        }
      }



      @SubscribeMessage('setPublic')
      async setPublic(@MessageBody() body:any, @ConnectedSocket() socket:Socket){
        const {chatId} = body
        const mem_chats = await this.member.findByChatId(+chatId)
        if(mem_chats){
          console.log("setpublic")
          this.userSocketMap.forEach((value, key)=>{
            for (const member of mem_chats){
              if(member.user.id === +key){
                // if(member.isAdmin || member.isCreator){
                  this.server.to(value).emit("haveSetPublic")
                  break;
                // }
              }
            }
          })
        }
      }
      @SubscribeMessage('setProtected')
      async setProtected(@MessageBody() body:any, @ConnectedSocket() socket:Socket){
        const {chatId} = body
        const mem_chats = await this.member.findByChatId(+chatId)
        if(mem_chats){
          console.log("setpublic")
          this.userSocketMap.forEach((value, key)=>{
            for (const member of mem_chats){
              if(member.user.id === +key){
                // if(member.isAdmin || member.isCreator){
                  this.server.to(value).emit("haveSetProtected")
                  break;
                // }
              }
            }
          })
        }
      }


      @SubscribeMessage('sendGroupMessage')
      async sendGroupMessage(@MessageBody() body:any, @ConnectedSocket() socket:Socket){
          const {chatId, sender} = body
          const mem_chats = await this.member.findByChatId(+chatId)
          this.userSocketMap.forEach((value, key)=>{
            for (const member of mem_chats){
              if(member.user.id === +key){
                // console.log("member.id",member.id)
                this.server.to(value).emit("haveGroupMessage")
                break;
              }
            }
          })
      }






      addUserSocket(userId: number, socketId: string): void {
        this.userSocketMap.set(userId, socketId);
      }
    
      removeUserSocket(userId: number): void {
        this.userSocketMap.delete(userId);
      }
    
      getSocketId(user_Id: number): string | undefined {
        return this.userSocketMap.get(user_Id)
      }
    
      getAllUserIds(): number[] {
        return Array.from(this.userSocketMap.keys());
      }

      getUserIdBySocketId(socketId: string): number | undefined {
        for (const [userId, id] of this.userSocketMap.entries()) {
          if (id === socketId) {
            return userId;
          }
        }
        return undefined; // Return undefined if the socketId is not found
      }

}

class UserSocketMap {
  userSocketMap: Map<number, string> = new Map();

  addUserSocket(userId: number, socketId: string): void {
    this.userSocketMap.set(userId, socketId);
  }

  removeUserSocket(userId: number): void {
    this.userSocketMap.delete(userId);
  }

  getSocketId(userId: number): string | undefined {
    return this.userSocketMap.get(userId);
  }

  getAllUserIds(): number[] {
    return Array.from(this.userSocketMap.keys());
  }
  getUserIdBySocketId(socketId: string): number | undefined {
    for (const [userId, id] of this.userSocketMap.entries()) {
      if (id === socketId) {
        return userId;
      }
    }
    return undefined; // Return undefined if the socketId is not found
  }
}




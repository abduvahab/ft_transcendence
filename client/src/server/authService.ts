import axios from "axios";
import { 
        IUser,Sg_User, 
        Lg_User,Token_User, Friend,Block,
        PrivateChat,CreatePrivateMessage,
        CreatePrivateChat,
        PrivateMessage,
        GroupChat,
        ChatMemeber,
        GroupMessage,
        CreateGroupMessage,
        G_History,



    } from "../types/types"
import { getToken } from "../helpers/localStore.helper";


export const  authService ={

    url:import.meta.env.VITE_LOCAL1,

   instance:(url:any)=>{

     return axios.create({
        baseURL:url,
        // baseURL:'http://localhost:3000',
        headers:{
            Authorization: "Bearer "+ getToken() || null

        }
    
    })},

    async signupUser(user:Sg_User):Promise<IUser | undefined >{

  
        const {data}= await this.instance(this.url).post<IUser>('user',user)
        return data;
    },
    async LoginUser(user:Lg_User):Promise<Token_User | undefined >{

  
        const {data}= await this.instance(this.url).post<Token_User>('auth/user',user)
        return data;
    },
    async updateUser(user:any):Promise<IUser | undefined >{

  
        const {data}= await this.instance(this.url).post<IUser>('user/upload',user)
        return data;
    },


    async getUserProfile():Promise<IUser | undefined>{
        const {data}= await this.instance(this.url).get<IUser>('auth/profile');
        
        return data;
    },
    async getUserById(id:number):Promise<IUser | undefined>{
        const {data}= await this.instance(this.url).get<IUser>(`user/user/${id}`);
        return data;
    },

    async getUserByUserName(username:string):Promise<IUser | undefined>{
        const {data}= await this.instance(this.url).get<IUser>(`user/username/${username}`);
        return data;
    },
    
    async senCodeRequest(){
         await this.instance(this.url).get('auth/twoFa'); 
    },

    async getAllFriends():Promise<Friend[] | undefined>{
        const {data}=await this.instance(this.url).get<Friend[]>('friend');
        return data;
    },
    async getAllHistories():Promise<G_History[] | undefined>{
        const {data}=await this.instance(this.url).get<G_History[]>('game');
        return data;
    },
    async getAllBlocks():Promise<Block[] | undefined>{
        const {data}=await this.instance(this.url).get<Block[]>('user-block');

        return data;
    },
    async getAllRequests():Promise<Friend[] | undefined>{
        const {data}=await this.instance(this.url).get<Friend[]>('friend/request');
        return data;
    },

    async unBlockUser(block_id:number):Promise<any>{
        const {data}=await this.instance(this.url).delete<any>(`user-block/${block_id}`);
        return data;
    },

    async acceptFriendRequest(friend_id:any):Promise<any>{
        const {data}=await this.instance(this.url).patch<any>("friend",friend_id);
        return data;
    },

    async sendFriendRequest(user_id:any):Promise<any>{
        const {data}=await this.instance(this.url).post<any>("friend",user_id);
        return data;
    },
    //id is id of the user
    async deleteFriend(user_id:number):Promise<any>{
        const {data}=await this.instance(this.url).delete<any>(`friend/id/${user_id}`);
        return data;
    },

    //id is friend entity id
    async refuseFriendRequest(friend_id:number):Promise<any>{
        const {data}=await this.instance(this.url).delete<any>(`friend/delete/${friend_id}`);
        return data;
    },

    async blockUser(bock_entity:any):Promise<any>{
        const {data}=await this.instance(this.url).post<any>("user-block",bock_entity);
        return data;
    },

    async getAllPrivateChatByUser():Promise<PrivateChat[] | undefined>{
        const {data}=await this.instance(this.url).get<PrivateChat[]>('privatechat');
        return data;
    },

    async getPrivateMessagesByChatId(id:number):Promise<PrivateMessage[] | undefined>{
        const {data}=await this.instance(this.url).get<PrivateMessage[]>(`privateMessage/chatId/${id}`);
        return data;
    },

    //this only create chat, dont check if the user blocked 
    async createPrivateMessage(msg:CreatePrivateMessage):Promise<any>{
        const {data}=await this.instance(this.url).post<any>('privateMessage',msg);
        return data;
    },

    //this create the messsage and add the chat, and check if the blocked
    async addPrivateMessageToChat(msg:CreatePrivateMessage):Promise<any>{
        const {data}=await this.instance(this.url).patch<any>('privatechat',msg);
        return data;
    },
    //create private conversation
    async createPrivateChat(pc:CreatePrivateChat):Promise<any>{
        const {data}=await this.instance(this.url).post<any>('privatechat',pc);
        return data;
    },


    async getAllGroupChatByUserId():Promise<ChatMemeber[] | undefined>{
        const {data}=await this.instance(this.url).get<ChatMemeber[]>('chat');
        return data
    },
    async getOneChatmember(chatId:number):Promise<ChatMemeber | undefined>{
        const {data}=await this.instance(this.url).get<ChatMemeber>(`chat/member/${chatId}`)
        return data
    },
    async getAllChatmember(chatId:number):Promise<ChatMemeber[] | undefined>{
        const {data}=await this.instance(this.url).get<ChatMemeber[]>(`chat/allMember/${chatId}`)
        return data
    },

    async getGroupMessagesByChatId(id:number):Promise<GroupMessage[] | undefined>{
        const {data}=await this.instance(this.url).get<GroupMessage[]>(`message/chatId/${id}`);
        return data;
    },

    async createPublicGroup(pg:any){
        const {data} = await this.instance(this.url).post("chat/public",pg)
        return data
    },
    async createProtectedGroup(pg:any){
        const {data} = await this.instance(this.url).post("chat/protected",pg)
        return data
    },
    async searchGroupByName(name:string):Promise<GroupChat[] | undefined>{
        const {data} = await this.instance(this.url).get<GroupChat[]>(`chat/name/${name}`)
        return data
    },
    async joinProtectedGroup(chatId:number,query:string){
        const {data} = await this.instance(this.url).get(`chat/addProtected/${chatId}`,{
            params:{
                password:query
            }
        })
        return data
    },

    //this create the messsage and add the chat, and check if the blocked
    async addMessageToGroupChat(msg:CreateGroupMessage):Promise<any>{
        const {data}=await this.instance(this.url).patch<any>('chat',msg);
        return data;
    },

    async joinPublicGroup(chatId:number){
        const {data} = await this.instance(this.url).get(`chat/addPublic/${chatId}`)
        return data
    },
    async leaveGroup(chatId:number){
        const {data} = await this.instance(this.url).get(`chat/leave/${chatId}`)
        return data
    },
    async setPublic(chatId:number){
        const {data} = await this.instance(this.url).get(`chat/setPublic/${chatId}`)
        return data
    },
    async resetPassWordToProtected(chatId:number,query:string){
        const {data} = await this.instance(this.url).get(`chat/setpassword/${chatId}`,{
            params:{
                password:query
            }
        })
        return data
    },
    async changePublicToProtected(chatId:number,query:string){
        const {data} = await this.instance(this.url).get(`chat/setProtected/${chatId}`,{
            params:{
                password:query
            }
        })
        return data
    },

    // @Get("setAdmin/:chatid/:memberid")
    async setAdmin(chatId:number,memberid:number){
        const {data} = await this.instance(this.url).get(`chat/setAdmin/${chatId}/${memberid}`)
        return data
    },
    // @Get("setMute/:chatid/:memberid")
    async setMute(chatId:number,memberid:number){
        const {data} = await this.instance(this.url).get(`chat/setMute/${chatId}/${memberid}`)
        return data
    },
    // @Get("setUnMute/:chatid/:memberid")
    async setUnMute(chatId:number,memberid:number){
        const {data} = await this.instance(this.url).get(`chat/setUnMute/${chatId}/${memberid}`)
        return data
    },
    // @Get("kick/:chatid/:memberid")
    async setKick(chatId:number,memberid:number){
        const {data} = await this.instance(this.url).get(`chat/kick/${chatId}/${memberid}`)
        return data
    },
    // @Get("banned/:chatid/:memberid")
    async setBan(chatId:number,memberid:number){
        const {data} = await this.instance(this.url).get(`chat/banned/${chatId}/${memberid}`)
        return data
    },
    // @Get("unbanned/:chatid/:memberid")
    async setUnBan(chatId:number,memberid:number){
        const {data} = await this.instance(this.url).get(`chat/unbanned/${chatId}/${memberid}`)
        return data
    },
    async getQrCode(){
        const {data} = await this.instance(this.url).get('user/qr')
        return data
    },



}
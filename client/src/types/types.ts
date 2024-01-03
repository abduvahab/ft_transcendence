

export interface IUser{

    id:number
    username:string
    name:string
    email:string
    onLine:boolean
    inGame:boolean
    avatar:string
    twoFAenabled:boolean
    haveInvitatio:boolean
    createAt:Date
    lose: number;
    rank:number
    matchs:number
    wins:number
}
export interface Sg_User{

    username:string
    name:string
    email:string
    password:string
}
export interface Lg_User{

    username:string
    password:string
}

export interface Token_User{
    id:number
    username:string
    twoFAenabled:boolean
    token:string
}

export interface Friend{

    id:number
    first_user:IUser
    second_user:IUser
    status:string
    createAt:Date
}


export interface G_History{

    id:number
    playerOne: IUser
    playerTwo: IUser
    scorePlayerOne: number;
    scorePlayerTwo: number;
    playedOn:Date
}

export interface Block{

    id:number
    blocking_user:IUser
    blocked_user:IUser
    createAt:Date
}

export interface PrivateChat{

    id:number
    member1:IUser
    member2:IUser
    messages:PrivateMessage[]
    createAt:Date
    updateAt:Date
}

export interface PrivateMessage{

    id:number
    sender:IUser
    chat:PrivateChat
    text:string
    createAt:Date
    updateAt:Date
}

export interface CreatePrivateMessage {

    sender:number
    chat:number
    text:string
}
export interface CreatePrivateChat {

    member2:number
}
//group chats
export interface GroupMessage{

    id:number
    sender:IUser
    chat:GroupChat
    text:string
    createAt:Date
    updateAt:Date
}

export interface ChatMemeber{

    id:number
    user: IUser;
    chat: GroupChat;
    isBanned: boolean;
    isCreator: boolean;
    isAdmin: boolean;
    isMuted: boolean;
    createAt:Date
    updateAt:Date
}



export interface GroupChat{

    id:number
    type:string
    name:string
    creator:IUser
    isProtected:boolean
    password:string
    members: ChatMemeber[];
    // messages:GroupMessage[]
    createAt:Date
    updateAt:Date
}
export interface CreateGroupMessage {

    sender:number
    chat:number
    text:string
}











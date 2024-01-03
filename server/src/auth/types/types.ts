
export interface IUser_42{
    username:string,
    name:string,
    email:string
    avatar:string,
}

export interface jw_user{
    id:number
    username:string
}
export interface IUser{

    id:number
    username:string
    name:string
    email:string
    onLine:boolean
    inGame:boolean
    avatar:string
    twoFAenabled:boolean
    createAt:Date
}

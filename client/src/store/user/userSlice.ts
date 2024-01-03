
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {  IUser, PrivateChat } from '../../types/types'
// import type { RootState } from '../store'

// Define a type for the slice state
interface userAuth {
  user:IUser | null
  privateChat:PrivateChat | null
  privateChatId:number | undefined
  groupChatId:number | undefined
  isGroup:boolean
  isPrivate:boolean
  createdChanal:boolean
  // socket:Socket | null
  isAuth:boolean
  isSetUser:boolean
}

// Define the initial state using that type
const initialState: userAuth = {
    user:null,
    // socket:null,
    privateChat:null,
    isGroup:false,
    createdChanal:false,
    isPrivate:true,
    privateChatId:undefined,
    groupChatId:undefined,
    isAuth:false,
    isSetUser:false
}

export const userSlice = createSlice({
  name: 'isAuth',
  initialState,
  reducers: {

   login(state){
      state.isAuth = true
   },
   logout(state){
    state.user = null
    state.privateChat = null
    state.privateChatId = undefined
    state.groupChatId = undefined
    state.isAuth = false
    state.createdChanal = false
    state.isGroup = false
    state.isPrivate = true
    state.isSetUser = false
   },
   setUser(state, actions:PayloadAction<IUser>){
    state.user = actions.payload
    state.isSetUser= true
   },

   setPrivateChat(state, actions:PayloadAction<PrivateChat>){
      state.privateChat = actions.payload
   },
   setPrivateChatId(state, actions:PayloadAction<number>){
    state.privateChatId = actions.payload
   },
   setGroupChatId(state, actions:PayloadAction<number>){
    state.groupChatId = actions.payload
   },

   groupChatMode(state){
      state.isGroup = true
      state.isPrivate = false
   },

   privateChatMode(state){
      state.isPrivate = true
      state.isGroup = false
   },
   haveCreatedChanal(state){
      state.createdChanal=true
   },
   setCreatedChanal(state){
      state.createdChanal=false
   },
   setGroupChatIdUndefined(state){
      state.groupChatId = undefined
      // state.groupChatId = -1
   },



  },

})

export const { login,logout,setUser,setPrivateChat,setPrivateChatId,groupChatMode,privateChatMode,setGroupChatId,haveCreatedChanal,setCreatedChanal,setGroupChatIdUndefined } = userSlice.actions

export default userSlice.reducer
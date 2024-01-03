import { useEffect, useState } from "react"
import { authService } from "../../server/authService"
import { PrivateChat } from "../../types/types"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { setPrivateChat, setPrivateChatId } from "../../store/user/userSlice"
import { useNavigate } from "react-router-dom"
import Chats from "./Chats"

export function ListChat(props:any){

    const {socket}= props

    const [privateChats, setChats] = useState<PrivateChat[]>([])
    const privateChatId = useAppSelector((state)=>state.isAuth.privateChatId)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const getAllPrivateChatByUser=async ()=>{
        try{
            const data = await authService.getAllPrivateChatByUser()
            if(data){
              setChats(data)
              if(data.length > 0 && !privateChatId){
                dispatch(setPrivateChatId(data[0].id))
                dispatch(setPrivateChat(data[0]))
              }
            }
            else{
              navigate("/errorPage")
            }
            // toast.success("you have blocked the user")
        }
        catch(error:any){
            navigate("/errorPage")
            // const err = error.response?.data.message;
            // toast.error(err.toString())
        }
    }


    useEffect(()=>{
      socket.on("newConversation",()=>{
        getAllPrivateChatByUser()

      })
      },[socket, privateChatId])
      
    useEffect(()=>{
        getAllPrivateChatByUser()
      },[])


    return <>
        <div>
        {privateChats.map((privateChat:PrivateChat)=>(
            <Chats privateChat={privateChat}/>
        ))} 
        </div>
    </>
}
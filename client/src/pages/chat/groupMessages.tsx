import { useEffect, useState } from 'react'
import Message from './Message'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { GroupMessage, IUser, PrivateMessage } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../server/authService';

function GroupMessages(props:any){

    const {socket} = props
    const userdata = useAppSelector((state)=>state.isAuth.user)
    const [messages,setMessages] = useState<GroupMessage[]>([])
    const groupChatId = useAppSelector((state)=>state.isAuth.groupChatId)
    const navigate = useNavigate()


    const getMessagesByChatId=async()=>{
        try{
            if(groupChatId){
                const data = await authService.getGroupMessagesByChatId(groupChatId)
                if(data){
                    setMessages(data)
                }
                else{
                    navigate("/errorPage")
                }
            }
        }
        catch(error:any){
            navigate("/errorPage")
            // const err = error.response?.data.message;
            // toast.error(err.toString())
        }

    }


    useEffect(()=>{
        socket.on("haveGroupMessage",()=>{
            getMessagesByChatId()
        })
        return ()=>{
            socket.off("haveGroupMessage")  
        }
    },[socket,groupChatId])

    useEffect(()=>{
        getMessagesByChatId()
    },[groupChatId])

    return (
        <div className='messagesC'>
            {
                groupChatId ?(
                    messages.map((message:GroupMessage)=>(
                        <Message message={message} isSender={message.sender.id === userdata?.id ? true:false}/>
                    ))
                ):(
                    <div className='flex items-center justify-center'>
                    <p className='text-lg text-black '>
                       no messages
                     </p>
                 </div>
                )
            }
            
        </div>
    );
};

export default GroupMessages
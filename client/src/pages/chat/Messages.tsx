import { useEffect, useState } from 'react'
import Message from './Message'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { IUser, PrivateMessage } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../server/authService';

function Messages(props:any){

    const {socket} = props
    const userdata = useAppSelector((state)=>state.isAuth.user)
    const [messages,setMessages] = useState<PrivateMessage[]>([])

    const privateChatId = useAppSelector((state)=>state.isAuth.privateChatId)
    const navigate = useNavigate()


    const getMessagesByChatId=async()=>{
        try{
            if(privateChatId){
                const data = await authService.getPrivateMessagesByChatId(privateChatId)
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
        socket.on("havePrivateMessage",()=>{
            getMessagesByChatId()
        })
        return ()=>{
            socket.off("havePrivateMessage")  
        }
    },[socket,privateChatId])

    useEffect(()=>{
        getMessagesByChatId()
    },[privateChatId])

    return (
        <div className='messagesC'>
            {
                privateChatId ?(
                    messages.map((message:PrivateMessage)=>(
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

export default Messages
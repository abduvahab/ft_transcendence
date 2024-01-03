import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { authService } from '../../server/authService'
import { useAppSelector } from '../../store/hooks'

function Input (props:any){
    const {socket} = props
    const userdata = useAppSelector((state)=>state.isAuth.user)
    const privateChatid = useAppSelector((state)=>state.isAuth.privateChatId)
    const privateChat = useAppSelector((state)=>state.isAuth.privateChat)
    const [message, setMessage] = useState<string>("")

    const handleSend=async (e:any)=>{

        e.preventDefault()
        if(message && userdata){
            try{
                if(privateChatid && privateChat){

                    const data= await authService.addPrivateMessageToChat({sender:userdata.id,chat:privateChat.id,text:message})
                    if(!data)
                        toast.error("send the message failed22")
                    else{
                        socket.emit("sendPrivateMessage",{chatId:privateChat?.id, member1:privateChat.member1.id,member2:privateChat.member2.id})
                        setMessage("")
                    }
                }
            }
            // catch{
            //     toast.error("send the message failed")
            // }
            catch(error:any){
                // navigate("errorPage")
                const err = error.response?.data.message;
                toast.error(err.toString())
            }
        }

    }

    return (
        <>
            <form className='flex inputC' onSubmit={handleSend}>
                <input 
                    type='text' 
                    className='inputSend text-black' 
                    placeholder='Type something...'
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                />
                <div>
                    <button 
                        className='border-none px-4 py-2 text-white bg-blue-500 cursor-pointer'
                        type='submit'
                    >
                        Send
                    </button>
                </div>
            </form>
        </>
    );
};

export default Input
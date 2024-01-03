import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { authService } from '../../server/authService'
import { useAppSelector } from '../../store/hooks'

function GroupInput (props:any){
    const {socket} = props
    const userdata = useAppSelector((state)=>state.isAuth.user)
    const groupChatId = useAppSelector((state)=>state.isAuth.groupChatId)
    const [message, setMessage] = useState<string>("")

    const handleSend=async (e:any)=>{
        e.preventDefault()
        if(message && userdata){
            try{
                if(groupChatId ){
                    const data= await authService.addMessageToGroupChat({sender:+userdata.id,chat:+groupChatId,text:message})
                    if(!data)
                        toast.error("send the message failed")
                    else{
                        // socket.emit("sendGroupMessage",{chatId:+groupChatId, sender:+userdata.id,})
                        if(data.message ==="you have ben muted"){
                            toast.success(data.message)
                        }else{
                            socket.emit("sendGroupMessage",{chatId:groupChatId, sender:userdata.id,})
                        }
                        setMessage("")
                    }
                }
            }
            catch(error:any){
                const err = error.response?.data.message;
                toast.error(err.toString())
            }
        }

    }

    // useEffect(()=>{
    //     console.log("groupChatId",groupChatId)
    // },[groupChatId])

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

export default GroupInput
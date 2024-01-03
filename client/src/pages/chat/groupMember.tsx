import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { IUser } from '../../types/types';
import '../../css/chat.css'
import icon from '../../assets/icon.png';
import { setPrivateChat, setPrivateChatId } from '../../store/user/userSlice';
import { toast } from 'react-toastify';
import { authService } from '../../server/authService';
import { useNavigate } from 'react-router-dom';

function GroupMember(props:any){

    const {chat_member,member,socket}=props
    const userdata = useAppSelector((state)=>state.isAuth.user)
    const groupChatId = useAppSelector((state)=>state.isAuth.groupChatId)
    const navigate = useNavigate()

    // const dispatch = useAppDispatch()
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null);
    const showSelect = () => {
        setShowOptions(!showOptions);
    };


    const handleWindowClick = (event: MouseEvent) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
        }
    };



    const handleAdmin= async()=>{
        try{

            const data = await authService.setAdmin(member?.chat.id,chat_member?.id)
            if(data)
            {
                socket.emit("setAdmin",{user:chat_member.user.id})
                toast.success(data.message)
            }
            
        }catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }
    }



    const handleMute= async()=>{
        try{
            const data = await authService.setMute(member?.chat.id,chat_member?.id)
            if(data)
            {
                // socket.emit("setAdmin",{user:chat_member.user.id})
                toast.success(data.message)
            }
            
        }catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }
    }


    const handleUnMute= async()=>{
        try{

            const data = await authService.setUnMute(member?.chat.id,chat_member?.id)
            if(data)
            {
                // socket.emit("setAdmin",{user:chat_member.user.id})
                toast.success(data.message)
            }
            
        }catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }
    }


    const handleBan= async()=>{
        try{

            const data = await authService.setBan(member?.chat.id,chat_member?.id)
            if(data)
            {
                socket.emit("setBan",{user:chat_member.user.id})
                toast.success(data.message)
            }
        }catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }
    }


    const handleUnban= async()=>{
        try{

            const data = await authService.setUnBan(member?.chat.id,chat_member?.id)
            if(data)
            {
                socket.emit("setUnBan",{user:chat_member.user.id})
                toast.success(data.message)
            }
            
        }catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }
    }


    const handleKick= async()=>{
        try{

            const data = await authService.setKick(member?.chat.id,chat_member?.id)
            if(data)
            {
                socket.emit("setKick",{user:chat_member.user.id,chatId:member?.chat.id})
                toast.success(data.message)
            }
            
        }catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }
    }
    const handleProfile=async ()=>{
        navigate(`/friends/profile/${chat_member.user.id}`)
  
      }



    useEffect(() => {
        window.addEventListener('click', handleWindowClick);
        return () => {
            window.removeEventListener('click', handleWindowClick);
        };

    }, []);

    return (
        

        <div className='chatsC' ref={optionsRef}>
            <div className="userChatC relative" onClick={showSelect}>
                <img 
                    className='imageC' 
                    src={chat_member?.user?.avatar ?(chat_member?.avatar): icon} 
                    alt="" 
                />

                {showOptions && (
                    <div className="chatMember_options  top-0 left-0 mt-2 ml-2 bg-gray-800 p-2 rounded ">
                        {
                           member.isCreator && 
                            <button 
                                className="text-white text-sm hover:text-red-400 mt-2"
                                onClick={handleAdmin}
                            >
                                set admin
                            </button>

                        }
                        {(member.isAdmin || member.isCreator)&&
                           <>
                                <button 
                                    className="text-white text-sm hover:text-red-400 mt-2"
                                    onClick={handleMute}
                                >
                                    mute
                                </button>
                                <button 
                                    className="text-white text-sm hover:text-red-400 mt-2"
                                    onClick={handleUnMute}
                                >
                                    unmute
                                </button>
                                <button 
                                    className="text-white text-sm hover:text-red-400 mt-2"
                                    onClick={handleBan}
                                >
                                    ban
                                </button>
                                <button 
                                    className="text-white text-sm hover:text-red-400 mt-2"
                                    onClick={handleUnban}
                                >
                                    unban
                                </button>
                                <button 
                                    className="text-white text-sm hover:text-red-400 mt-2"
                                    onClick={handleKick}
                                >
                                    kick
                                </button>
                            
                            </>
                        }
                        <button 
                            className="text-white text-sm hover:text-red-400 mt-2"
                            onClick={handleProfile}
                        >
                            profile
                        </button>
                    </div>
                )}

                <div className='userChatInfoC'>
                    <h1 className=''>{chat_member?.user?.name}</h1>
                    {/* <span className='text-xs'>{member.onLine ? "on":"off"}</span> */}
                </div>
            </div>
        </div>
    );
};

export default GroupMember
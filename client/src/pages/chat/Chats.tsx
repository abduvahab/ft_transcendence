import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { IUser } from '../../types/types';
import icon from '../../assets/icon.png';
import { setPrivateChat, setPrivateChatId } from '../../store/user/userSlice';

function Chats(props:any){
    const userdata = useAppSelector((state)=>state.isAuth.user)
    // const {privateChat,setPrivateChat}=props
    const {privateChat}=props
    const dispatch = useAppDispatch()
    const [member] = useState<IUser>((privateChat.member1.id ===userdata?.id?privateChat.member2:privateChat.member1))

    const handleClick=()=>{
        // dispatch(setPrivateChat(privateChat))
        dispatch(setPrivateChatId(privateChat.id))
        dispatch(setPrivateChat(privateChat))
        // setPrivateChat(privateChat)
    }
    
    return (
        // {privateChats.map()}

        <div className='chatsC'>
            <div className="userChatC" onClick={handleClick}>
                <img 
                    className='imageC' 
                    src={member?.avatar ?(member?.avatar): icon} 
                    alt="" 
                />
                <div className='userChatInfoC'>
                    <h1 className=''>{member.name}</h1>
                    <span className='text-xs'>{member.onLine ? "on":"off"}</span>
                </div>
            </div>
        </div>
    );
};

export default Chats

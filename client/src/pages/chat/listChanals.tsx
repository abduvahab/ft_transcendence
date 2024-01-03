import { useAppDispatch } from "../../store/hooks"
import { setGroupChatId } from "../../store/user/userSlice"
import group_avatar from '../../assets/group_avatar2.png';
import { setGroupChatId_thunk } from "../../store/thunk/actions";


export function ListChanals(props:any){
    const {groupChat}=props

    const dispatch = useAppDispatch()
    const handleClick=()=>{
        dispatch(setGroupChatId_thunk(groupChat.id))
    }
    return <>
        <div className="userChatC" onClick={handleClick}>
            <img className='imageC' src={group_avatar} alt="" />
            <div className='userChatInfoC'>
                {/* <span>Channels 2</span> */}
                <h1>{groupChat.name}</h1>
            </div>
        </div>
    
    </>
}

import { FC, useEffect, useState } from "react";
import { useNavigate, useParams} from 'react-router-dom';
import '../../css/friendProfile.css'
import banner from '../../assets/cover.svg'
import icon from '../../assets/icon.png'
import { authService } from "../../server/authService";
import { IUser } from "../../types/types";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../store/hooks";
import { setPrivateChatId } from "../../store/user/userSlice";


export function FriendsProfilePage (props:any){
    const {socket} = props
    const { id } = useParams();
    const [user, setUser]=useState<IUser>()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(()=>{
        getUserById();
    },[])


    const handleBlock=async()=>{
        try{
            await authService.blockUser({blocked_user:id})
            navigate('/friends')
            toast.success("you have blocked the user")
        }
        catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }
        
    }

    const handleMessage=async()=>{
        try{ 
            if(user){
                const data = await authService.createPrivateChat({member2:user.id})
                if(data)
                {
                    if(data?.message !== 'exist'){
                        socket.emit("createNewPrivateChat",{chatId:data.id,member1:data.member1.id,member2:data.member2.id})
                        // dispatch(setPrivateChatId(data.id))
                    }
                }
                navigate('/chat')
                // toast.success("you have sent a request")
            } 
        }
        catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }

    }

    const handleAddFriend=async()=>{
        try{  
            await authService.sendFriendRequest({second_user:id})
            socket.emit("friendRequest",{second_user:id})
            toast.success("you have sent a request")
        }
        catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }

    }


    const getUserById=async ()=>{
        if (id){
            try{
                const data= await authService.getUserById(+id)
                if(data)
                    setUser(data)
                else
                    navigate('/errorPage')
            }
            catch(error:any){
                navigate('/errorPage')
            }
            return 
        }
        navigate('/errorPage')
    }


    return(<>
    <div className="homePage flex-col min-h-screen">
        <div className="relative mb-2  ">
            <div className="">
                <img src={banner} className='banner'/>
            </div >
            <div className="relative mr-5">
                <img className="icon rounded-full " src={user?.avatar ?(user?.avatar): icon}/>
            </div>
            <div className="name block mt-10">{user?.username}</div>
            <div className="name block">{user?.name}</div>
            {user?.inGame ? (
                    <div className="name font-sans italic">inGame</div>
                ): (
                    <div className="name font-sans italic">{user?.onLine ? 'on line':"off line"}</div>
                )}
            <div className="flex justify-end mr-5">
                <div>
                    <button 
                        className="button-9"
                        onClick={handleBlock}
                    >
                        Block
                    </button>
                    <button 
                        className="button-9"
                        onClick={handleMessage}
                    >
                        Message
                    </button>
                    <button 
                        className="button-9"
                        onClick={handleAddFriend}
                    >
                        Add Friend
                    </button>
                </div>
            </div>
        </div>
        <div className="h-20 bg-sky-600"></div>
        <div className="flex justify-between mt-15">
            {/* <div className="flex justify-center flex items-center m-4 h-48 w-48 bg-blue-900 rounded-3xl flex flex-col">
                <div className="mt-4">Rank</div>
                <div className="number">{user?.rank}</div>
            </div> */}
            <div className="flex justify-center flex items-center m-4 h-48 w-48 bg-blue-900 rounded-3xl flex flex-col">
                <div className="mt-4">Matches Played</div>
                <div className="number mt-4">{user?.matchs}</div>
            </div>
            <div className="flex justify-center flex items-center m-4 h-48 w-48 bg-blue-900 rounded-3xl flex flex-col">
                <div className="mt-4">Wins</div>
                <div className="number mt-4">{user?.wins}</div>
            </div>
            <div className="flex justify-center flex items-center m-4 h-48 w-48 bg-blue-900 rounded-3xl flex flex-col">
                <div className="mt-4">Lost Matches</div>
                <div className="number mt-4">{user?.lose}</div>
            </div>
        </div>
    </div>
    </>);
}
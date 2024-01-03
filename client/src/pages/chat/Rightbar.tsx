import icon from '../../assets/icon.png';
import { authService } from '../../server/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../store/hooks';
import { useEffect, useState } from 'react';

function Rightbar (props:any) {

    const{socket}=props
    const navigate = useNavigate()
    const userdata = useAppSelector((state)=>state.isAuth.user)
    const privateChat = useAppSelector((state)=>state.isAuth.privateChat)
    const [member,setMemeber] = useState((privateChat?.member1.id ===userdata?.id?privateChat?.member2:privateChat?.member1))

    const handleBlock=async()=>{
        try{
            if(member){

                await authService.blockUser({blocked_user:member.id})
                navigate('/friends')
                toast.success("you have blocked the user")
            }
        }
        catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }
        
    }

    const handleProfile=async ()=>{
        if(member)
            navigate(`/friends/profile/${member.id}`)
  
      }

      const handleGame=async ()=>{
        if(member){
            const one  =await authService.getUserById(+member.id)
            if(one?.id ===userdata.id){
                toast.error("you cant play with yourself ")
                return
            }
            if(one?.inGame){
                toast.error("the user is in game ")
                return
            }
            if(one?.haveInvitatio){
                toast.error("the user has already an invitation, try it after")
                return
            }
            if(!one?.onLine){
                toast.error("the user has already an invitation, try it after")
                return
            }
            if(!one?.inGame && !one?.haveInvitatio && one?.onLine){
                const queryParams ={frind_id:one.id+"", owner:'yes',accecpt:'no'} 
                socket.emit("inviteToGame",{to:one.id,from:userdata?.id})
                navigate(`/game?${new URLSearchParams(queryParams).toString()}`)
            }
        }
        // navigate(`/game/${friend.id}`)
    }

      useEffect(()=>{
        setMemeber((privateChat?.member1.id ===userdata?.id?privateChat?.member2:privateChat?.member1))
      },[privateChat])

    return (

    <>
        {privateChat ?(
        <div className='sidebarC'>
            <div className="flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                    <img 
                        className=" rounded-full border-4 border-solid border-gray-800 h-40 w-40 mt-20 object-cover " 
                        src={member?.avatar ?(member?.avatar): icon} 
                        alt="User icon" 
                    />
                </div>
                 <p className="flex items-center justify-center mt-2 text-lg text-black">{member?.name}</p>
            </div>
                 <div className="flex justify-center mt-5">
                    <button 
                        className="rounded-full bg-blue-500 text-white px-4 py-2 mr-2"
                        onClick={handleBlock}
                        >
                            Block
                        </button>
                    <button 
                        className="rounded-full bg-green-500 text-white px-4 py-2"
                        onClick={handleProfile}
                    >
                        View Profile
                    </button>
                    <button 
                        className="rounded-full bg-green-500 text-white px-4 py-2 ml-2"
                        onClick={handleGame}
                    >
                        game
                    </button>
                </div>
        </div>
        ):(
            <div className='sidebarC flex items-center justify-center'>
                   <p className='text-lg'>
                      no conversation
                    </p>
                </div>
        )}
    
    </>
       
    );
};

export default Rightbar
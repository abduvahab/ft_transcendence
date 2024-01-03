import { useEffect, useRef, useState } from 'react';
import icon from '../../../assets/icon.png';
import { authService } from '../../../server/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';

export function Show_Friend(props:any){

    const {friend,setFriends,setBlocks,socket} = props
    const navigate = useNavigate()

    const [showOptions, setShowOptions] = useState(false);
    const userdata = useAppSelector((state)=>state.isAuth.user)
    const optionsRef = useRef<HTMLDivElement>(null);
    const showSelect = () => {
        setShowOptions(!showOptions);
    };
    const handleWindowClick = (event: MouseEvent) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
        }
    };
    useEffect(() => {
        window.addEventListener('click', handleWindowClick);
        return () => {
            window.removeEventListener('click', handleWindowClick);
        };

    }, []);


    const handleGame=async ()=>{
        const one  =await authService.getUserById(+friend.id)
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
            const queryParams ={frind_id:friend.id, owner:'yes',accecpt:'no'} 
            socket.emit("inviteToGame",{to:friend.id,from:userdata?.id})
            navigate(`/game?${new URLSearchParams(queryParams).toString()}`)
        }
        // navigate(`/game/${friend.id}`)
    }

    const handleProfile=async ()=>{
      navigate(`/friends/profile/${friend.id}`)

    }

    const handleChat=async()=>{
        try{ 
            if(friend){
                await authService.createPrivateChat({member2:friend.id})
                navigate('/chat')
                // toast.success("you have sent a request")
            } 
        }
        catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }

    }

    const handleBlock=async ()=>{
      try{  
        await authService.deleteFriend(friend.id)
        await authService.blockUser({blocked_user:friend.id})
        getAllFriends
        getAllBlocks()
        toast.success("you have blocked the user")
    }
    catch(error:any){
        const err = error.response?.data.message;
        toast.error(err.toString())
    }
    }



    const getAllFriends = async ()=>{
        
      const data=await authService.getAllFriends()
      if(data)
          setFriends(data)
      else{
          toast.error("have problem detting data!")
      }
  }
  const getAllBlocks = async ()=>{
      
      const data=await authService.getAllBlocks()
      if(data)
          setBlocks(data)
      else{
          toast.error("have problem detting data!")
      }
  }

    return (<>
        <div className="flex justify-center flex items-center m-4 h-40 w-40 bg-blue-900 rounded-3xl flex flex-col relative">
      <div className="profile-button relative" ref={optionsRef}>
        <img className="rounded-full w-16 h-16" src={friend.avatar ?(friend.avatar): icon} alt={"Icon "} onClick={showSelect} />
        {showOptions && (
          <div className="options absolute top-0 left-0 mt-2 ml-2 bg-gray-800 p-2 rounded">
                <button 
                    className="text-white text-sm hover:text-red-400 mt-2"
                    onClick={handleChat}
                >
                    chat
                </button>
                <button 
                    className="text-white text-sm hover:text-red-400 mt-2"
                    onClick={handleGame}
                >
                    game
                </button>
                <button 
                    className="text-white text-sm hover:text-red-400 mt-2"
                    onClick={handleProfile}
                >
                    profile
                </button>
                <button 
                    className="text-white text-sm hover:text-red-400 mt-2"
                    onClick={handleBlock}
                >
                    block
                </button>
          </div>
        )}
      </div>
      <h1 className="mt-2 text-sm">{friend.name}</h1>
      {friend?.inGame ? (
                    <p className="mt-4 font-sans italic">inGame</p>
                ): (
                    <p className="mt-4 font-sans italic">{friend?.onLine ? 'on line':"off line"}</p>
        )}
    </div>

    </>)
}
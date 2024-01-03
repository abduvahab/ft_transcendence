import { useEffect, useRef, useState } from 'react';
import icon from '../../../assets/icon.png';
import { toast } from 'react-toastify';
import { authService } from '../../../server/authService';

export function Show_Request(props:any){
    const {request,setRequests,setFriends,setBlocks} = props
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
    useEffect(() => {
        window.addEventListener('click', handleWindowClick);
        return () => {
            window.removeEventListener('click', handleWindowClick);
        };

    }, []);

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

    const getAllRequests = async ()=>{
        
        const data=await authService.getAllRequests()
        if(data)
            setRequests(data)
        else{
            toast.error("have problem getting data!")
        }
    }

    const handleAccept=async ()=>{
        try{  
            await authService.acceptFriendRequest({id:request.id, status:"accepted"})
            getAllRequests()
            getAllFriends()
            toast.success("you add user as friend")
        }
        catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }

    }
    const handleRefuse=async ()=>{
        try{  
            await authService.refuseFriendRequest(request.id)
            getAllRequests()
            toast.success("you refused a friend request")

        }
        catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }

    }
    const handleBlock=async ()=>{
        try{  
            await authService.refuseFriendRequest(request.id)
            await authService.blockUser({blocked_user:request.first_user.id})
            getAllRequests()
            getAllBlocks()
            toast.success("you have blocked the user")
        }
        catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }
        
    }

    return (<>
        <div className="flex justify-center flex items-center m-4 h-40 w-40 bg-blue-900 rounded-3xl flex flex-col relative">
            <div className="profile-button relative" ref={optionsRef}>
            <img className="rounded-full w-16 h-16" src={request.first_user.avatar ?(request.first_user.avatar): icon} alt={"Icon "} onClick={showSelect} />
            {showOptions && (
            <div className="options absolute top-0 left-0 mt-2 ml-2 bg-gray-800 p-2 rounded">
                <button 
                    className="text-white text-sm hover:text-red-400 mt-2"
                    onClick={handleAccept}
                >
                    Accept
                </button>
                <button 
                    className="text-white text-sm hover:text-red-400 mt-2"
                    onClick={handleRefuse}
                >
                    Refuse
                </button>
                <button 
                    className="text-white text-sm hover:text-red-400 mt-2"
                    onClick={handleBlock}
                >
                    Block
                </button>
            </div>
            )}
        </div>
        <h1 className="mt-2 text-sm">{request.first_user.name}</h1>
            {request.first_user?.inGame ? (
                        <p className="mt-4 font-sans italic">inGame</p>
            ): (
                        <p className="mt-4 font-sans italic">{request.first_user?.onLine ? 'on line':"off line"}</p>
            )}
        </div>
    </>)
}
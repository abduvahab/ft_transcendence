import React, { useEffect, useRef, useState } from 'react';
import '../../css/chat.css';
import search from '../../assets/search.png';
import group_avatar from '../../assets/group_avatar2.png';
import "../../css/createChanal.css"
import { toast } from 'react-toastify';
import { authService } from '../../server/authService';
import { useAppSelector } from '../../store/hooks';

function Search (props:any){
  const {groupChat,socket}=props

  const userdata = useAppSelector((state)=>state.isAuth.user)
  const [password, setPassword] = useState<string>("")
  const [isProtected, setIsProtected] = useState<boolean>(false)

  const joinProtectedChanals=async()=>{
    if(password !== ""){
      try{
        const data = await authService.joinProtectedGroup(+groupChat.id,password)
        if(data){
          socket.emit("joinGroup",{join:userdata?.id,chatId:+groupChat.id})
          toast.success(data.message)
        }else{
          toast.error("join failed")
        }
      }
      catch(error:any){
        const err = error.response?.data.message;
        toast.error(err.toString())
      }
      handleCancel()
    }
  }
  const handleCancel=()=>{
    setIsProtected(false);
    setPassword("")
  }

  const handleJoin=async()=>{
    if(groupChat.type === "protected"){
      setIsProtected(true)
    }
    else{
      try{
        const data = await authService.joinPublicGroup(+groupChat.id)
        if(data){
          socket.emit("joinGroup",{join:userdata?.id,chatId:+groupChat.id})
          toast.success(data.message)

        }else{
          toast.error("join failed")
        }
      }
      catch(error:any){
        const err = error.response?.data.message;
        toast.error(err.toString())
      }
    }
  }


  return (
  <>

    <div className="userChatC justify-between">
      <div className='flex items-center justify-center'>
        <img className='imageC' src={group_avatar} alt="" />
        <div className='userChatInfoC ml-2'>
            <h1>{groupChat.name}</h1>
        </div>
      </div>
      <button
        className='bg-green-500 text-white text-lg py-1 px-2 items-center justify-center rounded-md'
        onClick={handleJoin}
      >
        join
      </button>

      {isProtected && <div className="CreateChanalOverlay"></div>}
      {isProtected && 
        <div className='CreateChanal items-center justify-center' >
            <div className="CreateChanal_top px-10 py-2 text-bold text-lg flex items-center justify-center">join chanal</div>
            <span className='ml-2'>password</span>
            <input 
                className="px-2 ml-1 py-1 mt-2 mr-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:shadow-outline-blue mb-2"
                type="password"
                value={password}
                placeholder="..."
                onChange={(e)=>setPassword(e.target.value)}
            />
            <div className="flex justify-around mt-3 mb-2">
                <button className="px-2 py-2 bg-green-500 rounded-lg " onClick={handleCancel}>cancel</button>
                <button className="px-2 py-2 bg-green-500 rounded-lg ml-10" onClick={joinProtectedChanals}>join</button>
            </div>
        </div> 
      } 
    </div>
  </> 
  );
};

export default Search;

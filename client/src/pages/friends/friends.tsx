import React, { useEffect } from 'react';
import { useState } from "react";
import '../../css/friendsPage.css';
import banner from '../../assets/cover.svg';
import icon from '../../assets/icon.png';
import search from '../../assets/search.png';
import left from '../../assets/left.png';
import right from '../../assets/right.png';
import { useAppSelector } from '../../store/hooks';
import { Block, Friend } from '../../types/types';
import { authService } from '../../server/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Show_Friend } from './components/friend';
import { Show_Block } from './components/block';
import { Show_Request } from './components/request';









export function FriendsPage(props:any){
    const {socket} = props
    const showNumber=5
    const [friends, setFriends] = useState<Friend[]>([])
    const [blocks, setBlocks] = useState<Block[]>([])
    const [requests, setRequests] = useState<Friend[]>([])
    const userdata = useAppSelector((state)=>state.isAuth.user)
    const [friendName, setfriendName] = useState<string>("")

    const [startRequest, setStartRequest]=useState<number>(0)
    const [startBlock, setStartBlock]=useState<number>(0)
    const [startFriend, setStartFriend]=useState<number>(0)
    const navigate = useNavigate()

    useEffect(()=>{

        socket.on("haveRequest",()=>{
            getAllRequests()
        })
        return () => {
            socket.off("haveRequest");
          };
    },[socket])

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
            toast.error("have problem detting data!")
        }
    }

    useEffect(()=>{
        
        try{
            getAllFriends();
            getAllBlocks();
            getAllRequests();
           

        }catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())

        }

    },[])

    const handleSearch= async(e:any)=>{
        e.preventDefault()
        if(friendName){
            try{
                const data= await authService.getUserByUserName(friendName)
                if(data)
                    navigate(`/friends/profile/${data.id}`)
                else
                    toast.error("the user no exist")
            
            }catch(error:any){
                const err = error.response?.data.message;
                toast.error(err.toString())

            }
        }
    }



    //for friend
    const leftClick_friend=()=>{
        if(startFriend > 0){
            setStartFriend(startFriend-showNumber)
        }
    }

    const rightClick_friend=()=>{
        if(startFriend < friends.length-showNumber){
            setStartFriend(startFriend+showNumber)
        }
    }

// for block
    const leftClick_block=()=>{
        if(startBlock > 0){
            setStartBlock(startBlock-showNumber)
        }
    }

    const rightClick_block=()=>{
        if(startBlock < friends.length-showNumber){
            setStartBlock(startBlock+showNumber)
        }
    }

    //for request
    const leftClick_request=()=>{
        if(startRequest > 0){
            setStartRequest(startRequest-showNumber)
        }
    }

    const rightClick_request=()=>{
        if(startBlock < friends.length-showNumber){
            setStartRequest(startRequest+showNumber)
        }
    }

    return (
    <>
      <div className="friendsPage flex-col min-h-screen">
        <div className="relative mb-2">
          <div>
            <img src={banner} className="bannerF" />
          </div>
          <img className="iconF rounded-full " src={userdata?.avatar ?(userdata?.avatar): icon} alt="User icon" />
          <div className="nameF block">{userdata?.name}</div>
        </div>
        <div className="flex  justify-end mr-5 font-sans italic">
          <form className='' onSubmit={handleSearch}>
            <label>
              SearchFriend :            
            </label>
            <input
            className="input ml-2 "
            type="text"
            name="name"
            value={friendName}
            placeholder='username ...'
            onChange={(e)=>setfriendName(e.target.value)}
            />
            <button type='submit' className='ml-2'>
                <img className='w-5 h-5'  src={search}/>
            </button>

          </form>
        </div>
        <div>
          <div className=" historyF ml-5 mt-20 flex justify-between">
            <h1>Friend Requests</h1>
            <div className='flex'>
                <img onClick={leftClick_request} className='w-10' src={left}/>
                <img onClick={rightClick_request} className='w-10' src={right}/>
            </div>
          </div>
            <div className="separatorF"></div>
        </div>

        <div className="flex">
            {requests.length !=0 ?
            (requests.slice(startRequest,startRequest+showNumber).map((request) => (
                <Show_Request 
                    request={request} 
                    setRequests={setRequests} 
                    setFriends={setFriends}
                    setBlocks={setBlocks}
                />
            ))):(
                <h1 
                className='ml-10 text-black text-5xl px-5 py-5 font-serif'
                >
                    you have no friend requests
                </h1>
            )}
        </div>

        <div>
          <div className="historyF ml-3 mt-5 flex justify-between">
            <h1>FriendShips</h1>
            <div className='flex'>
                <img onClick={leftClick_friend} className='w-10' src={left}/>
                <img onClick={rightClick_friend} className='w-10' src={right}/>
            </div>
          </div>
            <div className="separatorF"></div>
        </div>
        {/* <div className="h-15 bg-sky-600"></div> */}
        <div className="flex">
          {friends.length != 0 ?
          (friends.slice(startFriend,startFriend+showNumber).map((friend) => (
            <Show_Friend 
                friend={friend.first_user.id ===userdata?.id ?friend.second_user : friend.first_user}
                setFriends={setFriends}
                setBlocks={setBlocks}
                socket={socket}
            />
            
            ))):(
                
            <h1 
            className='ml-10 text-black text-5xl px-5 py-5 font-serif'
            >
                you have no friends
            </h1>
          )}

        </div>


        <div>
          <div className="historyF ml-3 mt-5 flex justify-between">
            <h1>Block</h1>
            <div className='flex'>
                <img onClick={leftClick_block} className='w-10' src={left}/>
                <img onClick={rightClick_block} className='w-10' src={right}/>
            </div>
          </div>
            <div className="separatorF"></div>
        </div>
        {/* <div className="h-15 bg-sky-600"></div> */}
        <div className="flex">
            {blocks.length != 0 ?
            
            (blocks.slice(startBlock,startBlock+showNumber).map((block) => (
                <Show_Block block={block.blocked_user} setBlocks={setBlocks}/>
            ))):(
                <h1 
                className='ml-10 text-black text-5xl px-5 py-5 font-serif'
                >
                    you have no blocked user
                </h1>
            )}
        </div>

      </div>
    </>
  );
};
















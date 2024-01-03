import React, { useEffect, useRef, useState } from 'react'
import Search from './Search'
import Navbar from './Navbar'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useNavigate } from 'react-router-dom'
import { ChatMemeber, GroupChat } from '../../types/types'
import { authService } from '../../server/authService'
import { setCreatedChanal, setGroupChatId, setGroupChatIdUndefined } from '../../store/user/userSlice'
import { toast } from 'react-toastify'
import { ListChanals } from './listChanals'
import { CreateChanal } from './createChanal'
import "../../css/createChanal.css"
import search from '../../assets/search.png'
import '../../css/chat.css';
import { setGroupChatId_thunk } from '../../store/thunk/actions'



function Channels(props:any){

    const {socket} = props
    const [ChatMemebers, setChatMemebers] = useState<ChatMemeber[]>([])
    const [s_groups, setS_groups] = useState<GroupChat[]>([])
    const [isCreate, setIsCreate] = useState<boolean>(false)
    const [isSearch, setIsSearch] = useState<boolean>(false)
    const [s_value, setS_value] = useState<string>("")
    const [no_value, setNo_value] = useState<string>("")
    const groupChatId = useAppSelector((state)=>state.isAuth.groupChatId)
    const createdChanal = useAppSelector((state)=>state.isAuth.createdChanal)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const showCreate = () => {
        setIsCreate(true);
    };

    const getAllGroupChatByUserId=async ()=>{
        try{
            const data = await authService.getAllGroupChatByUserId()
            if(data){
                setChatMemebers(data)
                if(data.length > 0 && (!groupChatId )){
                    dispatch(setGroupChatId_thunk(data[0].chat.id))
                }
            }
            else{
            navigate("/errorPage")
            }
            // toast.success("you have blocked the user")
        }
        catch(error:any){
            navigate("/errorPage")
            // const err = error.response?.data.message;
            // toast.error(err.toString())
        }
    }

    const handleSearch= async()=>{
        if(s_value !== "")
        {
            setNo_value("")
            setIsSearch(true)
            try{
                const data = await authService.searchGroupByName(s_value)
                if(data){
                    if(data.length === 0){
                        setNo_value("no groups fond")
                    }
                    else{
                        setS_groups(data)
                    }
                }
                else{
                    setIsSearch(false)
                    setS_value("")
                    toast.error("happened error")
                }
            }
            catch(error:any){
                setIsSearch(false)
                setS_value("")
                const err = error.response?.data.message;
                toast.error(err.toString())
            }
            

        }

    }
    const handleClear= async()=>{
        if(isSearch){
            setS_value("")
            setNo_value("")
            setS_groups([])
            setIsSearch(false)
        }
    }

    useEffect(()=>{
        if(createdChanal){
            getAllGroupChatByUserId()
            dispatch(setCreatedChanal())
        }

        socket.on("haveBeenKicked1",()=>{
            dispatch(setGroupChatIdUndefined())

        })
        socket.on("haveSetBan",()=>{
            dispatch(setGroupChatIdUndefined())

        })
        socket.on("haveUnSetBan",()=>{
          
            getAllGroupChatByUserId()
        })

        return ()=>{
            socket.off("haveBeenKicked1")
            socket.off("haveSetBan")
            socket.off("haveUnSetBan")
        }
    },[groupChatId,createdChanal,socket])

    useEffect(()=>{
        getAllGroupChatByUserId()
    },[groupChatId,isSearch])

    useEffect(()=>{
        getAllGroupChatByUserId()
    },[])


    return (
        <div>
                {isCreate && <div className="CreateChanalOverlay"></div>}
                <div>
                    <button
                        className='flex bg-green-500 text-white py-2 w-full items-center justify-center'
                        onClick={showCreate}
                    >
                        create
                    </button>
                    {isCreate && 
                        <CreateChanal setIsCreate={setIsCreate}/>
                    }
                </div>
                <div className='flex mt-1'>
                    {/* <Search /> */}
                    <div className='searchC w-2/3'>
                        <div className='searchFormC'>
                            <input 
                                className='inputC ' 
                                placeholder='Find a group'
                                value={s_value}
                                type="text"
                                onChange={(e)=>setS_value(e.target.value)}
                            />
                        </div>
                    </div>
                    <button  
                        className='ml-2 px-1 py-1'
                        onClick={handleSearch}
                    >
                        <img className='w-10 h-7'  src={search}/>
                    </button>
                    <button  
                        className='ml-1 bg-green-500 text-white py-1 w-full items-center justify-center'
                        onClick={handleClear}
                    >
                        clear
                    </button>
                </div>
         {
            !isSearch && 

            <div className='chatsC'>
                {ChatMemebers.map((chatMemeber:ChatMemeber)=>(
                    <ListChanals groupChat={chatMemeber.chat}/>
                ))} 
            </div>
         }
         {
            isSearch &&
            <div className='chatsC'>
                {s_groups.length !==0 && s_groups.map((groups:GroupChat)=>(
                    <Search groupChat={groups} socket={socket}/>
                ))} 
                {s_groups.length ===0 &&
                    <span>{no_value}</span>
                } 
            </div>
         }     
        </div>
    );
};

export default Channels
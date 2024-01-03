
import { authService } from '../../server/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useEffect, useState } from 'react';
import { ChatMemeber } from '../../types/types';
import group_avatar from '../../assets/group_avatar2.png';
import GroupMember from './groupMember';
import "../../css/createChanal.css"
import { setGroupChatIdUndefined } from '../../store/user/userSlice';
import { setGroupChatIdUndefined_thunk } from '../../store/thunk/actions';

function Group_Rightbar (props:any) {

    const {socket} = props
    const navigate = useNavigate()
    const userdata = useAppSelector((state)=>state.isAuth.user)
    const groupChatId = useAppSelector((state)=>state.isAuth.groupChatId)
    const [ChatMemebers, setChatMemebers] = useState<ChatMemeber[]>([])
    const [member,setMemeber] = useState<ChatMemeber>()
    const [isPassword, setIsPassword] = useState<boolean>(false)
    const [isSet, setIsSetet] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")
    const dispatch = useAppDispatch()





    const getAllChatmember=async ()=>{
        try{
            // console.log("getAllChatmember")
            if(groupChatId){
                const data = await authService.getAllChatmember(groupChatId)
                if(data){
                    setChatMemebers(data)
                }
                else{
                navigate("/errorPage")
                }
                // toast.success("you have blocked the user")
            }
        }
        catch(error:any){
            navigate("/errorPage")
            // const err = error.response?.data.message;
            // toast.error(err.toString())
        }
    }
    const getOneChatmember = async ()=>{
        try{
            if(groupChatId){
                const data = await authService.getOneChatmember(groupChatId)
                if(data){
                    setMemeber(data)
                }
                else{
                navigate("/errorPage")
                }
            // toast.success("you have blocked the user")
            }
        }
        catch(error:any){
            navigate("/errorPage")
            // const err = error.response?.data.message;
            // toast.error(err.toString())
        }
    }

    const handleLeave = async()=>{
        try{
            if(member){
                const data = await authService.leaveGroup(member.chat.id)
                if(data){
                    dispatch(setGroupChatIdUndefined_thunk())
                    socket.emit("leaveGroup",{chatId:+member.chat.id,user:+member.user.id})
                    toast.success(data.message)
                }
                else{
                    toast.error("leave from group faild")
                }
            }
        }catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }

    }
    const handleSetPublic = async()=>{
        try{
            if(member && groupChatId){
                const data = await authService.setPublic(member.chat.id)
                if(data){
                    socket.emit("setPublic",{chatId:+member.chat.id})
                    toast.success(data.message)
                }
                else{
                    toast.error("set public failed")
                }
            }
        }catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }

    }
    const handleResetPassword = async()=>{
        setIsPassword(true)
        setIsSetet(false)
    }
    const handleSetProtected = async()=>{
        setIsPassword(true)
        setIsSetet(true)


    }



    const handlePassword=async ()=>{
        try{

            if(password !== '' && member){
                if(isSet){
                    const data = await  authService.changePublicToProtected(member.chat.id,password)
                    if(data)
                    {
                        socket.emit("setProtected",{chatId:+member.chat.id})
                        toast.success(data.message)
                    }
                }
                else{
                    const data = await  authService.resetPassWordToProtected(member.chat.id,password)
                    if(data)
                    {
                        toast.success(data.message)
                    }
                }
                handleCancel()
            }
            
        }catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }

    }



    const handleCancel=()=>{
        setIsPassword(false);
        setPassword("")
    }

    useEffect(()=>{

            socket.on("haveJoinedGroup",()=>{
                getAllChatmember()
            })
    
            socket.on("haveLeftGroup",()=>{
                getAllChatmember()
            })

            socket.on("haveSetPublic",()=>{
                getOneChatmember()
            })

            socket.on("haveSetProtected",()=>{
                getOneChatmember()
            })

            socket.on("haveSetAdmin",()=>{
                getOneChatmember()
            })
            socket.on("haveBeenKicked2",()=>{
                getAllChatmember()
            })


        return ()=>{
            socket.off("haveJoinedGroup")
            socket.off("haveLeftGroup")
            socket.off("haveSetPublic")
            socket.off("haveSetProtected")
            socket.off("haveSetAdmin")
            socket.off("haveBeenKicked2")
        }
    },[groupChatId,socket])


    useEffect(()=>{
            getAllChatmember()
            getOneChatmember()
    },[groupChatId])


    return (

    <>
        {groupChatId ?(
        <div className='sidebarC flex-col overflow-auto'>

            {/* for name group and other configeration(left, setpassword...) */}

            <div >
                <div className='felx-col'>
                    <div className='flex items-center justify-center'>
                        <img className='w-1/2  mt-1' src={group_avatar} alt="" />
                    </div>
                    <div className=''>
                        {/* <span>Channels 2</span> */}
                        <h1 className='flex items-center justify-center mt-1 text-black text-bold text-lg'>{member?.chat.name}</h1>
                    </div>
                </div>
                {/* buttons */}
                <div className='flex gap-1 mt-1'>
                    <button 
                        className='ml-1 px-1 py-1 bg-green-500 rounded-lg'
                        onClick={handleLeave}
                    >
                        leave
                    </button>
                    {(member?.isAdmin  || member?.isCreator) &&
                        <>
                        {
                            member.chat.isProtected &&
                            <>
                                <button 
                                    className='px-1 py-1 bg-green-500 rounded-lg'
                                    onClick={handleSetPublic}
                                >
                                    set public
                                </button>
                                <button 
                                    className='mr-1 px-1 py-1 bg-green-500 rounded-lg'
                                    onClick={handleResetPassword}
                                >
                                    reset Password
                                </button>
                            </>
                        }
                        {
                            !member.chat.isProtected &&
                            <>
                                <button 
                                    className='mr-1 px-1 py-2 bg-green-500 rounded-lg'
                                    onClick={handleSetProtected}
                                >
                                    set Protected
                                </button>
                            </>
                        }
                        </>

                    }


                </div>
                {/* boundary */}
                <div className='w-full border mt-1'></div>
                {/* for password reset and set password for public chat */}

                {isPassword && <div className="CreateChanalOverlay"></div>}
                {isPassword && 
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
                            <button className="px-2 py-2 bg-green-500 rounded-lg ml-10" onClick={handlePassword}>submit</button>
                        </div>
                    </div> 
                } 



            </div>

            {/* print the members in group  */}

            <div>
                {ChatMemebers.map((chat_member)=>(
                    <GroupMember chat_member={chat_member} member={member} socket={socket}/>
                ))}
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

export default Group_Rightbar
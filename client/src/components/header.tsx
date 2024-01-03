
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png'
import '../css/header.css'
import { useAppSelector } from "../store/hooks";
import ProfileButton from "./profileButton";
import { useEffect, useState } from "react";
import { IUser } from "../types/types";
import { authService } from "../server/authService";
import icon from '../assets/icon.png';
import { toast } from "react-toastify";



export function Header (props:any){
    const {socket} = props
    const isAuth = useAppSelector((state)=>state.isAuth.isAuth)
    const userdata = useAppSelector((state)=>state.isAuth.user)
    const [showOptions, setShowOptions] = useState(false);
    const [fiend, setFriend] = useState<IUser>();
    const navigate = useNavigate()

    const getFriend = async(data:any)=>{
        const one  =await authService.getUserById(+data.from)
        setFriend(one)
    }

    useEffect(()=>{

        if(isAuth && socket){
            socket.on("haveInvitationToGame",(data:any)=>{
                // console.log("invitation",data.from)
                setShowOptions(true)
                getFriend(data)
            })
            socket.on("haveBeenRefused",()=>{
                console.log("you have been refused")
                navigate('/')
                toast.error("you have been refused")
            })
        }

    },[socket,isAuth])

    const handleRefuse=async()=>{
        socket.emit("refuseINvitation",{to:userdata?.id,from:fiend?.id})
        setShowOptions(false)
        setFriend(undefined)
    }

    const handleAccepte=async()=>{
        if(fiend){
            const queryParams ={frind_id:fiend.id+'', owner:'no',accecpt:'yes'}
            setShowOptions(false)
            setFriend(undefined)
            navigate(`/game?${new URLSearchParams(queryParams).toString()}`) 
        }
    }

    return(
        <>
        <div className="flex justify-between ">
            <div className='navbar'>
                <img src={logo} alt="Logo" />
                <h1>Pong Game</h1>
            </div>
            {isAuth && (<nav className="buttons gap-8">
                    <div>
                        <Link to="/">Home</Link>
                    </div>
                    <div>

                        <Link to="game">Game</Link>
                        {/* <Link to="/login">login</Link> */}
                    </div>
                    <div>
                        <Link to="chat">Chat</Link>
                    </div>
                    <div  className="friend flex items-center jutify-center">
                        <Link to="friends">
                            Friend
                        </Link>
                        <div className="dot">
                        </div>
                </div>

            </nav>)}
            {isAuth &&(<ProfileButton socket={socket}/>)}
            {isAuth && showOptions && <div className="CreateChanalOverlay"></div>}
            {isAuth &&showOptions && 
                <div className='CreateChanal items-center justify-center' >
                    <div className="CreateChanal_top px-10 py-2 text-bold text-lg flex items-center justify-center">Note</div>
                    <div className="mt-3 ml-2 mr-2 flex">
                        <p className=""> You have invitation from user {fiend?.name}</p>
                        <img className='invitation_imageC ' src={fiend?.avatar ? fiend?.avatar : icon} alt="" />
                    </div>
                    <div className="flex justify-around mt-3 mb-2">
                        <button className="px-2 py-2 bg-green-500 rounded-lg " onClick={handleRefuse}>refuse</button>
                        <button className="px-2 py-2 bg-green-500 rounded-lg ml-10" onClick={handleAccepte}>accepte</button>
                    </div>
                </div> 
            } 
    </div>
        </>
    );
}
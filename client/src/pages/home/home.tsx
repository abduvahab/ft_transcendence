import { FC, useEffect, useState} from "react";
// import { useAppSelector } from "../store/hooks";
import '../../css/homePage.css'
import banner from '../../assets/cover.svg'
import icon from '../../assets/icon.png'
// import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import left from '../../assets/left.png';
import right from '../../assets/right.png';
import { G_History } from "../../types/types";
import { authService } from "../../server/authService";
import { toast } from "react-toastify";
import { GameHistory } from "./gameHistory";
import { getUserdata } from "../../store/thunk/actions";



export const Home:FC = ()=>{

    const userdata = useAppSelector((state)=>state.isAuth.user)
    const dispatch = useAppDispatch()
    const showNumber=5
    const [startHistory, setStartHistory]=useState<number>(0)
    const [Histories, setHostories] = useState<G_History[]>([])

        //for friend
    const leftClick_friend=()=>{
        if(startHistory > 0){
            setStartHistory(startHistory-showNumber)
        }
    }

    const rightClick_friend=()=>{
        if(startHistory < Histories.length-showNumber){
            setStartHistory(startHistory+showNumber)
        }
    }

    const getAllHistories=async()=>{

        const data=await authService.getAllHistories()
        if(data){
            // console.log("Histories",data)
            setHostories(()=>data)
        }
        else{
            toast.error("have problem getting history!")
        }
    }

    useEffect(()=>{
        getAllHistories()
        dispatch(getUserdata())
        
    },[])

    return(<>
    <div className="homePage flex-col">
        <div className="relative mb-5">

            <div className="">
                <img src={banner} className='banner'/>
            </div>
            {/* <div className="absolute"> */}
                <img className="icon rounded-full " src={userdata?.avatar ?(userdata?.avatar): icon}/>
            {/* </div> */}
            <div className="name block">{userdata?.username}</div>
            <div className="name block mb-12">{userdata?.name}</div>

        </div>
        <div className="h-20 bg-sky-600 "></div>
        <div className="flex justify-between mt-15">
            {/* <div className="flex justify-center flex items-center m-4 h-48 w-48 bg-blue-900 rounded-3xl flex flex-col">
                <div className="mt-4">Rank</div>
                <div className="number mt-4">{userdata?.rank}</div>
            </div> */}
            <div className="flex justify-center flex items-center m-4 h-48 w-48 bg-blue-900 rounded-3xl flex flex-col">
                <div className="mt-4">Matches Played</div>
                <div className="number mt-4">{userdata?.matchs}</div>
            </div>
            <div className="flex justify-center flex items-center m-4 h-48 w-48 bg-blue-900 rounded-3xl flex flex-col">
                <div className="mt-4">Wins</div>
                <div className="number mt-4">{userdata?.wins}</div>
            </div>
            <div className="flex justify-center flex items-center m-4 h-48 w-48 bg-blue-900 rounded-3xl flex flex-col">
                <div className="mt-4">Lost Matches </div>
                <div className="number mt-4">{userdata?.lose}</div>
            </div>
        </div>
        <div className="flex justify-between">
            <div className="History ml-5 mt-3">
                <h1>History</h1>
            </div>
            <div className='flex mr-5'>
                <img onClick={leftClick_friend} className='w-10' src={left}/>
                <img onClick={rightClick_friend} className='w-10' src={right}/>
            </div>
        </div>
        <div className="mt-5 mb-5">
        {
            Histories.length != 0 ? (
                Histories.slice(startHistory,startHistory+showNumber).map((message:G_History)=>(
                    <GameHistory my_history={message} />
                ))
            ):(
            <>
                <div className="separatorF"></div>
                <h1 
                    className='ml-10 text-black text-5xl px-5 py-5 font-serif'
                >
                    you have no game histories
                </h1>

            </>
            )
        }
        </div>
        <div className="separatorF"></div>
    </div>
    </>);
}
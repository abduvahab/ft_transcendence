import { FC } from "react";
import './css/game.css'
import { useNavigate } from 'react-router-dom';

export const Game:FC = ()=>{

    const navigate = useNavigate()

    const PongGame = ()=>{
        navigate('/ponggame')
      }
      
    return(
    <>
    <div className="flex justify-center items-center h-screen">
        <button 
            className="button-search"
            onClick={PongGame}
            >
            Search Player
        </button>
    </div>
    
    </>
    );
}
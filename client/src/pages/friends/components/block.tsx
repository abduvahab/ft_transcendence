import { useEffect, useRef, useState } from 'react';
import icon from '../../../assets/icon.png';
import { authService } from '../../../server/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


export function Show_Block(props:any){
    const {block,setBlocks} = props
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null);
    const navigate= useNavigate()
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
    const handleUnBlock=async ()=>{
        try{
            await authService.unBlockUser(+block.id)
            // navigate("/friends")
            getAllBlocks()
            toast.success("you unblocked user")
        }
        catch(error:any){
        const err = error.response?.data.message;
        toast.error(err.toString())

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
            <img className="rounded-full w-16 h-16" src={block.avatar ?(block.avatar): icon} alt={"Icon "} onClick={showSelect} />
            {showOptions && (
            <div className="options absolute top-0 left-0 mt-2 ml-2 bg-gray-800 p-2 rounded">
                <button 
                    className="text-white text-sm hover:text-red-400 mt-2"
                    onClick={handleUnBlock}
                >
                    unblock
                </button>
            </div>
            )}
        </div>
        <h1 className="mt-2 text-sm">{block.name}</h1>
            {block?.inGame ? (
                        <p className="mt-4 font-sans italic">'inGame'</p>
            ): (
                        <p className="mt-4 font-sans italic">{block?.onLine ? 'on line':"off line"}</p>
            )}
        </div>
    </>)
}
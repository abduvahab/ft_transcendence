import { useEffect, useRef, useState } from "react";
import "../../css/createChanal.css"
import { authService } from "../../server/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { haveCreatedChanal } from "../../store/user/userSlice";


export function CreateChanal (props:any){

    const {setIsCreate}=props
    const [name, setName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [type, setType] = useState<string>("public")
    const [isProtected, setIsProtected] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    useEffect(()=>{
        if(type === "protected")
        {
            setIsProtected(true)
        }
        else{
            setIsProtected(false)
        }
    },[type])

    const handleSubmit=async(e:any)=>{
        e.preventDefault()
        let data
        try{
            if(type === "protected"){
                data = await authService.createProtectedGroup({type:type,name:name,password:password})
            }
            else{
                data = await authService.createPublicGroup({type:type,name:name})
            }
            if(data){
                dispatch(haveCreatedChanal())
                toast.success(data.message)
                setIsCreate(false)
                
            }
        }catch(error:any){
            setIsCreate(false)
            const err = error.response?.data.message;
            toast.error(err.toString())
        }


    }
    const handleCancel=async(e:any)=>{
        e.preventDefault()
        setIsCreate(false)
    }


    return <>
            
        <div className="CreateChanal" > 
            <div className="CreateChanal_top px-10 py-2 text-bold text-lg">Create Chanal</div>
            <form 
                className=" px-3 py-3"
                onSubmit={handleSubmit}
            >
                <label 
                   className="text-bold text-lg"
                >
                    Name
                </label>
                <input 
                    className="px-2 ml-1 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:shadow-outline-blue mb-2"
                    type="text"
                    value={name}
                    placeholder="Name the chanal..."
                    onChange={(e)=>setName(e.target.value)}
                /><br/>
                <label 
                   className="text-bold text-lg" 
                >
                    type
                </label>
                <select name="type" className="px-2 ml-1 py-1 mb-2" onChange={(e)=>setType(e.target.value)}>
                    <option value="public">Public</option>
                    <option value="protected">protected</option>
                </select><br/>
                {
                    isProtected &&<>
                        <label 
                            className="text-bold text-lg"
                        >
                            password
                        </label>
                        <input 
                            className="px-2 ml-1 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:shadow-outline-blue mb-2"
                            type="password"
                            value={password}
                            placeholder="..."
                            onChange={(e)=>setPassword(e.target.value)}
                        /><br/>
                    </>

                }
                <div className="flex justify-between mt-3">
                    <button className="px-2 py-2 bg-green-500 rounded-lg ml-10" onClick={handleCancel}>cancel</button>
                    <button className="px-2 py-2 bg-green-500 rounded-lg ml-10" type="submit">create</button>
                </div>

                
            </form>
        </div>
    </>

}
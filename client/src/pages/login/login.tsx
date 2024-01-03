import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {clearCookie,getCookieValue} from '../../helpers/cookies.helper'
import { setIsAuth, setToken } from "../../helpers/localStore.helper";
import { authService } from "../../server/authService";
import { login} from "../../store/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import './login.css'
import { toast } from "react-toastify";




export const Login:FC = ()=>{
// export function Login (){

    const url = import.meta.env.VITE_LOCAL+"/auth/42"
    const [a_token, setA_token] = useState<string>('');
    const dispath = useAppDispatch()
    const isAuth = useAppSelector((state)=>state.isAuth)
    const navigate = useNavigate()
    
    useEffect(()=>{
        const myCookieValue = getCookieValue("token");
        if (myCookieValue){
            //first time login 
            setA_token(myCookieValue)
            clearCookie('token')
        }
  
        if(isAuth){
            // when the user have already logged  in 
            navigate('/');
        }

    })

    const getTwoFa_value= async ():Promise<boolean | undefined>=>{
        try{
            const data =await authService.getUserProfile()
            if(data){
                // dispath(save_user(data))
                if(data.twoFAenabled){
                    // dispath(checked_twoFa())
                    return true;
                }
                return false

            }
        }catch(error:any){
            const err = error.response?.data.message
            toast.error(err.toString())

//***have to deale the error message
        }
    }

    useEffect(()=>{
        if (a_token)
        {
            setToken(a_token)
            getTwoFa_value().then((twoFaEnabled)=>{

                //check the two factor authoritation
                if(twoFaEnabled)
                {
                    // if twoFAenable is true , go to authentifiaction 
                    navigate('/twoFa')
                }else{
                    //if twoFAenable is false log in
                    setIsAuth("on");
                    dispath(login())
                    navigate('/');
                }
            })
    
        }
    },[a_token])




    

    return(<>
        <div className="min-h-75vh flex items-center justify-center  ">
            <div className="bg-sky-500 py-2 px-4 rounded-lg hover:bg-sky-700">
                {/* <a href=http://localhost:3000/auth/42"> */}
                <a href={url}>
                    login with 42
                </a>
            </div>
        </div>
    </>);
}

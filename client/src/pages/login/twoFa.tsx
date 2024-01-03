import axios, { GenericHTMLFormElement } from "axios";
import React,{ useEffect, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setToken } from "../../helpers/localStore.helper";
import { useAppDispatch } from "../../store/hooks";
import { login } from "../../store/user/userSlice";
import { getUserdata } from "../../store/thunk/actions";


export function TwoFa_Auth(props:any){


    const url = import.meta.env.VITE_LOCAL1
    const { setIslogin,setTwoFa,a_token}=props;
    
    const [code, setCode] = useState<string>('')
    const [dataUrl, setdataUrl] = useState<string>('')
    const init_time = 180
    const [time, setTime] = useState<number>(init_time)
    const [timer, setTimer] = useState<any>(0)
    const dispath = useAppDispatch()
    const navigate = useNavigate()

    const getQrcodde=async ()=>{
        // console.log("twoFa",a_token)
        try{
            const {data}= await axios.create({
                // baseURL:'http://localhost:3000',
                baseURL:url,
                headers:{
                    // Authorization: 'Bearer '+ getToken() || null
                    Authorization:`Bearer ${a_token}` || ""
                },
            }).get('user/qr')
            if(data){
                const dataUrl = ("data:image/svg+xml;base64," + btoa(data))
                setdataUrl(dataUrl)
            }
            else{
                toast.error('try again to get another QR code')
            }

        }catch(err:any){
            toast.error('try again to get another QR code')
        }
    }


    useEffect(()=>{
        // getQrcodde()
    },[])

    const handleSend= async (e:React.FormEvent<GenericHTMLFormElement>)=>{
        e.preventDefault()
        try{
            const {data}= await axios.create({
                baseURL:url,
                headers:{
                    // Authorization: 'Bearer '+ getToken() || null
                    Authorization:`Bearer ${a_token}` || ""
                },
            }).post('user/qr',{twoFAsecret:code})
            if(data){

                setToken(a_token)
                dispath(login())
                dispath(getUserdata())
                setIslogin(true)
                setTwoFa(false)
                toast.success('you logged in')
                navigate('/')
            }
            else{
                toast.error('try again to get another QR code')
            }

        }catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
            setCode('')
        }

    }
    const getAnotherCode=()=>{
        if(time <= 0){
            setTime(init_time)
            getQrcodde()
            // countTime()
        }
        else
        {
            toast.error(`you have to try it after ${time} second!`)
        }
    }

    // useEffect(()=>{
    //     if(time <=0)
    //         clearInterval(timer)
    // },[time])

    // const countTime=()=>{
    //     let timer = setInterval(()=>{
    //         setTime((time)=>time-1)
    //         setTimer(timer)
    //     },1000);
    //     return ()=>{
    //         clearInterval(timer)
    //     }
    // }
    
    // useEffect(()=>{
    //     let timer = setInterval(()=>{
    //         setTime((time)=>time-1)
    //         setTimer(timer)
    //     },1000);
    //     return ()=>{
    //         clearInterval(timer)
    //     }
    // },[])

    return (
        <>
            <div className="flex flex-col items-center justify-center mx-auto">
                    {/* <img className="my-5 w-1/2 items-center justify-center border-black border-8" src={dataUrl} alt="qr"></img> */}
                <div>
                    <form
                        className="flex  items-center justify-center mx-auto"
                        onSubmit={handleSend}
                    >
                        <label htmlFor="code">CODE:</label>
                        <input 
                            type="text" 
                            id='code'
                            name="sms"
                            className="w-1/2 ml-1 text-black"
                            placeholder="code..."
                            value={code}
                            onChange={(e)=>setCode(e.target.value)}
                        />
                        <span className="ml-1 bg-sky-700 rounded-sm px-1 py-0.5" >
                            <button type="submit" >send</button>
                        </span>
                    </form>
                </div>
                <div className="ml-0.5 my-3">
                    <span>
                        you have left <span className="text-red-800">{time}</span> seconds
                    </span>
                    <span className="ml-10 bg-sky-700 rounded-sm px-1 py-1">
                            <button onClick={getAnotherCode}>code</button>
                    </span>
                </div>
            </div>
        </>
    );
}
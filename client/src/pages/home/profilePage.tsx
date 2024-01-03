import { FC, useState } from "react";
import React ,{ useEffect }from 'react';
import icon from '../../assets/icon.png'
// import '../../css/profilePage.css'
import { Form, Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { GenericHTMLFormElement } from "axios";
import { authService } from "../../server/authService";
import { toast } from "react-toastify";
import { getUserdata } from "../../store/thunk/actions";
import axios, { GenericHTMLFormElement } from "axios";
// import { toast } from "react-toastify";

export const ProfilePage:FC = () => {

    const userdata = useAppSelector((state)=>state.isAuth.user)
    const [file, setAvatar] = useState(null)
    // const [avatar] = useState(userdata?.avatar ? userdata?.avatar: null)
    const [name, setUsername] = useState(userdata?.name)
    const [email, setMail] = useState(userdata?.email)
    const [num, setNum] = useState("")
    const [checked, setChecked] =useState<boolean>(userdata?.twoFAenabled ? userdata?.twoFAenabled: false)
    const dispath = useAppDispatch()
    const navigate = useNavigate()
    const handleSubmit=async (e:React.FormEvent<GenericHTMLFormElement>)=>{
        try{
        e.preventDefault()
        const formData = new FormData();
        if(file != null){
            formData.append('file', file);
        }
        if(name)
        formData.append('name', name);
        if(email)
        formData.append('email', email);
        formData.append('twoFAenabled', String(checked));
          const data = await authService.updateUser(formData)
          console.log("data",data)
          if(data)
          {
            console.log("test11")
            dispath(getUserdata())
            navigate('/')
          }
          else{
            navigate('/errorPage')
          }
        }
        catch(error:any){
            const err = error.response?.data.message;
            toast.error(err.toString())
        }
    }

    const getQrcodde=async ()=>{
        // console.log("twoFa",a_token)

        try{
                const data = await authService.getQrCode()
            if(data){
                setNum(data.qr)
            }
            else{
                toast.error('try again to get another code')
            }

        }catch(err:any){
            toast.error('try again to get another  code')
        }
    }
    const handleFileChange = (e:any) => {
        const findAvatar = e.target.files[0];
        setAvatar(findAvatar);
    }

    const handleUsernameChange = (e:any) => {
        setUsername(e.target.value);
    }

    const handleMailChange = (e:any) => {
        setMail(e.target.value)
    }

    const TwoFacStatus = () => {
        setChecked(!checked)
        if(checked){
            
        }
    }

    useEffect(()=>{
        if(checked){
            getQrcodde()
        }
    },[checked])
    return(<>
        <div className="">
            <div className="flex flex-col items-center jutify-centermx-auto">
                <div className="mb-3 mt-8 ">
                    <img className="w-1/4 rounded-full items-center jutify-center mx-auto" src={userdata?.avatar ?userdata?.avatar:icon}/>
                </div>
                <form onSubmit={handleSubmit} encType="multipart/form-data" >
                    <div className="flex flex-col mt-2 space-y-5 ml-4">
                        <div className="ml-12">
                        <label className="">
                            Avatar:
                        </label>
                            <input type="hidden" name="avatar" value={userdata?.avatar} />
                            <input
                            className="ml-2"
                            type="file"
                            accept="*"
                            name="file"
                            onChange={handleFileChange}
                            />

                        </div>
                        <div className="ml-12">
                        <label>
                            nickName:
                        </label>
                        <input
                            className="input ml-2"
                            type="text"
                            name="name"
                            value={name}
                            onChange={handleUsernameChange}
                        />
                        
                        </div>
                        <div className="ml-12">
                        <label>
                            E-mail:
                        </label>
                        <input
                            className="input ml-2"
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleMailChange}
                        />
                      
                        </div>
                        <div className="ml-12">
                            TwoFa_Auth :
                            <input className="ml-3 cursor-pointer" type="checkbox" id="on" name="twoFA" value="on" checked={checked} onChange={TwoFacStatus}  />
                            <label className="ml-3" htmlFor="on">Active</label><br/>
                            {
                                checked && 
                                <>
                                    <span className="ml-3 text-red">{num}(keep the code , you will use after)</span>
                                </>
                            }
                            
                        </div>
                        <div className="flex justify-around">
                            <Link to='/' className="bg-blue-900 rounded-3xl px-1 mb-3"> Back</Link>
                            <button className="bg-blue-900 rounded-3xl px-1 mb-3" type="submit">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </>);
}
import React, { FC, useState, useEffect } from 'react';
import '../../css/loginPage.css'
import { Form, useNavigate } from 'react-router-dom';
import { authService } from '../../server/authService';
import { toast} from 'react-toastify';
import { GenericHTMLFormElement } from 'axios';
import { setToken } from '../../helpers/localStore.helper';
import { TwoFa_Auth } from './twoFa';
import { clearCookie, getCookieValue } from '../../helpers/cookies.helper';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, } from '../../store/user/userSlice';
import { getUserdata } from '../../store/thunk/actions';


const LoginPage:FC = () => {

  const [isLogin, setIslogin]=useState<boolean>(true);
  const [isSign, setIssign]=useState<boolean>(false);
  const [twoFa, setTwoFa]=useState<boolean>(false);
  const [a_token, setA_token] = useState<string>('');
  const isAuth = useAppSelector((state)=>state.isAuth.isAuth)
  const dispath = useAppDispatch()
  const navigate = useNavigate()
  
  useEffect(()=>{
    const my_token = getCookieValue("token");
    const my_twoFa = getCookieValue("twoFa");

    // check token in localStorage
    if(isAuth){
      // when the user have already logged  in 
      navigate('/');
    }
    if (my_token){
        //first time login 
        if(my_twoFa ==='on'){
          setA_token(my_token)
          setTwoFa(true)
          setIslogin(false)
        }
        else
        {
            // go to home page
            setToken(my_token)
            dispath(login())
            dispath(getUserdata())
            navigate('/')

        }

        clearCookie('token')
        clearCookie('twoFa')
    }

},[isLogin,isSign,twoFa,a_token])

  return (
    <>
    <div>
      {isLogin && <Login_com setIslogin={setIslogin}  setTwoFa={setTwoFa} setA_token={setA_token} setIssign={setIssign}/>}
      {isSign && <Signup_com setIslogin={setIslogin} setIssign={setIssign}/>}
      {twoFa && <TwoFa_Auth a_token={a_token} setIslogin={setIslogin}  setTwoFa={setTwoFa} />}
    </div>
    </>
  );
};



function Login_com(props:any){
  const { setIslogin,setTwoFa, setA_token, setIssign}=props;
  // const port1 = import.meta.env.PORT1
  const url = import.meta.env.VITE_LOCAL1+"/auth/42"
  const [username, setUsername]=useState<string>('')
  const [password, setpassWord]=useState<string>('')
  const dispath = useAppDispatch()
  const navigate = useNavigate()

  const handleUserLogin=async (e:React.FormEvent<GenericHTMLFormElement>)=>{
    try{
      e.preventDefault()
      const data = await authService.LoginUser({username,password})
      if (data)
      {
        if(data.twoFAenabled){
          setA_token(data.token)
          setTwoFa(true)
          setIslogin(false)
        }
        else{
          dispath(login())
          setToken(data.token)
          dispath(getUserdata())
          toast.success('you log in')
          navigate('/')
        }

      }
    }
    catch(error:any){
      const err = error.response?.data.message;
        toast.error(err.toString())
    }
  }

  const hanldelSign =()=>{
    setIssign(true)
    setIslogin(false)
  }

  const handleInformationButton = () => {
    alert("khfjfhkjfhfjg");
  }

  return (
    <>
 {/* for login  */}
            <div className='flex flex-col gap-1'>

              <div className="InformationButton  ml-6 mt-5" 
                onClick={handleInformationButton}
              >
                <span>?</span>
              </div>
              <div className='mx-auto items-center justify-center'>
                {/* <Form */}
                <form
                  onSubmit={handleUserLogin} 
                  className='mx-auto flex w-2/3 flex-col gap-4'
                >
                  <input 
                    type='text' 
                    className='input' 
                    placeholder='username' 
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                  />
                  <input 
                    type='password' 
                    className='input' 
                    placeholder='password' 
                    value={password}
                    onChange={(e)=>setpassWord(e.target.value)}
                  />
                  <button className='btn btn-green mx-auto' type='submit'>
                    Log in
                  </button>
                </form>
              </div>
              <div className='mx-auto items-center justify-center'>
                <p className='text-black text-xl font-bold font-serif'>
                  or
                </p>
              </div>
              <div className='mx-auto items-center justify-center'>
                <a 
                  className='btn btn-green rounded-md  px-2 py-2 text-xl'
                  // href='http://localhost:3000/auth/42' 
                  href={url} 
                >
                  Login With 42
                </a>  
              </div>

              <div className='mx-auto items-center justify-center mb-5'>
                <button 
                  className='text-black font-blod text-xs font-serif hover:text-white '
                  onClick={hanldelSign}
                >
                  You don't have an account?
                </button>
              </div>
            </div>
    </>
  );
}

function Signup_com(props:any){
  const { setIslogin, setIssign}=props;

  const [username,setUsername]=useState<string>('')
  const [name, setName]=useState<string>('')
  const [email, setEmail]=useState<string>('')
  const [password, setpassWord]=useState<string>('')


  const handleSubmit=async (e:React.FormEvent<HTMLFormElement>)=>{
    try{
      e.preventDefault()
      const data = await authService.signupUser({username,name,email,password})
      if (data)
      {
        toast.success('you have an account!')
        setIslogin(true)
        setIssign(false)
      }
    }
    catch(error:any){
      const err = error.response?.data.message;
        toast.error(err.toString())
    }

  }
  const hanldeLogin=()=>{
    setIslogin(true)
    setIssign(false)
  }

  return (
    <>
      <div className='flex flex-col'>
        <div>
            {/* <Form */}
            <form
              onSubmit={handleSubmit}
              className='mx-auto mt-5 flex w-1/3 flex-col gap-4'
            >
              <input 
                type='text' 
                className='input mt-5' 
                placeholder='username' 
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />
              <input 
                type='text' 
                className='input ' 
                placeholder='nickName' 
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />
              <input 
                type='text' 
                className='input ' 
                placeholder='email' 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <input 
                type='password' 
                className='input' 
                placeholder='password' 
                value={password}
                onChange={(e)=>setpassWord(e.target.value)}
              />
              <button 
                className='btn btn-green mx-auto mb-2' 
                type='submit' 
                // onClick={handleSubmit}
              >
                Sign up
              </button>
            </form>
          </div>
            <div className='mx-auto items-center justify-center'>
              <button 
                className='text-black font-blod text-xs font-serif hover:text-white mb-2' 
                onClick={hanldeLogin}
              >
                back
              </button>
            </div>
      </div>
    </>
  )
}




export default LoginPage;
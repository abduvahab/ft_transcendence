
import { RouterProvider } from 'react-router-dom'
import {  Routers } from './router/router'
import { useAppDispatch } from './store/hooks'
import {getToken} from './helpers/localStore.helper';
import { authService } from './server/authService';
import { login, logout} from './store/user/userSlice';
import { useEffect } from 'react';
import { getUserdata } from './store/thunk/actions';

function App() {

  const dispatch=useAppDispatch();

  const chechAuth = async ()=>{
    const token =getToken()
    try{
        if (token)
        {
            const data = await authService.getUserProfile();
            if (data){
              dispatch(login())
              dispatch(getUserdata())
            }
          }
          else{
            dispatch(logout())
          }
      }
      catch(error:any){
        dispatch(logout())
      }

  }

  useEffect(()=>{
    chechAuth()
  },[])


  return (
    <>
      <Routers/>
      {/* <RouterProvider router={router}/> */}
    </>
  )
}

export default App

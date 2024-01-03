
import {BrowserRouter, Route, Routes, createBrowserRouter } from "react-router-dom";
import { Layout } from "../pages/layout";
import { ErrorPage } from "../pages/errorPage";
import { Home} from "../pages/home/home";
import LoginPage from "../pages/login/loginPage";
import { Game } from "../pages/game/game";
import { ProfilePage } from "../pages/home/profilePage";
import {FriendsPage } from "../pages/friends/friends";
import { FriendsProfilePage } from "../pages/friends/friendProfile";
import AppWrapper from "../pages/chat/appWrapper";
import { useEffect, useState } from "react";
import { getToken } from "../helpers/localStore.helper";
import { Socket, io } from "socket.io-client";
import { useAppSelector } from "../store/hooks";
import PongGameWrapper from "../pages/game/PongGameWrapper";
import { ErrorPage_back } from "../pages/direct_login";



export function Routers(){
    const isAuth = useAppSelector((state)=>state.isAuth.isAuth)
    const [socket,setSocket]=useState<Socket>()

useEffect(()=>{
    if(isAuth){
      // const port1 = import.meta.env.PORT1
      const url = import.meta.env.VITE_LOCAL1
        const sk = io(url,{
            query:{
                token:getToken()
            }
        })
        setSocket(sk)
    }

},[isAuth])

    return(<>
    <BrowserRouter>
      <Routes>
      {
        isAuth &&  socket?(
          <>
            <Route path="/" element={<Layout socket={socket}/>}>
              <Route index element={<Home />} />
              <Route path="/game" element={<PongGameWrapper />} />
              <Route path="/friends" element={<FriendsPage socket={socket}/>} />
              <Route path="/friends/profile/:id" element={<FriendsProfilePage socket={socket}/>} />
              <Route path="/chat" element={<AppWrapper socket={socket}/>} />
              <Route path="/profile" element={<ProfilePage/>} />
              <Route path="/errorPage" element={<ErrorPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<ErrorPage />} />
              {/* <Route path="*" element={<ErrorPage_back />} /> */}
            </Route>
          </>
        ):(
        <>
          <Route  element={<Layout socket={socket}/>}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<ErrorPage_back />} />
          </Route>
        </>
        )
      }
      </Routes>
    </BrowserRouter>
    </>)
}




// export const router=createBrowserRouter([{

//     path:'/',
//     element:<Layout/>,
//     errorElement:<ErrorPage/>,
//     children:[
//         {
//             index:true,
//             element:<Home/>
//         },
//         {
//             path:'login',
//             element:<LoginPage/>
//         },
//         {
//             path:'errorPage',
//             element:<ErrorPage/>
//         },
//         {
//             path:'game',
//             element:<Game/>
//         },
//         {
//             path:'friends',
//             element:<FriendsPage/>
//         },
//         {
//             path:'friends/profile/:id',
//             element:<FriendsProfilePage/>
//         },
//         {
//             path:'chat',
//             element:<AppWrapper/>
//         },
//         {
//             path:'profile',
//             element:<ProfilePage/>
//         },

//     ]

// }])
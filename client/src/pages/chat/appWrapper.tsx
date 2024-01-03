// AppWrapper.tsx
import React, { useEffect, useState } from 'react';
import Rightbar from './Rightbar'
import Chat from './Chat';
import '../../css/chat.css'
import Navbar from './Navbar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { PrivateChat} from '../../types/types';
// import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../server/authService';
import { groupChatMode, privateChatMode, setPrivateChat } from '../../store/user/userSlice';
import Channels from './Channels';
import Search from './Search';
import Chats from './Chats';
import { ListChat } from './listChats';
import Group_Chat from './groupChat';
import Group_Rightbar from './groupRightbar';

function AppWrapper(props:any){
    const {socket} = props
    const isGroup = useAppSelector((state)=>state.isAuth.isGroup)
    const isPrivate = useAppSelector((state)=>state.isAuth.isPrivate)
    const dispatch = useAppDispatch()

  return (
    <>
    <div className='homeC'>
      <div className='containerC mb-10'>
        <div className='sidebarC overflow-auto'>
          <div className='navbarC'>
            <div className="tab-buttons">
                <button
                  className={`tab-button text-black ${isPrivate && 'active'}`}
                  onClick={() =>dispatch(privateChatMode())}
                >
                  Private
                </button>
                <button
                  className={`tab-button text-black ${isGroup && 'active'}`}
                  onClick={() => dispatch(groupChatMode())}
                >
                  Channels
                </button>
            </div>
            <div className="tab-content sidebarC">
              {isPrivate && 
                <ListChat socket={socket}/>
                
              }
              {isGroup  && 
                <div>
                  <Channels socket={socket}/>
                </div>}
            </div>
          </div>
        </div> 
          {isPrivate && <Chat socket={socket}/>}
          {isPrivate && <Rightbar socket={socket}/>}
          {isGroup && <Group_Chat socket={socket}/>}
          {isGroup && <Group_Rightbar socket={socket}/>}
      </div>
    </div>
    </>
  );
};

export default AppWrapper;
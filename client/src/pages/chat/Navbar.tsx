import React, {useState } from 'react'
import Channels from './Channels';
import Search from './Search';
import Chats from './Chats';
import { PrivateChat } from '../../types/types';

function Navbar (props:any){

    const {privateChats,setPrivateChat}=props
    const [activeTab, setActiveTab] = useState<string>('direct');

    const handleTabChange = (tab: string) => {
      setActiveTab(tab);
    };

    return (
        <div className='navbarC'>
          <div className="tab-buttons">
              <button
                className={`tab-button text-black ${activeTab === 'direct' && 'active'}`}
                onClick={() => handleTabChange('direct')}
              >
                Direct
              </button>
              <button
                className={`tab-button text-black ${activeTab === 'channels' && 'active'}`}
                onClick={() => handleTabChange('channels')}
              >
                Channels
              </button>
          </div>
          <div className="tab-content sidebarC">
            {activeTab === 'direct' && 
              <div>
                {/* <Search /> */}
                {privateChats.map((privateChat:PrivateChat)=>(
                  <Chats privateChat={privateChat} setPrivateChat={setPrivateChat}/>
                ))}  
              </div>}
            {activeTab === 'channels' && 
              <div>
                <Search />
                <Channels />
              </div>}
          </div>
        </div>
    );
};

export default Navbar
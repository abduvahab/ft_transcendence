
import Messages from './Messages'
import Input from './Input'


function Chat(props:any) {
    const {socket} = props

    return (
        <div className='chatC w-2/3'>
            <div className='chatInfoC'>
                <span></span>
                <div className='chatIconsC'>
                    <img src="" alt="" className='imageC' />
                </div>
            </div>
            <Messages socket={socket}/>
            <Input socket={socket}/>
        </div>

    );
};

export default Chat
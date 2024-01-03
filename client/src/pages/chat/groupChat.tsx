
import Messages from './Messages'
import Input from './Input'
import GroupMessages from './groupMessages';
import GroupInput from './groupInput';


function Group_Chat(props:any) {
    const {socket} = props
    return (
        <div className='chatC w-2/3'>
            <div className='chatInfoC'>
                <span></span>
                <div className='chatIconsC'>
                    <img src="" alt="" className='imageC' />
                </div>
            </div>
            <GroupMessages socket={socket}/>
            <GroupInput socket={socket}/>
        </div>
    );
};

export default Group_Chat

import icon from '../../assets/icon.png';
import moment from "moment-timezone";


function Message (props:any){


    const {message,isSender}=props


    return (
    <>
        {isSender ? (
                <div className=''>
                    <div className='messageC ownerC'> 
                            <div className='messageInfoC'>
                                <img
                                    className='imageC'
                                    src={message.sender.avatar ?(message.sender.avatar): icon}
                                    alt=""
                                />
                                {/* <span>{message.sender.name}</span> */}
                            </div>
                            <div className='messageContentC '>
                                <p className='pC'>
                                    <p className='text-black text-base'>{message.text}</p>
                                        {/* <p className='text-xs '>{moment(message.createAt).tz(moment.tz.guess()).format("HH:mm:ss")}</p> */}
                                </p>
                            </div>
                    </div>
                    <div className='flex justify-end mr-10 mb-5'>
                        <p className='text-xs '>{moment(message.createAt).tz(moment.tz.guess()).format("HH:mm:ss")}</p>
                    </div>
                </div>
        ) : (
            <div className=''>
                    <div className='messageC ownerC justify-end'> 
                        
                        <div className='messageContentC '>
                            <p className='pC '>
                                <p className='text-black text-base'>{message.text}</p>
                                {/* <p className='text-xs '>{moment(message.createAt).tz(moment.tz.guess()).format("HH:mm:ss")}</p> */}
                            </p>
                        </div>
                        <div className='messageInfoC'>
                            <img
                                className='imageC'
                                src={message.sender.avatar ?(message.sender.avatar): icon}
                                alt=""
                            />
                            {/* <span className='ml-2'>{message.sender.name}</span> */}
                        </div>
                    </div>
                    <div className='flex justify-start ml-10 mb-5'>
                        <p className='text-xs '>{moment(message.createAt).tz(moment.tz.guess()).format("HH:mm:ss")}</p>
                    </div>
            </div>
        )}
    </>
    );
};

export default Message

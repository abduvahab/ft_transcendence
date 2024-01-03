import { FC, useEffect, useRef, useState } from 'react';
import avatar from '../assets/avatr.jpg'
import '../css/header.css'
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/user/userSlice';
import { removeToken } from '../helpers/localStore.helper';
import { Link, useNavigate } from 'react-router-dom';
// import { getUserdata } from '../store/thunk/actions';


function ProfileButton(props:any){
  const {socket} = props
  const [showAire, setShowAire] = useState<boolean>(false)


    const userdata = useAppSelector((state)=>state.isAuth.user)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()


  const goLogOut = ()=>{
    socket.emit("my_disconnect","")
    dispatch(logout())
    removeToken()
    navigate('/login')
  }
  




  // const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const showSelect=()=>{
    setShowAire(!showAire)
  }

  const handleWindowClick = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowAire(false);
      }
  };

  useEffect(() => {
    window.addEventListener('click', handleWindowClick);
    return () => {
        window.removeEventListener('click', handleWindowClick);
    };

}, []);


  return (

      <div className="flex- gap-2 relative" ref={optionsRef}>
        <div className="profile-button">
            <img
                className=' rounded-full'
                src={userdata?.avatar ?(userdata.avatar): avatar} alt='Profil' 
                onClick={showSelect}
            />
        </div>
      {showAire && (
        <div className='logotAire flex flex-col px-2 absolute mt-10'>
            <Link to='/profile'>Profile</Link>
            <button 
              className='text-white-300 hover:text-red-400' 
              onClick={goLogOut}
            >
              Logout
            </button>
          </div>
        )}
    </div>
  )
};

export default ProfileButton;
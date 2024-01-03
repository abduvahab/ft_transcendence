
import { Outlet} from "react-router-dom";
import { Header } from "../components/header";
import '../css/outlet.css'


export function Layout(props:any){
    const {socket} = props
   
    return (
    <>
        
            <div className=''>
                <div className=" ml-auto px-3 py-3">
                    <Header socket={socket}/>
                </div>
                <div className="mx-5 my-1 mb-20  bg-sky-600 rounded-3xl " >
                    <Outlet/>
                </div>
            </div>
       
     </>
    );
}
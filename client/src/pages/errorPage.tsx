import { FC } from "react";
import { Link } from "react-router-dom";
import "../css/loginPage.css"


export const ErrorPage:FC =()=>{
    return (
        <div className="errorpage_all flex flex-col">
            <p className="text-black text-5xl font-blod">
                an error happened !
            </p>
            <div className="mt-5 bg-green-500 px-5 py-5 rounded-md font-blod">
                <Link to='/' >
                    <p className="text-xl font-blod">
                        back
                    </p>
                </Link>
            </div>
        </div>
    );
}
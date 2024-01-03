import { authService } from "../../server/authService";
import { setGroupChatId, setGroupChatIdUndefined, setUser } from "../user/userSlice";

export const getUserdata=()=>async (dispatch:any)=>{
        try{
            const data = await authService.getUserProfile()
            if(data)
                dispatch(setUser(data))
        }
        catch(error:any){
           
    }
}

export const setGroupChatId_thunk=(id:number)=>async (dispatch:any)=>{
        try{
                dispatch(setGroupChatId(id))
        }
        catch(error:any){
           
    }
}

export const setGroupChatIdUndefined_thunk=()=>async (dispatch:any)=>{
        try{
                dispatch(setGroupChatIdUndefined())
        }
        catch(error:any){
           
    }

}


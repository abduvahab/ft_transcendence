

export function setToken(token:string){
    localStorage.setItem('token', token);
}
export function getToken():string {
    const data = localStorage.getItem('token')
    const token: string = data  ? data : ""
    return token;
}

export function removeToken(){
    localStorage.removeItem('token');
}
export function setIsAuth(isAuth:string){
    localStorage.setItem('isAuth', isAuth);
}
export function getIsAuth():string {
    const data = localStorage.getItem('isAuth')
    const isAuth: string = data ? data : ''
    return isAuth;
}

export function removeIsAuth(){
    localStorage.removeItem('isAuth');
}


export function clearLocalStorage(){
    localStorage.clear()
}



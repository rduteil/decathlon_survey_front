export function setJWT(jwt){
    sessionStorage.setItem("jwt", jwt);
}

export function removeJWT(){
    sessionStorage.removeItem("jwt");
}

export function getJWT(){
    return sessionStorage.getItem("jwt");
}

export function getRoles(){
    if(sessionStorage.getItem("jwt") === null) return null;
    let parsed = sessionStorage.getItem("jwt").split('.')[1];
    parsed = parsed.replace('-', '+').replace('_', '/');
    parsed = JSON.parse(window.atob(parsed));
    return parsed.roles;
}

export function getUsername(){
    if(sessionStorage.getItem("jwt") === null) return null;
    let parsed = sessionStorage.getItem("jwt").split('.')[1];
    parsed = parsed.replace('-', '+').replace('_', '/');
    parsed = JSON.parse(window.atob(parsed));
    return parsed.username;
}

export function isLoggedIn(){
    return(sessionStorage.getItem("jwt") === null || sessionStorage.getItem("jwt") === undefined ? false : true);
}
export const  setUser = (user:any)=>{
    localStorage.set("user", JSON.stringify(user))
}

export const getUser = ():any=>{
    const user = localStorage.getItem("user")

    return user && JSON.parse(user)
}



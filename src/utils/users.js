const users=[]

const addUser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    if(!username || !room){
        return {
            error:'username and room are required'
        }
    }

    //check for exisiting users,no same rrom anf any other same username
    const exisitingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })

    if(exisitingUser){
        return {
            error:'username already taken'
        }
    }

    //storing the user
    const user={id,username,room}
    users.push(user)

    return {user}
}

const removeUser= (id)=>{
    const index=users.findIndex((user)=>{
        return user.id===id
    })

    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

const getUser= (id)=>{
    return users.find((user)=>{
        return user.id===id
    })
}

const getUserInRoom= (room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>{
        user.room=== room  
    })
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}
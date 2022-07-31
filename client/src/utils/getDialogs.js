

export const getDialogs = (dialogsData) => {
    if(dialogsData){
        let arr = []
        const usersArrays = dialogsData.users.map(user => user)
        usersArrays.map(usersArray => usersArray)
        usersArrays.map(usersArray => arr.push(...usersArray))
        return dialogsData.rooms.map(room => {
            return {
                users: room.userIds.map(userId => userId).map(user => arr.find(getUser => getUser.user === user)),
                room: room._id
            }
        })
    }
    else return {}
}
export const onlyOnlineFriends = (friends, onlineUsers) => {
    const onlineFriends = friends.filter(friend => onlineUsers.includes(friend.user) )
    return onlineFriends
}
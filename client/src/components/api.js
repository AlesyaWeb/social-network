import * as axios from "axios";
const API_URL = `http://localhost:3008/auth`  // for prod. https://socnet-backend.herokuapp.com/auth for dev. http://localhost:3008/auth
export const NEXT_PUBLIC_RECAPTCHA_KEY = `6LcWT6seAAAAALrCC-PL_23-Cydefkk9o8FFOhkP`
export const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})
$api.interceptors.response.use((config) => {
    return config;
},async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
            console.log(response)
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('user', response.data.user)
            return $api.request(originalRequest);
        } catch (e) {
            console.log('пользователь не авторизован')
        }
    }
    throw error;
})
export const userApi = {
    Login: (email, password, captcha) => {
        console.log(captcha)
        return $api.post('/login', {email, password, captcha})
            .then(response => response)
                .catch(error => error.response.data)
    },
    Logout: () => {
        return $api.post('/logout').then(response => response.data)
    },
    fetchUser: () => {
        return $api.get('/me', {withCredentials: true}).then(response => response)
    },
    fetchUsers: () => {
        return $api.get('/users').then(response => response.data)
    },
    setUserProfile: (userId) => {
        console.warn("Obsolete method. Please use profileApi object.")
        return profileApi.getUserProfile(userId)
    },
    registration: (email, password, userData) => {
        return $api.post('/registration', {email, password, userData})
            .then(response => response)
                .catch(error => error.response.data)
    },
    checkAuth: () => {
        return $api.get('/refresh', {withCredentials: true})
    }
}
export const profileApi = {
    updateUserStatus(status) {
        return $api.put(`/status`, { status: status })
    },
    getUserStatus(userId) {
        return userApi.setUserProfile(userId)
    },
    getUserProfile(userId) {
        if(userId) return $api.get(`/profile/${userId}`)
        return $api.get(`/profile/`)
    },
    uploadAvatar(avatar) {
        console.log(avatar)
        let formData = new FormData()
        formData.append("file", avatar)
        console.log(formData)
        return $api.put(`/avatar`, formData, {headers: {
            'Content-Type': 'multipart/form-data'
        }}).then(response => response)
    },
    updateUserProfileInfo(profileNewData) {
        console.log(profileNewData)
        return $api.put(`/editprofile`, profileNewData).then(response => response)
    },
    getPosts(id) {
        return $api.get(`/posts/${id}`).then(response => response)
    },
    addPost(postText, postFiles) {
        console.log(postFiles)
        let formData = new FormData()
        if(postFiles.length > 0){
            console.log('hello')
            postFiles.map(file => console.log(file))
            postFiles.map(file => formData.append('file', file))
        }
        formData.append('postText', postText)
        // if(!postText || postText.replace(/ *n*r*t*/g, "") === '') formData.append('postText', '')
        console.log(formData)
        return $api.post('/post/add', formData, {headers: {
            'Content-Type': 'multipart/form-data'
        }}).then(response => response)
    },
    deletePost() {
        return $api.delete('/posts/delete').then(response => response)
    },
    likePost(post) {
        return $api.put('/post/like', {post: post}).then(response => response)
    },
    dislikePost(post) {
        return $api.put('/post/dislike', {post: post}).then(response => response)
    }
}

export const dialogsApi = {
    getDialogsData() {
        return $api.get(`/allrooms`).then(response => response)
    },
    sendMessage(message, room, receiverId){
        return $api.post(`/room/${room}/create-message-in-room`, {message, receiverId}).then(response => response)
    },
    getConversationById(room){
        return $api.get(`/room/${room}`).then(response => response)
    },
    initiateDialog(userId){
        return $api.post(`/room/initiate`, {userIds: [userId], type: "CONSUMER-TO-CONSUMER"}).then(response => response)
    }
}
export const friendsApi = {
    getFriends() {
        return $api.get(`/friends`).then(response => response)
    },
    addToFriendsQuery(to) {
        return $api.post(`/friends/add`, {to: to}).then(response => response)
    },
    cancelFriendQuery(friendId) {
        return $api.post(`/friends/cancelquery`, {friendId: friendId}).then(response => response)
    },
    acceptFriendQuery(friendId) {
        return $api.put(`/friends/accept`, {from: friendId}).then(response => response)
    },
    rejectFriendQuery(friendId) {
        return $api.put(`/friends/reject`, {from: friendId}).then(response => response)
    },
    deleteFriend(friendId) {
        return $api.post(`/friends/delete`, {friendId: friendId}).then(response => response)
    }
}
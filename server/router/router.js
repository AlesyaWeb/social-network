const Router = require('express')
const router = new Router()
const controller = require('../controllers/user-controller')
const chatRoomController = require('../controllers/chatRoom-controller')
const postsController = require('../controllers/posts-controller')
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const antiBotMiddleware = require('../middlewares/antiBot-middleware');
router.post('/registration', [
    body('email', "Field 'Username' cannot be empty").notEmpty().isEmail(),
    body('password', "Password must be at least 4 characters and no more than 10").isLength({min: 4, max: 10})
], controller.registration);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/activation/:link', controller.activate);
router.get('/refresh', controller.refresh)
router.get('/users', controller.getUsers);
router.get('/profile/:id', controller.getUserProfile);
router.get('/me', authMiddleware, controller.getCurrentUser);
router.put('/avatar', authMiddleware, controller.setUserAvatar)
router.put('/status', authMiddleware, controller.updateStatus)
router.put('/editprofile', authMiddleware, controller.editProfile)
router.post('/room/initiate', authMiddleware, chatRoomController.initiateChat)
router.post('/room/:roomId/create-message-in-room', authMiddleware, chatRoomController.createPostInChatRoom)
router.get('/room/:roomId', authMiddleware, chatRoomController.getConversationByRoomId)
router.get('/allrooms', authMiddleware, chatRoomController.getAllConversations)
router.put('/room/:roomId/mark-read', authMiddleware, chatRoomController.markConversationReadByRoomId)
router.post('/post/add', postsController.addPost)
router.put('/post/like', postsController.likePost)
router.put('/post/dislike', postsController.dislikePost)
router.delete('/post/delete', postsController.deletePost)
router.get('/posts/:id', postsController.getPostsById)
router.post('/friends/add', controller.addToFriendsQuery)
router.post('/friends/cancelquery', controller.cancelFlQuery)
router.put('/friends/accept', controller.acceptFriendQuery)
router.put('/friends/reject', controller.rejectFriendQuery)
router.post('/friends/delete', controller.deleteFriend)
router.get('/friends', controller.getFriends)
module.exports = router
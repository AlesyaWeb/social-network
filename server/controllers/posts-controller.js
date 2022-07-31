const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-errors');
const PostsService = require("./../service/posts-service")
class postsController {
    async addPost(req, res, next) {
        try {
            console.log(req.body)
            const {refreshToken} = req.cookies
            const postText = req.body.postText
            const postImage = req.files?.file
            const addPost = await PostsService.addPost(refreshToken, postText, postImage)
            return res.json(addPost);
        }
        catch (e){
            next(e);
        }
    }
    async deletePost (req, res, next){
        try {
            const {postId} = req.body
            const {refreshToken} = req.cookies
            const deletePost = await PostsService.deletePost(refreshToken, postId)
            return res.json(deletePost)
        }
        catch (e){
            next(e)
        }
    }
    async getPostsById (req, res, next) {
        try {
            const userId = req.params.id;
            const posts = await PostsService.getPostsById(userId)
            res.json(posts)
        }
        catch (e){
            next(e)
        }
    }
    async likePost (req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const {post} = req.body
            console.log(post)
            const likedPost = await PostsService.likePost(refreshToken, post)
            res.json(likedPost)
        }
        catch (e){
            next(e)
        }
    }
    async dislikePost (req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const {post} = req.body
            console.log(post)
            const dislikedPost = await PostsService.dislikePost(refreshToken, post)
            res.json(dislikedPost)
        }
        catch (e){
            next(e)
        }
    }
}

module.exports = new postsController();
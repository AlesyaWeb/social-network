const tokenService = require("./token-service");
const ApiError = require("../exceptions/api-errors");
const PostModel = require('../Models/Post');
const mongoose = require("mongoose");
const uuid = require("uuid");
const convertMultipleImagesToArray = require('../Utils/MultipleImages')
const UserInfo = require("../Models/userInfo");
const {v2: cloudinary} = require("cloudinary");
class PostsService {
    async addPost(refreshToken, postText, postImage) {
        console.log(postImage)
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        console.log(postText === null)
        if(postText?.replace(/ *n*r*t*/g, "") === '' && !postImage){
            throw ApiError.BadRequest('Post cannot be empty')
        }
        console.log(postText)
        postText === "null" ? postText = "" : postText
        console.log(postText)
        let postImageUrl;
        let addPost;
        if(postImage){
            if(postImage.length <= 1 || !postImage.length){
                let postImageUrl;
                await cloudinary.uploader.upload(postImage.tempFilePath, async (err, result) => {
                    postImageUrl = result.url
                })
                const author = userData.id;
                addPost = await PostModel.create({
                    author, postText: postText, postThumbnails: postImageUrl
                })
            }
            else if (postImage.length >= 2) {
                const beautifiedPost = await convertMultipleImagesToArray(postImage)
                const author = userData.id;
                addPost = await PostModel.create({
                    author, postText: postText, postThumbnails: beautifiedPost
                })
            }
        }
        else{
            const author = userData.id;
            addPost = await PostModel.create({
                author, postText: postText
            })
        }
        return{
            addPost
        }
    }
    async deletePost(refreshToken, postId) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const postToDelete = await PostModel.findById(postId)
        if(!postToDelete) throw ApiError.BadRequest('There no post with the same id');
        const author = mongoose.Types.ObjectId(userData.id)
        if(!author.equals(postToDelete.author)){
            throw ApiError.BadRequest('You did not author');
        }
        const deletePost = await PostModel.findByIdAndDelete(postId)
        return{
            deletePost
        }
    }
    async getPostsById (id) {
        const authorId = mongoose.Types.ObjectId(id)
        console.log(authorId)
        const posts = await PostModel.find({author: authorId})
        return {
            posts
        }
    }
    async likePost (refreshToken, post) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        console.log(userData)
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let userId = userData.id;
        const likedPost = await PostModel.findOne({_id: post, likes: {$exists: true, $in:  userId}})
        const isPostDisliked = await PostModel.findOne({_id: post, dislikes: {$exists: true, $in:  userId}})
        if(isPostDisliked){
            await PostModel.updateOne({_id: post}, {$pull: {dislikes: userId}})
        }
        if(likedPost) {
            await PostModel.updateOne({_id: post}, {$pull: {likes: userId}})
            return PostModel.findOne({_id: post})
        }
        await PostModel.updateOne({_id: post}, {$push: {likes: userId}})
        return PostModel.findOne({_id: post})
    }
    async dislikePost (refreshToken, post) {
        const userData = tokenService.validateRefreshToken(refreshToken);
        console.log(userData)
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        let userId = userData.id;
        const dislikedPost = await PostModel.findOne({_id: post, dislikes: {$exists: true, $in:  userId}})
        const isPostLiked = await PostModel.findOne({_id: post, likes: {$exists: true, $in:  userId}})
        if(isPostLiked){
            await PostModel.updateOne({_id: post}, {$pull: {likes: userId}})
        }
        if(dislikedPost) {
            await PostModel.updateOne({_id: post}, {$pull: {dislikes: userId}})
            return PostModel.findOne({_id: post})
        }
        await PostModel.updateOne({_id: post}, {$push: {dislikes: userId}})
        return PostModel.findOne({_id: post})
    }
}

module.exports = new PostsService();
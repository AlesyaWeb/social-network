require('dotenv').config()
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3007;
const router = require('./router/router');
const errorMiddleware = require('./middlewares/error-middleware');
const mongoose = require('mongoose')
let bodyParser = require('body-parser')
const app = express();
const server = require("http").createServer(app);
const socketio = require("socket.io")(server, {cors: {origin: "http://localhost:3000"}}); // for prod. https://socnet-backend.herokuapp.com for dev. http://localhost:3000
const fileUpload = require('express-fileupload')
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"  // for prod. https://socnet-backend.herokuapp.com for dev. http://localhost:3000
}))
app.use(express.static('build'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir : '/tmp/'
}))
app.use(cookieParser())
app.use("/auth", router);
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})
app.use(errorMiddleware);
// app.get('/api', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'API-Documentation-HTML-Template1', 'index.html'))
// });
global.io = socketio.listen(server);
let users = [];
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

function getUser(userId) {
    if(users.find((user) => user.userId === userId)) return users.find((user) => user.userId === userId)
    else return null
}
const getUsers = (usersList) => {
    let clientIds = []
    if(usersList) return usersList.map(user => user?.userId)
    else return null

}
global.io.on('connection', (client) => {
    console.log(`a user connected.`);
    if(getUsers(users)) {
        global.io.emit("usersChanged", getUsers(users))
        console.log('reconnected')
    }
    client.on("disconnect", () => {
        console.log("dissconnected")
        removeUser(client.id)
        global.io.emit("usersChanged", getUsers(users))
    });
    client.on("getOnlineUsers", ()=>{
        global.io.emit("usersChanged", getUsers(users))
    })
    client.on('checkMe', (userId) => {
        const user = getUser(userId);
        if(user) io.to(client.id).emit("checkedData", true);
        else io.to(client.id).emit("checkedData", false);
    })
    // add identity of user mapped to the socket id
    client.on("identity", (userId) => {
        addUser(userId, client.id);
        global.io.emit("usersChanged", getUsers(users))
    });
    client.on("logout", () => {
        removeUser(client.id);
        global.io.emit("usersChanged", getUsers(users))
    });
    client.on("sendMessage", ({ receiverId, newMessageText }) => {
        console.log(receiverId)
        const user = getUser(receiverId);
        if(user) io.to(user.socketId).emit("getMessage", newMessageText);
    });
})
server.listen(PORT);
const start = async () => {
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    catch (e) {
        console.log(e)
    }
}
server.on("listening", () => {
    console.log(`Listening on port:: http://localhost:${PORT}/`)
});
start()

module.exports = users

import express from "express";
import http from "http";


const cors = require('cors')
const app = express();
const server = http.createServer(app);
const socket = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
})

app.use(cors());


app.get('/', (req, res) => {
    res.send("Hello")
})

const messages = [
    {message: "bsj", id: "111", user: {id: "1112", name: "Polina"}},
    {message: "ыоышч", id: "222", user: {id: "22221", name: "Хр"}}
]
const users = new Map();


socket.on("connection", (socketChannel: any) => {


    users.set(socketChannel, {id: new Date().getTime().toString(), name: "anonim"})

    socket.on("disconnect", () => {
        users.delete(socketChannel)
    })


    socketChannel.on("client-name-sent", (name: string) => {
        if (typeof name !== "string") {
            return
        }
        const user = users.get(socketChannel)
        user.name = name;
    })

    socketChannel.on("client-message-sent", (message: string) => {
        if (typeof message !== "string") {
            return
        }
        const user = users.get(socketChannel)
        const messageItem = {
            message: message,
            id: new Date().getTime().toString(),
            user: {id: "222211", name: user.name}
        }
        messages.push(messageItem)

        socket.emit("new-message-sent", messageItem)
    })

    socketChannel.emit("init-messages-publish", messages)

    console.log("user connected")
})

const PORT = process.env.PORT || 3009

server.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

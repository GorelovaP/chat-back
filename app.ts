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

socket.on("connection", (socketChannel: any) => {

    socketChannel.on("client-message-sent", (message: string) => {
        const messageItem = {message: message, id: "23r2" + new Date().getTime(), user: {id: "222211", name: "Хр"}}
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

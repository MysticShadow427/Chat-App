const express=require('express')
const http=require('http')
const socketio=require('socket.io')
const path=require('path')
const Filter=require('bad-words')
const {generateMessage,generateLocationMessage}=require('./utils/messages')

const app=express()
const server=http.createServer(app)
const io=socketio(server);

const port=process.env.PORT || 3000
const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log('Client connected :)')

    socket.on('join',(username,room)=>{
        socket.join(room)

        socket.emit('message',generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('message',generateMessage(`${username} joined`))
    })

    socket.on('sendMessage',(Message,callback)=>{
        const filter=new Filter()
        if(filter.isProfane(Message)){
            return callback('Profanity not allowed')
        }

        io.emit('message',generateMessage(Message))
        callback('Delivered')
    })

    socket.on('sendLocation',(coords,callback)=>{
        io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))

        callback()
    })

    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('A user disconnected'))
    })
})

server.listen(port,()=>{
    console.log(`Server running on ${port}`)
})
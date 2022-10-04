const express=require('express')
const http=require('http')
const socketio=require('socket.io')
const path=require('path')
const Filter=require('bad-words')

const app=express()
const server=http.createServer(app)
const io=socketio(server);

const port=process.env.PORT || 3000
const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log('Client connected :)')

    socket.emit('message','Welcome ! :)')
    socket.broadcast.emit('message','A new user has joined')

    socket.on('sendMessage',(Message,callback)=>{
        const filter=new Filter()
        if(filter.isProfane(Message)){
            return callback('Profanity not allowed')
        }

        io.emit('message',Message)
        callback('Delivered');
    })

    socket.on('sendLocation',(coords,callback)=>{
        io.emit('message',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)

        callback()
    })

    socket.on('disconnect',()=>{
        io.emit('message','A user disconnected')
    })
})

server.listen(port,()=>{
    console.log(`Server running on ${port}`)
})
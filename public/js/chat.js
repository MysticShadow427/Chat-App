const socket=io()

const $messageForm=document.querySelector('#mf')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocationButton=document.querySelector('#sl')
const $messages=document.querySelector('#messages')

//templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationMessageTemplate=document.querySelector('#location-message-template').innerHTML

//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})


socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format('k:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage',(message)=>{
    console.log(message)
    const html=Mustache.render(locationMessageTemplate,{
        url:message.url,
        createdAt:moment(message.createdAt).format('k:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    const Message=e.target.elements.message
    socket.emit('sendMessage',Message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()

        if(error) console.log(error)

        console.log('Delivered Successfcully')
    })
})

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation Not Supported')
    }

    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared')
        })
    })
})

socket.emit('join',{username,room})
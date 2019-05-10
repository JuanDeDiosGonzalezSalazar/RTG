const io = require('socket.io')
const port = process.env.GAME_SERVER_PORT
const server = io(5000)

class Player{
    constructor(id, socket, x, y){
        this.id = id
        this.socket = socket
        this.position = {
            x: x,
            y: y
        }
        this.color = randomColor()
        this.moving = {
            left: false,
            up: false,
            right: false,
            down: false
        }
        this.online = false
    }
}

function randomColor(){
    return '#' + ('0000000' + Math.round(Math.random() * 0xFFFFFF).toString(16)).substr(-6)
}

const players = {}

server.on('connection', (socket) => {
    console.log("Player has joined!")
    let player = new Player(
        Date.now(),
        socket,
        0,
        0
    )

    players[player.id] = player

    let onlinePlayers = {}
    
    Object.keys(players).map((id) => {
        let player = players[id]

        onlinePlayers[player.id] = {
            id: player.id,
            position: player.position,
            color: player.color,
            moving: player.moving
        }
    })

    console.log("Online players: ", onlinePlayers)

    let playerStatus = {
        id: player.id,
        position: player.position,
        color: player.color,
        moving: player.moving
    }

    let serverStatus = {
        myStatus: playerStatus,
        onlinePlayers: onlinePlayers
    }

    socket.emit('welcome', serverStatus)
    socket.broadcast.emit('newPlayer', playerStatus)

    socket.on('moveLeft', () => {
        if(!player.moving.left){
            player.moving.left = true
            socket.emit('movingLeft')
        }
    })

    socket.on('stopMovingLeft', () => {
        if(player.moving.left){
            player.moving.left = false
            socket.emit('stoppedMovingLeft')
        }
    })

    socket.on('moveUp', () => {
        if(!player.moving.up){
            player.moving.up = true
            socket.emit('movingUp')
        }
    })

    socket.on('stopMovingUp', () => {
        if(player.moving.up){
            player.moving.up = false
            socket.emit('stoppedMovingUp')
        }
    })

    socket.on('moveRight', () => {
        if(!player.moving.right){
            player.moving.right = true
            socket.emit('movingRight')
        }
    })

    socket.on('stopMovingRight', () => {
        if(player.moving.right){
            player.moving.right = false
            socket.emit('stoppedMovingRight')
        }
    })

    socket.on('moveDown', () => {
        if(!player.moving.down){
            player.moving.down = true
            socket.emit('movingDown')
        }
    })

    socket.on('stopMovingDown', () => {
        if(player.moving.down){
            player.moving.down = false
            socket.emit('stoppedMovingDown')
        }
    })

    socket.on('disconnect', () => {
        console.log('Player has left!')

        socket.broadcast.emit('playerLeft', player.id)
        delete players[player.id]
    })
})

let startTime = Date.now()
let endTime = Date.now()
let frame = 0
let onlinePlayers = {}
let framesPersSecond = 0
let framesToSkip = 0
let skippedFrames = 0
let timedFrame = 0

function loop(){
    if((endTime - startTime) >= 1000) {
        framesToSkip = frame/60

        startTime = Date.now()
        frame = 0
    }

    if((skippedFrames >= framesToSkip) && framesToSkip > 0){
        timedFrame++
        
        if(timedFrame >= 60){
            timedFrame = 0
        }
        
        skippedFrames = 0
        gameLoop(timedFrame)
    }

    frame++
    skippedFrames++;
    endTime = Date.now()

    setImmediate(loop)
}

setImmediate(loop)

function gameLoop(currentFrame){
    // console.log('Current Frame: ', currentFrame)

    Object.keys(players).forEach((id) => {
        if(players[id].moving.left){
            players[id].position.x -= 4
        }

        if(players[id].moving.up){
            players[id].position.y -= 4
        }

        if(players[id].moving.right){
            players[id].position.x += 4
        }

        if(players[id].moving.down){
            players[id].position.y += 4
        }

        onlinePlayers[id] = {
            id: id,
            position: players[id].position,
            color: players[id].color,
            moving: players[id].moving
        }
    })

    server.emit('update', onlinePlayers)
}
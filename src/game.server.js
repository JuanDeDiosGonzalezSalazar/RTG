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
        this.lastPosition = {
            x: x,
            y: y
        }
        this.width = 64
        this.heigth = 64
        this.stuck = false
        this.boundingBox = {
            top: 0,
            left: 0,
            right: this.width,
            bottom: this.height
        }
        this.speed = 2
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
    return '#' + ('00000' + Math.round(Math.random() * 0x333333).toString(16)).substr(-6)
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
            moving: player.moving,
            boundingBox: players[id].boundingBox,
            width: players[id].width,
            height: players[id].heigth
        }
    })

    console.log("Online players: ", onlinePlayers)

    let playerStatus = {
        id: player.id,
        position: player.position,
        color: player.color,
        moving: player.moving,
        boundingBox: player.boundingBox,
        width: player.width,
        height: player.heigth
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
        }
    })

    socket.on('stopMovingLeft', () => {
        // if(player.moving.left){
            player.moving.left = false
        // }
    })

    socket.on('moveUp', () => {
        if(!player.moving.up){
            player.moving.up = true
        }
    })

    socket.on('stopMovingUp', () => {
        // if(player.moving.up){
            player.moving.up = false
        // }
    })

    socket.on('moveRight', () => {
        if(!player.moving.right){
            player.moving.right = true
        }
    })

    socket.on('stopMovingRight', () => {
        // if(player.moving.right){
            player.moving.right = false
        // }
    })

    socket.on('moveDown', () => {
        if(!player.moving.down){
            player.moving.down = true
        }
    })

    socket.on('stopMovingDown', () => {
        // if(player.moving.down){
            player.moving.down = false
        // }
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

let frameCap = 60

function loop(){
    if((endTime - startTime) >= 1000) {
        framesToSkip = frame/frameCap

        startTime = Date.now()
        frame = 0
    }

    if((skippedFrames >= framesToSkip) && framesToSkip > 0){
        timedFrame++
        
        if(timedFrame >= frameCap){
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

function testCollision(a, b){
    // console.log(a.boundingBox, b.boundingBox)
    /*  Collision most be based on diretion the object is moving, it can't
    *   collide in its bottom if its heading top, another object can reach him from the bottom
    *   while it is heading top, but that does not mean it can not move top, the other object
    *   should trigger the collision instead and return to the lastPosition, since is the one reaching an object
    */

    // console.log(a.moving, b.moving)

    if(
        a.boundingBox.top >= b.boundingBox.top &&
        a.boundingBox.top <= b.boundingBox.bottom &&
        a.boundingBox.left >= b.boundingBox.left &&
        a.boundingBox.left <= b.boundingBox.right){
            console.log('Top-Left Collides')
            return true
    }
    if(
        a.boundingBox.top >= b.boundingBox.top &&
        a.boundingBox.top <= b.boundingBox.bottom &&
        a.boundingBox.right >= b.boundingBox.left &&
        a.boundingBox.right <= b.boundingBox.right){
            console.log('Top-Right Collides')
            return true
    }
    if(
        a.boundingBox.bottom >= b.boundingBox.top &&
        a.boundingBox.bottom <= b.boundingBox.bottom &&
        a.boundingBox.right >= b.boundingBox.left &&
        a.boundingBox.right <= b.boundingBox.right){
            console.log('Bottom-Right Collides')
            return true
    }
    if(
        a.boundingBox.bottom >= b.boundingBox.top &&
        a.boundingBox.bottom <= b.boundingBox.bottom &&
        a.boundingBox.left >= b.boundingBox.left &&
        a.boundingBox.left <= b.boundingBox.right){
            console.log('Bottom-Left Collides')
            return true
    }

    return false    
}

let idPlayerIndexCollisionTested = 0
function gameLoop(currentFrame){
    Object.keys(players).forEach((id) => {
        players[id].lastPosition.x = players[id].position.x
        players[id].lastPosition.y = players[id].position.y

        if(players[id].moving.left && players[id].moving.up){
            players[id].position.x -=  players[id].speed
            players[id].position.y -= players[id].speed
            // players[id].moving = {
            //     left: true,
            //     up: true,
            //     right: false,
            //     down: false
            // }
        }else if(players[id].moving.up && players[id].moving.right){
            players[id].position.x += players[id].speed
            players[id].position.y -= players[id].speed
            // players[id].moving = {
            //     left: false,
            //     up: true,
            //     right: true,
            //     down: false
            // }
        }else if(players[id].moving.right && players[id].moving.down){
            players[id].position.x += players[id].speed
            players[id].position.y += players[id].speed
            // players[id].moving = {
            //     left: false,
            //     up: true,
            //     right: true,
            //     down: false
            // }
        }else if(players[id].moving.down && players[id].moving.left){
            players[id].position.x -= players[id].speed
            players[id].position.y += players[id].speed
            // players[id].moving = {
            //     left: false,
            //     up: true,
            //     right: true,
            //     down: false
            // }
        }else if(players[id].moving.left){
            players[id].position.x -= players[id].speed
        }else if(players[id].moving.up){
            players[id].position.y -= players[id].speed
        }else if(players[id].moving.right){
            players[id].position.x += players[id].speed
        }else if(players[id].moving.down){
            players[id].position.y += players[id].speed
        }

        idPlayerIndexCollisionTested++
        Object.keys(players).slice(idPlayerIndexCollisionTested).some((id2) => {
            let collides = testCollision(players[id], players[id2])
            // console.log('Stuck?: ', players[id].stuck)

            // if(collides && !players[id].stuck){
            //     if(players[id].position.x == players[id].lastPosition.x &&
            //         players[id].position.y == players[id].lastPosition.y){
            //             players[id].stuck = true
            //     }else{
            //         players[id].position.x = players[id].lastPosition.x
            //         players[id].position.y = players[id].lastPosition.y
            //     }
            // }else{
            //     players[id].stuck = false
            // }
        })

        players[id].boundingBox.left = players[id].position.x
        players[id].boundingBox.top = players[id].position.y
        players[id].boundingBox.right = players[id].position.x + players[id].width
        players[id].boundingBox.bottom = players[id].position.y + players[id].heigth

        onlinePlayers[id] = {
            id: id,
            position: players[id].position,
            color: players[id].color,
            moving: players[id].moving,
            boundingBox: players[id].boundingBox,
            width: players[id].width,
            heigth: players[id].heigth
        }
    })

    idPlayerIndexCollisionTested = 0
    // console.log()

    server.emit('update', onlinePlayers)
}
window.onload = async () => {
    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')

    canvas.width = 600
    canvas.height = 400

    let showBoundingBoxes = true
    let showAxisGuidelines = true

    const server = location.hostname

    const tilemap = new Image()
    tilemap.src = '/images/tilemap.png'

    let imageLoaded = await new Promise((resolve, reject) => {
        tilemap.onload = () => {
            resolve(true)
        }
    }).catch(() => {
        resolve(false)
    })

    if(!imageLoaded){
        throw 'Image could not be loaded'
    }

    const playerSprite = new Image()
    playerSprite.src = '/images/player/robot.png'
    imageLoaded = await new Promise((resolve, reject) => {
        playerSprite.onload = () => {
            resolve(true)
        }
    }).catch(() => {
        resolve(false)
    })

    if(!imageLoaded){
        throw 'Player sprite animation could not be loaded...'
    }

    const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; 
    
    window.requestAnimationFrame = requestAnimationFrame;

    const socket = io(`${server}:5000`, {autoConnect: true})
    let connected = await new Promise((resolve, reject) => {
        socket.on('connect', () => {
            resolve(true)
        })
    }).catch(() => {
        resolve(false)
    })

    console.log('Connected')

    class Player{
        constructor(id, position, width, heigth, boundingBox, color, moving = {left: false, up: false, right: false, down: false}){
            this.id = id
            this.position = position
            this.moving = moving
            this.color = color
            this.currentAnimation = 'stand'
            this.boundingBox = boundingBox
            this.width = width
            this.heigth = heigth
            this.animations = {
                stand: {
                    x: 0,
                    y: 0,
                    width: 64,
                    height: 64,
                    frames: 1,
                    currentFrame: 0,
                    framesToSkip: 0,
                    skippedFrames: 0
                },
                left: {
                    x: 0,
                    y: 384,
                    width: 64,
                    height: 64,
                    frames: 16,
                    currentFrame: 0,
                    framesToSkip: 1,
                    skippedFrames: 0
                },
                leftUp: {
                    x: 0,
                    y: 320,
                    width: 64,
                    height: 64,
                    frames: 16,
                    currentFrame: 0,
                    framesToSkip: 1,
                    skippedFrames: 0
                },
                up: {
                    x: 0,
                    y: 256,
                    width: 64,
                    height: 64,
                    frames: 16,
                    currentFrame: 0,
                    framesToSkip: 1,
                    skippedFrames: 0
                },
                right: {
                    x: 0,
                    y: 128,
                    width: 64,
                    height: 64,
                    frames: 16,
                    currentFrame: 0,
                    framesToSkip: 1,
                    skippedFrames: 0
                },
                rightUp: {
                    x: 0,
                    y: 192,
                    width: 64,
                    height: 64,
                    frames: 16,
                    currentFrame: 0,
                    framesToSkip: 1,
                    skippedFrames: 0
                },
                rightDown: {
                    x: 0,
                    y: 64,
                    width: 64,
                    height: 64,
                    frames: 16,
                    currentFrame: 0,
                    framesToSkip: 1,
                    skippedFrames: 0
                },
                down: {
                    x: 0,
                    y: 0,
                    width: 64,
                    height: 64,
                    frames: 16,
                    currentFrame: 0,
                    framesToSkip: 1,
                    skippedFrames: 0
                },
                leftDown: {
                    x: 0,
                    y: 448,
                    width: 64,
                    height: 64,
                    frames: 16,
                    currentFrame: 0,
                    framesToSkip: 1,
                    skippedFrames: 0
                },
            }
        }

        draw(){
            let animation = this.animations[this.currentAnimation]

            if(this.id == player.id){
                context.drawImage(playerSprite,
                    animation.x + (animation.currentFrame * animation.width),
                    animation.y,
                    animation.width,
                    animation.height,
                    canvas.width/2 - this.width/2,
                    canvas.height/2 - this.heigth/2,
                    64,
                    64)
            }else{
                context.drawImage(playerSprite,
                    animation.x + (animation.currentFrame * animation.width),
                    animation.y,
                    animation.width,
                    animation.height,
                    -player.position.x + this.position.x + canvas.width/2 - this.width/2,
                    -player.position.y + this.position.y + canvas.height/2 - this.heigth/2,
                    64,
                    64)
            }

            if(showBoundingBoxes){
                if(this.id == player.id){
                    context.strokeStyle = this.color
                    context.strokeRect(canvas.width/2 - this.width/2, canvas.height/2 - this.heigth/2, this.width, this.heigth)
                }else{
                    context.strokeStyle = this.color
                    context.strokeRect(-player.position.x + this.position.x + canvas.width/2 - this.width/2, -player.position.y + this.position.y + canvas.height/2 - this.heigth/2, this.width, this.heigth)
                }
            }

            if(animation.frames <= 1){
                return
            }

            if(animation.skippedFrames < animation.framesToSkip){
                animation.skippedFrames++
            }else{
                animation.skippedFrames = 0
            }

            if(!animation.skippedFrames && (animation.currentFrame < animation.frames - 1)){
                animation.currentFrame++
            }else if(animation.currentFrame >= animation.frames - 1){
                animation.currentFrame = 0
            }
        }
    }

    let player = null
    let players = {}

    let gameInitialized = await new Promise((resolve, reject) => {
        socket.on('welcome', (serverStatus) => {        
            player = new Player(serverStatus.myStatus.id, serverStatus.myStatus.position, serverStatus.myStatus.width, serverStatus.myStatus.height, serverStatus.myStatus.boundingBox, serverStatus.myStatus.color, serverStatus.myStatus.moving)
    
            requestAnimationFrame(() => {
                clearCanvas()
                drawTilemap()
    
                players = {}
                Object.keys(serverStatus.onlinePlayers).forEach((id) => {
                    let player = serverStatus.onlinePlayers[id]
                    let onlinePlayer = new Player(player.id, player.position, player.width, player.height, player.boundingBox, player.color, player.moving)
    
                    players[id] = onlinePlayer
                    onlinePlayer.draw(onlinePlayer)
                })

                resolve(true)
            })
        })
    }).catch(() => {
        resolve(false)
    })

    if(!gameInitialized){
        throw 'Game could not initialize'
    }

    socket.on('update', (onlinePlayers) => {
        requestAnimationFrame(() => {
            clearCanvas()
            drawTilemap()
            drawAxis()

            Object.keys(players).forEach((id) => {
                players[id].position = onlinePlayers[id].position
                players[id].moving = onlinePlayers[id].moving
                players[id].boundingBox = onlinePlayers[id].boundingBox
                players[id].width = onlinePlayers[id].width
                players[id].heigth = onlinePlayers[id].heigth
                if(id == player.id){
                    player.position = onlinePlayers[id].position
                    player.moving = onlinePlayers[id].moving
                    player.boundingBox = onlinePlayers[id].boundingBox
                    player.width = onlinePlayers[id].width
                    player.heigth = onlinePlayers[id].heigth
                }

                if(!players[id].moving.left &&
                    !players[id].moving.left &&
                    !players[id].moving.left &&
                    !players[id].moving.left){
                        players[id].currentAnimation = 'stand'
                    }
                
                if(players[id].moving.left && players[id].moving.up){
                    players[id].currentAnimation = 'leftUp'
                }else if(players[id].moving.up && players[id].moving.right){
                    players[id].currentAnimation = 'rightUp'
                }else if(players[id].moving.right && players[id].moving.down){
                    players[id].currentAnimation = 'rightDown'
                }else if(players[id].moving.down && players[id].moving.left){
                    players[id].currentAnimation = 'leftDown'
                }else if(players[id].moving.left){
                    players[id].currentAnimation = 'left'
                }else if(players[id].moving.up){
                    players[id].currentAnimation = 'up'
                }else if(players[id].moving.right){
                    players[id].currentAnimation = 'right'
                }else if(players[id].moving.down){
                    players[id].currentAnimation = 'down'
                }

                players[id].draw()
            })
        })
    })

    socket.on('newPlayer', (player) => {
        players[player.id] = new Player(player.id, player.position, player.width, player.height, player.boundingBox, player.color, player.moving)
    })

    socket.on('playerLeft', (id) => {
        if(players[id]){
            delete players[id]
        }
    })

    window.addEventListener('keydown', (e) => {
        // console.log('left:', player.moving.left, 'right:', player.moving.right)
        switch(e.keyCode){
            case 37: // Left
                if(!player.moving.left){
                    socket.emit('moveLeft')
                }
            break;

            case 38: // Up
                if(!player.moving.up){
                    socket.emit('moveUp')
                }
            break;

            case 39: // Right
                if(!player.moving.right){
                    socket.emit('moveRight')
                }
            break;

            case 40: // Down
                if(!player.moving.down){
                    socket.emit('moveDown')
                }
            break;

            case 49: // Show Bounding Boxes
                showBoundingBoxes = !showBoundingBoxes ? true : false
                console.log('Show bounding boxes:', showBoundingBoxes)
            break;

            case 50: // Show Bounding Boxes
                showAxisGuidelines = !showAxisGuidelines ? true : false
                console.log('Show axis guidelines:', showBoundingBoxes)
            break;
        }
    })

    window.addEventListener('keyup', (e) => {
        switch(e.keyCode){
            case 37: // Left
                socket.emit('stopMovingLeft')
            break;

            case 38: // Up
                socket.emit('stopMovingUp')
            break;

            case 39: // Right
                socket.emit('stopMovingRight')
            break;

            case 40: // Down
                socket.emit('stopMovingDown')
            break;
        }
    })

    function clearCanvas(){
        context.fillStyle = '#FFFFFF'
        context.fillRect(0, 0, canvas.width, canvas.height)
    }

    function drawTilemap(){
        context.drawImage(tilemap, -player.position.x, -player.position.y)
    }

    function drawAxis(){
        if(!showAxisGuidelines){
            return
        }

        context.beginPath()
        context.strokeStyle = '#FF0000CC'
        context.moveTo(-player.position.x + canvas.width/2, -player.position.y - 1000)
        context.lineTo(-player.position.x + canvas.width/2, -player.position.y + canvas.height + 1000)
        context.stroke()
        
        context.beginPath()
        context.strokeStyle = '#00FF00CC'
        context.moveTo(-player.position.x - 1000, -player.position.y + canvas.height/2)
        context.lineTo(-player.position.x + canvas.width + 1000, -player.position.y + canvas.height/2)
        context.stroke()
    }
}
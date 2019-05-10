window.onload = async () => {
    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')

    canvas.width = 918
    canvas.height = 515

    let showBoundingBoxes = false

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

            context.drawImage(playerSprite,
                animation.x + (animation.currentFrame * animation.width),
                animation.y,
                animation.width,
                animation.height,
                this.position.x,
                this.position.y,
                64,
                64)

            if(showBoundingBoxes){
                context.strokeStyle = this.color
                context.strokeRect(this.boundingBox.left, this.boundingBox.top, this.width, this.heigth)
                console.log(this.width, '-', this.heigth)
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

    socket.on('movingLeft', () => {
        player.moving.left = true;
    })

    socket.on('stoppedMovingLeft', () => {
        player.moving.left = false;
    })

    socket.on('movingUp', () => {
        player.moving.up = true;
    })

    socket.on('stoppedMovingUp', () => {
        player.moving.up = false;
    })

    socket.on('movingRight', () => {
        player.moving.right = true;
    })

    socket.on('stoppedMovingRight', () => {
        player.moving.right = false;
    })

    socket.on('movingDown', () => {
        player.moving.down = true;
    })

    socket.on('stoppedMovingDown', () => {
        player.moving.down = false;
    })

    socket.on('update', (onlinePlayers) => {
        requestAnimationFrame(() => {
            clearCanvas()
            drawTilemap()

            Object.keys(players).forEach((id) => {
                players[id].position = onlinePlayers[id].position
                players[id].moving = onlinePlayers[id].moving
                players[id].boundingBox = onlinePlayers[id].boundingBox
                players[id].width = onlinePlayers[id].width
                players[id].heigth = onlinePlayers[id].heigth

                if(!players[id].moving.left &&
                    !players[id].moving.left &&
                    !players[id].moving.left &&
                    !players[id].moving.left){
                        players[id].currentAnimation = 'stand'
                    }
                
                if(players[id].moving.up){
                    players[id].currentAnimation = 'up'
                }
                if(players[id].moving.right){
                    players[id].currentAnimation = 'right'
                }
                if(players[id].moving.down){
                    players[id].currentAnimation = 'down'
                }
                if(players[id].moving.left){
                    players[id].currentAnimation = 'left'
                }

                if(players[id].moving.right && players[id].moving.up){
                    players[id].currentAnimation = 'rightUp'
                }
                if(players[id].moving.right && players[id].moving.down){
                    players[id].currentAnimation = 'rightDown'
                }
                if(players[id].moving.left && players[id].moving.down){
                    players[id].currentAnimation = 'leftDown'
                }
                if(players[id].moving.left && players[id].moving.up){
                    players[id].currentAnimation = 'leftUp'
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
                if(!showBoundingBoxes){
                    showBoundingBoxes = true
                    console.log('Show bounding boxes:', showBoundingBoxes)
                }else{
                    showBoundingBoxes = false
                    console.log('Show bounding boxes:', showBoundingBoxes)
                }
            break;
        }
    })

    window.addEventListener('keyup', (e) => {
        switch(e.keyCode){
            case 37: // Left
                if(player.moving.left){
                    socket.emit('stopMovingLeft')
                }
            break;

            case 38: // Up
                if(player.moving.up){
                    socket.emit('stopMovingUp')
                }
            break;

            case 39: // Right
                if(player.moving.right){
                    socket.emit('stopMovingRight')
                }
            break;

            case 40: // Down
                if(player.moving.down){
                    socket.emit('stopMovingDown')
                }
            break;
        }
    })

    function clearCanvas(){
        context.fillStyle = '#FFFFFF'
        context.fillRect(0, 0, canvas.width, canvas.height)
    }

    function drawTilemap(){
        context.drawImage(tilemap, 0, 0)
    }
}
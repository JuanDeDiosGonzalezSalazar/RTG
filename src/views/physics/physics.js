class Physics{
    static canvas
    static context
    static imageData
    static data
    static rows = []
}

let isPIP = false;

(async () => {
    await new Promise((resolve, reject) => {
        window.addEventListener('load', () => {
            resolve()
        })
    })

    canvas = Physics.canvas = document.getElementById('canvas')
    context = Physics.context = canvas.getContext('2d')

    canvas.width = 1920/16
    canvas.height = 1080/10

    Physics.imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    Physics.data = Physics.imageData.data

    for(let y = 0; y < canvas.height; y++){
        Physics.rows[y] = canvas.width * 4 * y
    }

    canvas.addEventListener('mousemove', (event) => {
    })

    let line = new Line(10, 10, 200, 100)
    // let polygon = new Polygon([[50, 300], [500, 100], [40, 40]])
    
    function clear(){
        context.fillStyle = "#FFFFFF"
        context.fillRect(0, 0, canvas.width, canvas.height)
    }

    let image = new Image()
    image.src = '/images/descarga.jpg'
    await new Promise((resolve, reject) => {
        image.onload = () => {
            resolve()
        }
    })

    function grayScale(){
        let imageData = Physics.context.getImageData(0, 0, canvas.width, canvas.height)
        let data = imageData.data

        for(let x = 0; x < data.length; x +=4){
            let average = (data[x] + data[x+1] + data[x+2])/3
            data[x]     = average
            data[x+1]   = average
            data[x+2]   = average
        }

        Physics.context.putImageData(imageData, 0, 0)
    }

    let point = new Point([0, 0])
    let polygon = new Polygon([[50, 100], [100, 100], [40, 40]])
    
    let frameCounter = 0;
    setInterval(() => {
        console.log('FPS:', frameCounter)
        frameCounter = 0
    }, 1000)

    function update(){
        frameCounter++
        clear()
        point.draw()
        if(point.location[0] < canvas.width-1){
            point.location[0]++
        }else{
            point.location[0] = 0
            if(point.location[1] < canvas.height-1){
                point.location[1]++
            }else{
                point.location[1] = 0
            }
        }
        isPIP = pointPolygonCollision(point.location, polygon.vertices)
        line.draw()
        polygon.draw()
        requestAnimationFrame(update)
    }
    
    update()
})()
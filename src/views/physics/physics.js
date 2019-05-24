class Physics{
    static canvas
    static context
    static imageData
    static data
    static rows = []
}

(async () => {
    await new Promise((resolve, reject) => {
        window.addEventListener('load', () => {
            resolve()
        })
    })

    canvas = Physics.canvas = document.getElementById('canvas')
    context = Physics.context = canvas.getContext('2d')

    canvas.width = 1920/3
    canvas.height = 1080/3

    Physics.imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    Physics.data = Physics.imageData.data

    for(let y = 0; y < canvas.height; y++){
        Physics.rows[y] = canvas.width * 4 * y
    }

    canvas.addEventListener('mousemove', (event) => {
    })

    let vertex = new Vertex(200, 10)
    let line = new Line(10, 10, 200, 100)
    let polygon = new Polygon([[50, 300], [500, 100], [40, 40]])

    function update(){
        vertex.draw()
        line.draw()
        polygon.draw()
        requestAnimationFrame(update)
    }

    update()
})()
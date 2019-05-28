window.addEventListener('load', () => {
    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')

    context.beginPath()
    context.moveTo(10, 10)
    context.lineTo(200, 100)
    context.closePath()
    context.stroke()
})
class Polygon{
    constructor(vertices){
        this.vertices = vertices
    }

    draw(){
        Physics.context.beginPath()
        Physics.context.strokeStyle = "#00FF00FF"
        Physics.context.moveTo(this.vertices[0][0], this.vertices[0][1])
        for(let c = 1; c < this.vertices.length; c++){
            Physics.context.lineTo(this.vertices[c][0], this.vertices[c][1])
        }
        Physics.context.closePath()
        if(isPIP){
            Physics.context.fillStyle = "#FF0000AA"
            Physics.context.fill()
        }
        Physics.context.stroke()
    }
}
class Polygon{
    constructor(polygon){
        this.polygon = polygon
    }

    draw(){
        Physics.context.beginPath()
        Physics.context.strokeStyle = "#00FF00FF"
        Physics.context.moveTo(this.polygon[0][0], this.polygon[0][1])
        for(let c = 1; c < this.polygon.length; c++){
            Physics.context.lineTo(this.polygon[c][0], this.polygon[c][1])
        }
        Physics.context.closePath()
        Physics.context.stroke()
    }
}
class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.m = (y2 - y1) / (x2 - x1)
        this.b = y1 - (this.m * x1)
        this.tinniestX = this.x1 < this.x2 ? this.x1 : this.x2
        this.biggestX = this.x1 > this.x2 ? this.x1 : this.x2
        this.tinniestY = this.y1 < this.y2 ? this.y1 : this.y2
        this.biggestY = this.y1 > this.y2 ? this.y1 : this.y2
        console.log(this)
    }

    draw() {
        Physics.context.beginPath()
        Physics.context.strokeStyle="#00FF00FF"        
        Physics.context.moveTo(this.x1, this.y1)
        Physics.context.lineTo(this.x2, this.y2)
        Physics.context.closePath()
        Physics.context.stroke()
        // let y = this.y1
        // if (this.m != Infinity) {
        //     for (let x = this.tinniestX; x <= this.biggestX; x++) {
        //         y = Math.round((this.m * x) + this.b)
        //         Physics.data[Physics.rows[y] + (x * 4)] = 0
        //         Physics.data[Physics.rows[y] + (x * 4) + 1] = 255
        //         Physics.data[Physics.rows[y] + (x * 4) + 2] = 0
        //         Physics.data[Physics.rows[y] + (x * 4) + 3] = 255
        //     }
        // }else{
        //     let x = this.x1
        //     for(let y = this.tinniestY; y < this.biggestY; y++){
        //         Physics.data[Physics.rows[y] + (x * 4)] = 0
        //         Physics.data[Physics.rows[y] + (x * 4) + 1] = 255
        //         Physics.data[Physics.rows[y] + (x * 4) + 2] = 0
        //         Physics.data[Physics.rows[y] + (x * 4) + 3] = 255
        //     }
        // }

        // Physics.context.putImageData(Physics.imageData, 0, 0)
    }
}
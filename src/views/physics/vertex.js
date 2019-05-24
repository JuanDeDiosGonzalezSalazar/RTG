class Vertex{
    constructor(x, y){
        this.x = x
        this.y = y
        this.imageData = Physics.context.createImageData(1, 1)
        this.data = this.imageData.data
    }

    draw(){
        Physics.context.fillStyle = "#00FF00FF";
        Physics.context.fillRect(this.x, this.y, 1, 1);
    }
}
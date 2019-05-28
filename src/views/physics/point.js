class Point{
    constructor(location){
        this.location = location
        this.imageData = Physics.context.createImageData(1, 1)
        this.data = this.imageData.data
    }

    draw(){
        Physics.context.fillStyle = "#00FF00FF";
        Physics.context.fillRect(this.location[0]-2, this.location[1]-2, 4, 4);
    }
}
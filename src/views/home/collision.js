function slopeOfLine(line) {
    return (line[1][1] - line[0][1]) / (line[1][0] - line[0][0])
}

function pointPointCollision(pointA, pointB){
    return (pointA[0] == pointB[0]) && (pointA[1] == pointB[1])
}

function pointLineCollision(point, line) {
    let m1 = slopeOfLine(line)

    if(isNaN(m1)) return pointPointCollision(point, line[0])

    let m2 = slopeOfLine([point, line[1]])
    
    if(isNaN(m2)) return true
    
    let lowestX = line[0][0] < line[1][0] ? line[0][0] : line[1][0]
    let highestX = line[0][0] > line[1][0] ? line[0][0] : line[1][0]
    let lowestY = line[0][1] < line[1][1] ? line[0][1] : line[1][1]
    let highestY = line[0][1] > line[1][1] ? line[0][1] : line[1][1]
    
    return (m1 == m2) && (point[0] >= lowestX) && (point[0] <= highestX) && (point[1] >= lowestY) && (point[1] <= highestY)
}

function pointPolygonCollision(point, polygon){
    return false
}
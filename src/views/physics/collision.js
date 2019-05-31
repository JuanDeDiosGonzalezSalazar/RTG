function slopeOfLine(line) {
    return (line[1][1] - line[0][1]) / (line[1][0] - line[0][0])
}

function pointPointCollision(pointA, pointB) {
    return (pointA[0] == pointB[0]) && (pointA[1] == pointB[1])
}

function pointLineCollision(point, line) {
    let m1 = slopeOfLine(line)

    if (isNaN(m1)) return pointPointCollision(point, line[0])

    let m2 = slopeOfLine([point, line[1]])

    if (isNaN(m2)) return true

    let lowestX = line[0][0] < line[1][0] ? line[0][0] : line[1][0]
    let highestX = line[0][0] > line[1][0] ? line[0][0] : line[1][0]
    let lowestY = line[0][1] < line[1][1] ? line[0][1] : line[1][1]
    let highestY = line[0][1] > line[1][1] ? line[0][1] : line[1][1]

    return (m1 == m2) && (point[0] >= lowestX) && (point[0] <= highestX) && (point[1] >= lowestY) && (point[1] <= highestY)
}

function pointPolygonCollision(point, polygon) {
    let currentVertex = null
    let nextVertex = null
    let clockwiseCounterAbove = 0
    let clockwiseCounterBelow = 0
    let counterClockwiseCounterAbove = 0
    let counterClockwiseCounterBelow = 0
    for (let vertex = 0; vertex < polygon.length; vertex++) {
        currentVertex = polygon[vertex]
        if (polygon[vertex + 1]) {
            nextVertex = polygon[vertex + 1]
        } else {
            nextVertex = polygon[0]
        }

        if (currentVertex[0] < nextVertex[0]) {
            if (currentVertex[0] <= point[0] && nextVertex[0] >= point[0]) {
                let m = slopeOfLine([currentVertex, nextVertex])
                let b = currentVertex[1] - (m * currentVertex[0])
                let y = (m * point[0]) + b
                if (y < point[1]) {
                    clockwiseCounterAbove++
                } else {
                    counterClockwiseCounterBelow++
                }
            }
        } else {
            if (currentVertex[0] >= point[0] && nextVertex[0] <= point[0]) {
                let m = slopeOfLine([currentVertex, nextVertex])
                let b = currentVertex[1] - (m * currentVertex[0])
                let y = (m * point[0]) + b
                if (y < point[1]) {
                    counterClockwiseCounterAbove++
                } else {
                    clockwiseCounterBelow++
                }
            }
        }
    }

    return {
        cwa: clockwiseCounterAbove,
        cwb: clockwiseCounterBelow,
        ccwa: counterClockwiseCounterAbove,
        ccwb: counterClockwiseCounterBelow
    }
}

function crossProduct(vector1, vector2) {
    return (vector1[0] * vector2[1]) - (vector1[1] * vector2[0])
}

function pointPolygonCollision2(point, polygon) {
    let windingNumber = 0;

    // Loop each edge
    for (let vertex = 0; vertex < polygon.length; vertex++) {
        currentVertex = polygon[vertex]
        if (polygon[vertex + 1]) {
            nextVertex = polygon[vertex + 1]
        } else {
            nextVertex = polygon[0]
        }

        let whereCrosses = 0 // 11 Avobe 0 On -1 Below

        // For a point inside a polygon, one edge should cross y axis once above and once below
        // Either counterclockwise or clockwise, otherwise, is outside
        // So we should only care for when an edge crosses a point y axis
        if ((currentVertex[0] < point[0]) && (nextVertex[0] > point[0])) {
            // An edge crossed y's point axis from  Left to Right
            let vector1 = [point[0] - currentVertex[0], point[1] - currentVertex[1]]
            let vector2 = [nextVertex[0] - currentVertex[0], nextVertex[1] - currentVertex[1]]
            let z = crossProduct(vector1, vector2)
            if(z > 0){
                windingNumber--
            }else if(z < 0){
                windingNumber++
            }
        } else if ((currentVertex[0] > point[0]) && (nextVertex[0] < point[0])) {
            // An edge crossed y's point axis from Right To Left
            let vector1 = [point[0] - currentVertex[0], point[1] - currentVertex[1]]
            let vector2 = [nextVertex[0] - currentVertex[0], nextVertex[1] - currentVertex[1]]
            let z = crossProduct(vector1, vector2)
            if(z > 0){
                windingNumber++
            }else if(z < 0){
                windingNumber--
            }
        } else {
            // Not crossin a y's point axis, then ignore this edge
            continue;
        }
    }

    return windingNumber == 0 ? true : false
}
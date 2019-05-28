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
    let nextVertex = null
    let currentVertex = null
    let clockwiseCounter = 0
    let counterClockwiseCounter = 0
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
                    clockwiseCounter++
                } else {
                    counterClockwiseCounter++
                }
            }
        } else {
            if (currentVertex[0] >= point[0] && nextVertex[0] <= point[0]) {
                let m = slopeOfLine([currentVertex, nextVertex])
                let b = currentVertex[1] - (m * currentVertex[0])
                let y = (m * point[0]) + b
                if (y < point[1]) {
                    counterClockwiseCounter++
                } else {
                    clockwiseCounter++
                }
            }
        }
    }

    return ((clockwiseCounter - counterClockwiseCounter) != 0) ? true : false
}

// function pointPolygonCollision(point, polygon) {
//     let nextVertex = null
//     let currentVertex = null
//     let clockwiseCounter = 0
//     let counterClockwiseCounter = 0
//     console.log(point)
//     console.log(polygon)
//     for (let vertex = 0; vertex < polygon.length; vertex++) {
//         currentVertex = polygon[vertex]
//         if (polygon[vertex + 1]) {
//             nextVertex = polygon[vertex + 1]
//         } else {
//             nextVertex = polygon[0]
//         }

//         if (currentVertex[0] < nextVertex[0]) {
//             console.log(`Current X(${currentVertex[0]}) < Next X(${nextVertex[0]})`)
//             console.log(`${currentVertex[0]} <= ${point[0]} && ${nextVertex[0]} >= ${point[0]}`)
//             if (currentVertex[0] <= point[0] && nextVertex[0] >= point[0]) {
//                 let m = slopeOfLine([currentVertex, nextVertex])
//                 let b = currentVertex[1] - (m * currentVertex[0])
//                 let y = (m * point[0]) + b
//                 console.log(`${y} at x(${point[0]})`)
//                 if (y < point[1]) {
//                     console.log('Crosses y axis clockwise')
//                     clockwiseCounter++
//                 } else {
//                     console.log('Crosses y axis counterclockwise')
//                     counterClockwiseCounter++
//                 }
//             }
//         } else {
//             console.log(`Current X(${currentVertex[0]}) > Next X(${nextVertex[0]})`)
//             console.log(`${currentVertex[0]} >= ${point[0]} && ${nextVertex[0]} <= ${point[0]}`)
//             if (currentVertex[0] >= point[0] && nextVertex[0] <= point[0]) {
//                 let m = slopeOfLine([currentVertex, nextVertex])
//                 let b = currentVertex[1] - (m * currentVertex[0])
//                 let y = (m * point[0]) + b
//                 console.log(`${y} at x(${point[0]})`)
//                 if (y < point[1]) {
//                     console.log('Crosses y axis counterclockwise')
//                     counterClockwiseCounter++
//                 } else {
//                     console.log('Crosses y axis clockwise')
//                     clockwiseCounter++
//                 }
//             }
//         }
//         console.log('')
//     }

//     console.log('Clockwise Count:', clockwiseCounter)
//     console.log('Counter-Clockwise Count:', counterClockwiseCounter)
//     return ((clockwiseCounter - counterClockwiseCounter) != 0) ? true : false
// }
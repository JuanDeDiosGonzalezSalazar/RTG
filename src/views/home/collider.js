// window.addEventListener('load', () => {
//     window.addEventListener('keydown',  (e) => {
//         console.log(e.keyCode)

//         switch(e.keyCode){

//         }
//     })
// })

function vertexIntersectsLine(vertex, line){
    console.log(vertex)
    console.log(line)

    let m1 = (line[1].y - line[0].y)/(line[1].x - line[0].x)
    if(!m1){
        console.log('Line is horizontal')
    }

    let m2 = (line[1].y - vertex.y)/(line[1].x - vertex.x)

    if(!m2){
        console.log('Vertex is horizontal to line:point2')
    }

    console.log('m1:', m1, 'm2:', m2)
    
    if(m1 == m2){
        return true
    }

    return false
}

vertexCollides = vertexIntersectsLine({x: 0, y:10}, [{x: 0, y:0},{x:10, y: 10}])
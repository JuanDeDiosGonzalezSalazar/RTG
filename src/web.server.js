const express = require('express')
const app = express()

port = 4000

app.use(express.static('./src/views'))
app.use(express.static('./src/assets'))
app.use(express.static('./node_modules/socket.io-client/dist'))

app.listen(port, () => {
    console.log("Web server on: ", port)
})
const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()

const port = process.env.WEB_SERVER_PORT

app.use(express.static('./src/views'))
app.use(express.static('./src/assets'))
app.use(express.static('./node_modules/socket.io-client/dist'))

app.listen(port, () => {
    console.log("Web server on: ", port)
})
const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()

const port = process.env.WEB_SERVER_PORT

console.log(`Directory: ${__dirname}`);

app.use(express.static(`src/views`));
app.use(express.static(`src/assets`));
app.use(express.static(`node_modules/socket.io-client/dist`));

const host = "localhost";

app.listen(port, host, () => {
    console.log(`Client running on http://${host}:${port}`);
})
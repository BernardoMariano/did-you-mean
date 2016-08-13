'use strict'

const server = require('./src/server.js')


let port = process.argv[2]

server.listen(port, () => {
    console.log(`Running on port ${ port }...`)
})

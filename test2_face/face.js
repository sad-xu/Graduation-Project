const http = require('http')
const express = require('express')
const router = express.Router()
// const cv = require('opencv4nodejs')

const app = express()
const server = http.Server(app)
const io = require('socket.io')(server)
app.use(express.static('dist'))

/*************/
io.on('connection', function(socket) {
	console.log('connection')
	socket.on('cSend', function(val) {
		console.log('get img');
		socket.emit('sSend', 'img location')
	})
})


/*************/

server.listen(8082, function() {
	console.log('listening port 8082...')
})
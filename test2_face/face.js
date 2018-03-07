const http = require('http')
const express = require('express')
const router = express.Router()
const cv = require('opencv4nodejs')

const app = express()
const server = http.Server(app)
const io = require('socket.io')(server)
app.use(express.static('dist'))

/*************/
const faceClassifier =  new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);


io.on('connection', function(socket) {
	socket.on('cSend', function(val) {
		const base64data = val.replace('data:image/jpeg;base64', '')
													.replace('data:image/png;base64','')
		const buffer = Buffer.from(base64data, 'base64');
		const img = cv.imdecode(buffer);  // img -> Mat
		let faceResult = getFace(img);
		let ret = [];
		faceResult.forEach((item) => {
			let obj = {
				width: item.width,
				height: item.height,
				x: item.x,
				y: item.y
			};
			ret.push(obj)
		})
		socket.emit('sSend', JSON.stringify(ret))
	})
})



function getFace(img) {
	let img_gray = img.cvtColor(cv.COLOR_BGR2GRAY);
	const faceResult = faceClassifier.detectMultiScale(img_gray);
	if (!faceResult.objects.length) {
		return [];
	} else {
		return faceResult.objects;
	}
}


/*************/

server.listen(8082, function() {
	console.log('listening port 8082...')
})
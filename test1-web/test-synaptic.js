const http = require('http')
const express = require('express')
const bodyParse = require('body-parser')
/**/
const router = express.Router()
const fs = require('fs')
const synaptic = require('synaptic')
// const cv = require('opencv4nodejs')
//const api = require('./router/api.js')

let data = fs.readFileSync('./machine/test.js', 'utf8');
const net = eval(data);
// console.log(typeof data);



const app = express();
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}))

app.use(express.static('dist'));

// 路由
router.post('/imgdata', (req, res) => {
	let	base64Data = req.body.data.replace(/^data:image\/\w+;base64,/,'');
	let dataBuffer = new Buffer(base64Data, 'base64');
	let imgName = './data/' + Date.now() + '.png'
	fs.writeFile(imgName, dataBuffer, err => {
		if (err) {
			console.log(err)
			res.json({'err':1,'msg':'save img failed'})
		} else {
			standalone(testSet[0].input) ///??
		}
	})
})


app.use('/api', router);

/***************************/

http.createServer(app).listen(8082, function() {
	console.log('listening port 8082...')
})
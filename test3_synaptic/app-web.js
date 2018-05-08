const http = require('http')
const fs = require('fs')
const express = require('express')
const bodyParse = require('body-parser')
const multiparty = require('multiparty')
const cv = require('opencv4nodejs')
const router = express.Router()
const app = express()

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}))

let netData = fs.readFileSync('./net.js', 'utf8')
const net = eval('(' + netData + ')');


const emnist = require('./emnist')
const set = emnist.set(10,10)
const testSet = set.test[4]

let pic = testSet.input,
		picArr = [[]];
pic.forEach(function(item,index) {
	item = Math.abs(item * 255 - 255);
	if (picArr[picArr.length-1].length < 28) {
		picArr[picArr.length-1].push(item)
	} else {
		picArr.push([item])
	}
})

const picMat = new cv.Mat(picArr, cv.CV_8UC1);

// console.log(picArr)
 // console.log(testSet[0].input.slice(100,150))
console.log(testSet.output)
cv.imshow('aaa', picMat)
 cv.waitKey();


router.post('/imgdata', (req, res) => {
	const form = new multiparty.Form()
	form.parse(req, function(err, fields, files) {
		console.log('come in')
		if (err) {console.log(err)}
		// // 二进制图片 -> base64
		// let data = '';
		// let stream = fs.createReadStream(files.data[0].path);
		// stream.setEncoding('base64');
		// stream.on('data', function(chunk) {
		//    data += chunk;
		// });
		// stream.on('end',function(){
		//    console.log(data);
		// });
		// stream.on('error', function(err){
		//    console.log(err.stack);
		// });
		console.log(files.data.length)
		cv.imreadAsync(files.data[0].path,cv.IMREAD_GRAYSCALE,(err, img) => {  //
  		img = img.resize(28,28);
  		cv.imshow('aaa', img)
  		cv.waitKey();
  		// img = img.threshold(100, 255, cv.THRESH_BINARY)  // 0 255 
  		let arr = img.getDataAsArray();  // mat -> arr
  		// 二维 -> 一维
  		arr = arr.join(',').split(',')
  		for (let i = 0; i < arr.length; i++) {
  			arr[i] = Number(Math.abs((Number(arr[i]-255))/255).toFixed(3));
  		}
// console.log(arr.slice(100,150))
  		// 识别
  		let ret = net(arr)
  		console.log('*****')
  		console.log(ret)
		})
	})

	res.json({'err':0,'msg':'ok'})
})
app.use('/api', router);

http.createServer(app).listen(8081, function() {
	console.log('listening port 8081')
})
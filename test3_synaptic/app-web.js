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

/*
const emnist = require('./emnist')
const set = emnist.set(10,20)
const testSet = set.test[13]

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
/*
/*
let picMat = new cv.Mat(picArr, cv.CV_8UC1);

let rotate = cv.getRotationMatrix2D(new cv.Point(14,14), -90)
picMat= picMat.warpAffine(rotate)
picMat = picMat.flip(1);  // 镜像旋转   0 x  1 y   -1 x+y
// console.log(picArr)
 // console.log(testSet[0].input.slice(100,150))
console.log(testSet.output)
cv.imshow('aaa', picMat)
 cv.waitKey();
*/

router.post('/imgdata', (req, res) => {
	const form = new multiparty.Form()
	form.parse(req, function(err, fields, files) {
		if (err) {console.log(err)}
		cv.imreadAsync(files.data[0].path,cv.IMREAD_GRAYSCALE,(err, img) => { 
  		// img = img.resize(28,28);
  		// img = img.threshold(100, 255, cv.THRESH_BINARY)  // 0 255
			img = img.flip(1);  // 镜像旋转   0 x  1 y   -1 x+y
  		let rotate = cv.getRotationMatrix2D(new cv.Point(13.5,13.5), 90) // 逆90
			img= img.warpAffine(rotate)
// cv.imshow('aaa', img)
//   		cv.waitKey();
  		let arr = img.getDataAsArray();  // mat -> arr
  		// 二维 -> 一维
  		arr = arr.join(',').split(',')
  		for (let i = 0; i < arr.length; i++) {
  			arr[i] = Number(Math.abs((Number(arr[i]-255))/255).toFixed(3));
  		}

  		// 识别
  		let ret = net(arr)
  		res.json({'err':0,'msg':ret})
		})
	})

	
})
app.use('/api', router);

http.createServer(app).listen(8081, function() {
	console.log('listening port 8081')
})


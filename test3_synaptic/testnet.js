const fs = require('fs')
const cv = require('opencv4nodejs')
const emnist = require('./emnist')
const set = emnist.set(20, 10)    // 2002 训练  78 测试

const trainingSet = set.training
const testSet = set.test

testSet.forEach(function(item, index) {
	let pic = item.input,
			picArr = [[]];
	pic.forEach(function(ite, ind) {
		ite = Math.abs(ite * 255 - 255);
		if (picArr[picArr.length-1].length < 28) {
			picArr[picArr.length-1].push(ite)
		} else {
			picArr.push([ite])
		}
	})
	let picMat = new cv.Mat(picArr, cv.CV_8UC1);
	let rotate = cv.getRotationMatrix2D(new cv.Point(14,14), -90)
	picMat= picMat.warpAffine(rotate)
	picMat = picMat.flip(1);  // 镜像旋转   0 x  1 y   -1 x+y
	cv.imshow('a'+index, picMat)
})
cv.waitKey();

// let data = fs.readFileSync('./net.js', 'utf8')
// const net = eval('(' + data + ')');

// testSet.forEach(function(item, index) {
// 	let ret = net(item.input);
	
// 	let res1 =  getMaxIndex(ret)
// 			res2 = getMaxIndex(item.output)
	
// 	console.log('####',item.input)
// 	console.log(res1.i, res2.i)
// 	console.log('rate: ' + res1.max)
// })


// function getMaxIndex(arr) {
// 	let max = 0,
// 			ret = -1;
// 	arr.forEach(function(item, index) {
// 		if (item > max) {
// 			max = item;
// 			ret = index
// 		}
// 	})
// 	return {max: max, i: ret}
// }







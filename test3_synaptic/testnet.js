const fs = require('fs')
const cv = require('opencv4nodejs')
const emnist = require('./emnist')
const set = emnist.set(2, 1)    // 2080 训练  1680 测试

const trainingSet = set.training
const testSet = set.test

console.log(testSet.length)
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
	// let rotate = cv.getRotationMatrix2D(new cv.Point(14,14), -90)
	// picMat= picMat.warpAffine(rotate)
	// picMat = picMat.flip(1);  // 镜像旋转   0 x  1 y   -1 x+y
	cv.imshow('a'+index, picMat)
})
cv.waitKey();


/*
let data = fs.readFileSync('./nets/net.js', 'utf8')
const net = eval('(' + data + ')');

function getMaxIndex(arr) {
	let max = 0,
			ret = -1;
	arr.forEach(function(item, index) {
		if (item > max) {
			max = item;
			ret = index
		}
	})
	return {max: max, i: ret}
}

let num = 0,   // 总数
		suc = 0;	// 成功数

let now = new Date();

testSet.forEach(function(item, index) {
	let ret = net(item.input);
	
	let res1 =  getMaxIndex(ret)
			res2 = getMaxIndex(item.output)
	
	num++;
	if (res1.i === res2.i) {
		suc++;
	}
})

console.log('总数：', num, '通过数：', suc)
console.log('成功率：', suc/num)
console.log('耗时', new Date() - now)

*/





const fs = require('fs')

const emnist = require('./emnist')
const set = emnist.set(20, 1)    // 2002 训练  78 测试

const trainingSet = set.training
const testSet = set.test

let data = fs.readFileSync('./net.js', 'utf8')
const net = eval('(' + data + ')');

testSet.forEach(function(item, index) {
	let ret = net(item.input);
	
	let res1 =  getMaxIndex(ret)
			res2 = getMaxIndex(item.output)
	
	console.log('####',item.input)
	console.log(res1.i, res2.i)
	console.log('rate: ' + res1.max)
})


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





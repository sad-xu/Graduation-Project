const fs = require('fs')

/* 准备数据 */
const emnist = require('./emnist')
const set = emnist.set(2080, 26)    // 2080 训练  78 测试
// const set = emnist.set(520, 78)    // 2080 训练  78 测试
const trainingSet = set.training
const testSet = set.test


/* 构建网络 */

const synaptic = require('synaptic')

const Layer = synaptic.Layer
const Network = synaptic.Network
const Trainer = synaptic.Trainer

const inputLayer = new Layer(784)
const hiddenLayer = new Layer(150)
const outputLayer = new Layer(26)

inputLayer.project(hiddenLayer)
hiddenLayer.project(outputLayer)

const myNetwork = new Network({
	input: inputLayer,
	hidden: [hiddenLayer],
	output: outputLayer
})

console.log('start train...')

const trainer = new Trainer(myNetwork)
trainer.train(trainingSet, {
	rate: 0.05,         // 学习率   0.1 			0.05-   0.06-7.6 0.07-9.45 0.08- 0.09-11.9  0.1-13.4
	interations: 1000,   // 迭代次数
	error: 0.1, 			 // 最小错误
	shuffle: true,     // 随机排序
	log: 1,						 // 
	cost: Trainer.cost.CROSS_ENTROPY
})

console.log('finish train...')

// 保存训练好的网络
let standalone = myNetwork.standalone();
fs.writeFile("./net0-05.js", standalone, function(err) {
	if (err) {
		console.log(err)
	} else {
		// logger.info("The file was saved!")
		console.log("The file was saved!");
	}
});


// standalone(testSet[0].input)   // 使用保存的网络测试

// for (let i = 0; i < testSet.length; i++) {
// 	let ret = myNetwork.activate(testSet[i].input);
// 	logger.info(ret)
// 	logger.info(testSet[i].output)
// }






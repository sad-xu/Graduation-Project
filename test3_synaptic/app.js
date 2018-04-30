const fs = require('fs')

/* 准备数据 */
const mnist = require('mnist')
const set = mnist.set(40, 3)    // 700 训练  20 测试

const trainingSet = set.training
const testSet = set.test


/* 构建网络 */
const synaptic = require('synaptic')

const Layer = synaptic.Layer
const Network = synaptic.Network
const Trainer = synaptic.Trainer

const inputLayer = new Layer(784)
const hiddenLayer = new Layer(100)
const outputLayer = new Layer(10)

inputLayer.project(hiddenLayer)
hiddenLayer.project(outputLayer)

const myNetwork = new Network({
	input: inputLayer,
	hidden: [hiddenLayer],
	output: outputLayer
})


const trainer = new Trainer(myNetwork)
trainer.train(trainingSet, {
	rate: 0.2,         // 学习率
	interations: 20,   // 迭代次数
	error: 1, 			 // 最小错误
	shuffle: true,     // 随机排序
	log: 1,						 // 
	cost: Trainer.cost.CROSS_ENTROPY
})


let standalone = myNetwork.standalone();   // 保存训练好的网络

fs.writeFile("./net.js", standalone, function(err) {
	if (err) {
  	console.log(err);
	} else {
		console.log("The file was saved!");
	}
});


// standalone(testSet[0].input)   // 使用保存的网络测试

for (let i = 0; i < testSet.length; i++) {
	console.log(myNetwork.activate(testSet[i].input));
	console.log(testSet[i].output);
}






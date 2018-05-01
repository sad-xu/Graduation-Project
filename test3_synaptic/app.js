const fs = require('fs')

/* log */
const log4js = require('log4js')
log4js.configure({
	appenders: { 
		emnistLog: { type: 'file', filename: './logs/log.log' },
		console: {type: 'file', filename:'./logs/train.log' }
	},
  categories: { 
  	emnist: {appenders: ['emnistLog'], level: 'trace'},
  	default: { appenders: ['console'], level: 'trace' }
  },
  replaceConsole: true
})

const logger = log4js.getLogger('emnist')   //emnistLog	


//  替换 console.log
const logger2 = log4js.getLogger('console');
console.log = logger.info.bind(logger2);


/* 准备数据 */
const emnist = require('./emnist')
const set = emnist.set(2002, 78)    // 2002 训练  78 测试

const trainingSet = set.training
const testSet = set.test


/*
	{
		training: [
			{
				input: [0,0,0,0,....784],
				output: [0,1,0,0,0,0,0,0,0,0]
			}, {
	
			}
		],
		test: [
			{},
			{}
		]
	}
*/




/* 构建网络 */
const synaptic = require('synaptic')

const Layer = synaptic.Layer
const Network = synaptic.Network
const Trainer = synaptic.Trainer

const inputLayer = new Layer(784)
const hiddenLayer = new Layer(100)
const outputLayer = new Layer(26)

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
	error: 0.1, 			 // 最小错误
	shuffle: true,     // 随机排序
	log: 1,						 // 
	cost: Trainer.cost.CROSS_ENTROPY
})


// 保存训练好的网络
let standalone = myNetwork.standalone();
fs.writeFile("./net.js", standalone, function(err) {
	if (err) {
		console.log(err)
	} else {
		// logger.info("The file was saved!")
		console.log("The file was saved!");
	}
});


// standalone(testSet[0].input)   // 使用保存的网络测试

for (let i = 0; i < testSet.length; i++) {
	let ret = myNetwork.activate(testSet[i].input);
	logger.info(ret)
	logger.info(testSet[i].output)
}






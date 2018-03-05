const http = require('http')
const express = require('express')
const bodyParse = require('body-parser')
/**/
const router = express.Router()
const fs = require('fs')
const cv = require('opencv4nodejs')
//const api = require('./router/api.js')

const app = express();
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:true}))

app.use(express.static('dist'));
// app.use('/api', api)

/**************************/
const {
  lccs,     // ['a', ... ,'z']
  centerLetterInImage,
  saveConfusionMatrix	
} = require('./machine/OCRTools')

const svm = new cv.SVM({
	kernelType: cv.ml.SVM.RBF,
	c: 12.5,
	gamma: 0.50625
});

const hog = new cv.HOGDescriptor({
  winSize: new cv.Size(40, 40),
  blockSize: new cv.Size(20, 20),
  blockStride: new cv.Size(10, 10),
  cellSize: new cv.Size(10, 10),
  L2HysThreshold: 0.2,
  nbins: 9,
  gammaCorrection: true,
  signedGradient: true
});

const computeHOGDescriptorFromImage = (img, isIorJ) => {
	let im = img;
	if (im.rows !== 40 || im.cols !== 40) {
		im = im.resize(40, 40);
	}
	im = centerLetterInImage(im, isIorJ);
	if (!im) {
		return null;
	}
	return hog.compute(im);
}

// 加载模型
svm.load('./machine/lcletters.xml'); 

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
			let img = cv.imread(imgName)
			let desc = computeHOGDescriptorFromImage(img, true);
			if (!desc) {
				res.json({'err':0, 'msg': -1})
			} else {
				let predictRet = svm.predict(desc);		
				res.json({'err':0,'msg': lccs[predictRet]});
			}	
		}
	})
})


app.use('/api', router);

/***************************/

http.createServer(app).listen(8082, function() {
	console.log('listening port 8082...')
})
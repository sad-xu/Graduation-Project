const fs = require('fs')
const cv = require('opencv4nodejs')
const {
  lccs,     // ['a', ... ,'z']
  centerLetterInImage,
  saveConfusionMatrix	
} = require('./OCRTools')

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



svm.load('./data/lcletters.xml');

//const img = cv.imread('./data/testdata/z/z3.png')
let img = cv.imread('./data/a.jpg')

let desc = computeHOGDescriptorFromImage(img, true);
if (!desc) {
	console.log('can not find')
} else {
	let predictRet = svm.predict(desc);
	console.log('find: ' + lccs[predictRet])
}




cv.imshow('img', img)
cv.waitKey()

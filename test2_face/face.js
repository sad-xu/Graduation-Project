const fs = require('fs')
const cv = require('opencv4nodejs')


let img = cv.imread('./data_face/b.jpg').resize(300,300)
let img_gray = img.cvtColor(cv.COLOR_BGR2GRAY)


/***** 标注图像 ******/
const drawRect = (image, rect, color, opts = {thickness:2}) => {
	image.drawRectangle(rect, color, opts.thickness, cv.LINE_8)
}

const drawBlueRect = (image, rect, opts ={thickness:2}) => {
	drawRect(image, rect, new cv.Vec(255,0,0), opts)
}
const drawGreenRect = (image, rect, opts ={thickness:2}) => {
	drawRect(image, rect, new cv.Vec(0,255,0), opts)
}
/**********/


const sortByNumDetections = result => {return result.numDetections
  .map((num, idx) => ({ num, idx }))
  .sort(((n0, n1) => n1.num - n0.num))
  .map(({ idx }) => idx);
}

// 
const faceClassifier =  new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);
const eyeClassifier = new cv.CascadeClassifier(cv.HAAR_EYE);
const faceResult = faceClassifier.detectMultiScale(img_gray);

if (!faceResult.objects.length) {
  console.log('no face!');
} else {
	faceResult.objects.forEach((item, index) => {
		let faceRect = item;
		let faceRegion = img.getRegion(faceRect);
		let eyeResult = eyeClassifier.detectMultiScale(faceRegion);
		console.log(eyeResult)
		let eyeRects = sortByNumDetections(eyeResult)
	  	.slice(0, 2)
	  	.map(idx => eyeResult.objects[idx]);
	  drawBlueRect(img, faceRect);
		eyeRects.forEach(eyeRect => drawGreenRect(faceRegion, eyeRect));	
	})
}


// const faceRect = faceResult.objects[sortByNumDetections(faceResult)[0]];
// const faceRegion = img.getRegion(faceRect);
// const eyeResult = eyeClassifier.detectMultiScale(faceRegion);
// const eyeRects = sortByNumDetections(eyeResult)
  // .slice(0, 2)
  // .map(idx => eyeResult.objects[idx]);

// 标注
// drawBlueRect(img, faceRect);
// eyeRects.forEach(eyeRect => drawGreenRect(faceRegion, eyeRect));

cv.imshow('img', img)
cv.waitKey()
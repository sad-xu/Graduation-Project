// MNIST digits
var MNIST = [];

// 图片尺寸 28 x 28
var size = 28;

// 原始数据
var raw = [
  require('./data/1.json').data,
  require('./data/2.json').data,
  require('./data/3.json').data,
  require('./data/4.json').data,
  require('./data/5.json').data,
  require('./data/6.json').data,
  require('./data/7.json').data,
  require('./data/8.json').data,
  require('./data/9.json').data,
  require('./data/10.json').data,
  require('./data/11.json').data,
  require('./data/12.json').data,
  require('./data/13.json').data,
  require('./data/14.json').data,
  require('./data/15.json').data,
  require('./data/16.json').data,
  require('./data/17.json').data,
  require('./data/18.json').data,
  require('./data/19.json').data,
  require('./data/20.json').data,
  require('./data/21.json').data,
  require('./data/22.json').data,
  require('./data/23.json').data,
  require('./data/24.json').data,
  require('./data/25.json').data,
  require('./data/26.json').data
];

[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 ,22, 23, 24, 25, 26].forEach(function (id) {
  // mnist digit
  var digit = {
    id: id - 1
  };

  // raw data
  digit.raw = raw[digit.id];

  // 数量取28的倍数
  digit.length = digit.raw.length / (size * size) | 0;

  digit.get = function (_which) {
    var which = _which;
    if ('undefined' == typeof which || which > digit.length || which < 0) {
      which = Math.random() * digit.length | 0;
    }

    var sample = [];
    for (
      var length = size * size,
      start = which * length,
      i = 0;
      i < length;
      sample.push(digit.raw[start + i++])
    );
    return sample;
  }

  digit.range = function (start, end) {
    if (start < 0)
      start = 0;
    if (end >= digit.length)
      end = digit.length - 1;
    if (start > end) {
      var tmp = start;
      start = end;
      end = tmp;
    }
    var range = [];
    for (
      var i = start;
      i <= end;
      range.push(digit.get(i++))
    );
    return range;
  }

  digit.set = function (start, end) {
    var set = [];
    var output = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0 ];
    output[digit.id] = 1;
    var range = digit.range(start, end);
    for (
      var i = 0;
      i < range.length;
      set.push({
        input: range[i++],
        output: output
      })
    );
    return set;
  }

  MNIST.push(digit);
});


MNIST.set = function (_training, _test) {
  var training = _training / 10 | 0;
  var test = _test / 10 | 0;

  if (training < 1)
    training = 1;
  if (test < 1)
    test = 1;

  if (training + test + 1 > MNIST.__MINLENGTH) {
    console.warn('There are not enough samples to make a training set of ' + training + ' elements and a test set of ' + test + ' elements.');
    if (training > test) {
      test = MNIST.__MINLENGTH * (test / training);
      training = MNIST.__MINLENGTH - training;
    }
    else {
      training = MNIST.__MINLENGTH * (training / test);
      test = MNIST.__MINLENGTH - test;
    }
  }

  var trainingSet = [];
  var testSet = [];

  for (var i = 0; i < 26; i++) {
    trainingSet = trainingSet.concat(MNIST[i].set(0, training - 1));
    testSet = testSet.concat(MNIST[i].set(training, training + test - 1));
  }

  return {
    training: shuffle(trainingSet),
    test: shuffle(testSet)
  }
}

// 打乱数据
function shuffle(v) {
  for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
  return v;
};

/** 导出 **/
// CommonJS & AMD
if (typeof define !== 'undefined' && define.amd) {
  define([], function () { return MNIST });
}

// Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MNIST;
}

// Browser
if (typeof window == 'object') {
  (function () {
    var old = window['mnist'];
    MNIST.ninja = function () {
      window['mnist'] = old;
      return MNIST;
    };
  })();

  window['mnist'] = MNIST;
}



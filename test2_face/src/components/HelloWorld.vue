<template>
  <div class="main">
    <video id="video" width="300" height="300" autoplay></video>
    <canvas id="canvas" width="200" height="200"></canvas>
    <input class="start-button" type="button" value="START" @click="startVideo()">
    <!-- useless buttons -->
    <input class="else-button" type="button" @click="sendImg('img1')" value="send"/>
    <input class="else-button"  type="button" value="getimg" @click="getImg()">
    <input class="else-button"  type="button" value="stop" @click="stop()">
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      info: `1.检测摄像头，若无摄像头则切换成图片上传模式
             2.开启摄像，定时上传截图（socket），服务器返回坐标
             3.接收坐标，显示`,
      video: null,
      canvas: null,
      context: null
    }
  },
  mounted() {
    this.video = document.getElementById('video');
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.context.strokeStyle = 'red';
    this.context.lineWidth = 10;
  },
  sockets: {
    connect: () => {
      console.log('connected success')
    },
    sSend: function(val) {
      this.drawFace(val)
    }
  },
  methods: {
    sendImg: function(val) {  // 发送图片
      this.$socket.emit('cSend', val)
    },
    getImg: function() {    // 获取图片
      this.context.drawImage(this.video,0,0,200,200);
      let imgData = this.canvas.toDataURL('img/png', 0.6)
      this.sendImg(imgData)
    },
    startVideo: function() {  // 开启摄像头
      //获得摄像头并显示到video区域
      let video = document.getElementById('video');
      let videoObj = {"video": true};
      let errBack = function() {
        console.log('video failed')
      };
      if (navigator.webkitGetUserMedia) { // WebKit-prefixed  
          navigator.webkitGetUserMedia(videoObj, function(stream) {  
              video.src = window.URL.createObjectURL(stream);  
              video.play();  
          }, errBack);  
      } else if (navigator.mozGetUserMedia) { // Firefox-prefixed  
          navigator.mozGetUserMedia(videoObj, function(stream) {  
              video.src = window.URL.createObjectURL(stream);  
              video.play();  
          }, errBack);  
      } else if (navigator.getUserMedia) { // Standard  
          navigator.getUserMedia(videoObj, function(stream) {  
            video.src = stream;
            video.play();     
          }, errBack);  
      }

      let that = this;
      let repeat = function() {
        that.getImg();
        setTimeout(repeat, 40);
      }
      setTimeout(repeat, 1000);
    },
    stop: function() {
      this.video.pause();
    },
    drawFace: function(val) {
      let localArr = JSON.parse(val);
      let that = this;
      localArr.forEach(function(item) {
        that.drawCanvasFace(item.x,item.y,item.width,item.height);
      })
    },
    drawCanvasFace: function(x, y, w, h) {
      let c = this.context;
      c.strokeRect(x,y,w,h);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: gray;
}

video {
  display: none;
}
canvas {
  margin: 30px 0 50px;
  border: 1px solid black;
  box-shadow: 0 5px 40px;
}

.else-button {
  display: none;
}

.start-button {
  width: 100px;
  height: 40px;
}
</style>

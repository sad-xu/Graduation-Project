<template>
  <div class="main">
    <input type="button" @click="sendImg('img1')" value="send"/>
    <video id="video" width="300" height="300" autoplay></video>
    <canvas id="canvas" width="300" height="200"></canvas>
    <input type="button" value="startVideo" @click="startVideo()">
    <input type="button" value="getimg" @click="getImg()">
    <input type="button" value="stop" @click="stop()">
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
  },
  sockets: {
    connect: () => {
      console.log('connected success')
    },
    sSend: (val) => {
      console.log(val)
    }
  },
  methods: {
    sendImg: function(val) {  // 发送图片
      this.$socket.emit('cSend', val)
    },
    getImg: function() {    // 获取图片
      this.context.drawImage(this.video, 0, 0, 300, 200);
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
    },
    stop: function() {
      this.video.pause();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {

}
</style>

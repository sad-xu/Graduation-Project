<template>
  <div class="main">
    <video id="video" width="300" height="300"></video>
    <canvas id="canvas" width="300" height="300"></canvas>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      info: `1.检测摄像头，若无摄像头则切换成图片上传模式
             2.开启摄像，定时上传截图（socket），服务器返回坐标
             3.接收坐标，显示`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {

}
</style>

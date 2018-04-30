<template>
  <div class="hello">
    <div class="draw-wrapper">
      <canvas id="canvas" width="300px" height="300px"></canvas>
    </div>
    <div class="menus">
      <span class="button" id="clean-button">清空</span>
      <span class="button" @click="getImg()">识别</span>
    </div>
    <p class="result">识别结果：<span>{{ret}}</span></p>
    <canvas id="canvas2" width="40px" height="40px"></canvas>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      canvas1: null,
      canvas2: null,
      context2: null,
      imgData: '',
      ret: ''
    }
  },
  mounted() {
    // width 300; height  300
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');    

    this.canvas1 = canvas;
    this.canvas2 = document.getElementById('canvas2');
    this.context2 = this.canvas2.getContext('2d'); 

    context.lineWidth = 10;    
    context.strokeStyle = '#000000';

    // 移动端    
    canvas.addEventListener('touchstart',e => {
      e.preventDefault();        
      var touches = e.changedTouches;        
      var x = touches[0].clientX - canvas.offsetLeft;        
      var y = touches[0].clientY - canvas.offsetTop;
      context.beginPath();
      context.moveTo(x,y);   
    }, false);    
    canvas.addEventListener('touchmove',e => {
      e.preventDefault();        
      var touches = e.changedTouches;        
      var x = touches[0].clientX - canvas.offsetLeft;        
      var y = touches[0].clientY - canvas.offsetTop;        
      context.lineTo(x,y);        
      context.stroke();   
    }, false);
    canvas.addEventListener('touchend', e => {
      context.closePath();
    })

    // PC端
    canvas.addEventListener('mousedown', e => {
      e.preventDefault();        
      var x = e.clientX - canvas.offsetLeft;        
      var y = e.clientY - canvas.offsetTop;
      context.beginPath() 
      context.moveTo(x,y);        
      canvas.onmousemove = function(t){            
        t.preventDefault();            
        var xx = t.clientX - canvas.offsetLeft;            
        var yy = t.clientY - canvas.offsetTop;         
        context.lineTo(xx,yy);            
        context.stroke();
      }
    }, false);    
    canvas.addEventListener('mouseup', e => {
      context.closePath();
      canvas.onmousemove = null;
    }, false);

    //清空画布
    document.getElementById('clean-button').addEventListener('click', (e) => {
      context.fillStyle="#ffffff";  
      context.beginPath();  
      context.fillRect(0,0,300,300);  
      context.closePath();
      this.ret = '';
    }, false);
  },
  methods: {
    getImg() {
      this.context2.fillStyle="#ffffff";  
      this.context2.beginPath();  
      this.context2.fillRect(0,0,40,40);  
      this.context2.closePath(); 
      this.context2.drawImage(this.canvas1, 0,0,300,300,0,0,40,40);
      this.imgData = this.canvas2.toDataURL('img/png');
    }
  }, 
  watch: {
    imgData: function() {
      this.$http.post('/api/imgdata', {data: this.imgData})
          .then(res => {
            if (res.data.err === 0) {
              let msg = res.data.msg;
              if (msg === -1) {
                this.ret = '无法识别'
              } else {
                this.ret = msg;
              }
            } else {
              alert(res.data.err)
            }
          })
          .catch(err => {
            alert(err)
          })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 绘图区 */
.draw-wrapper {
  text-align: center;
}
#canvas {
  box-shadow: 0 5px 40px;
  z-index: 10;
  margin: 20px 0 20px 0;
  background-color: white;
}

/* 操作区 */
.menus {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.button {
  display: inline-block;
  width: 90px;
  height: 45px;
  font-size: 23px;
  color: white;
  text-align: center;
  line-height: 45px;
  background-color: grey;
  box-shadow: 0 5px 10px;
  cursor: pointer;
}

/* 隐藏canvas */
#canvas2 {
  visibility: hidden;
}

.result {
  margin: 20px 0 0 50px;
  font-size: 20px;
}
.result span {
  color: red;
  font-size: 30px;
}
</style>

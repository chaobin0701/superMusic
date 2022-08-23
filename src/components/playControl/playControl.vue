<template>
    <!-- 底部区域 -->
    <div class="bottom">
      <!-- 播放模式的显示 -->
      <div class="playMode" 
      :class="{'mode-0': playMode == 0 , 'mode-1': playMode == 1 , 'mode-2': playMode == 2}"

      >
        <span>
          {{playMode == 0 ? '顺序播放':'' }} 
          {{playMode == 1 ? '随机播放':'' }}
          {{playMode == 2 ? '单曲循环':'' }}
        </span>
      </div>
      <!-- 上部分 - 评论、喜欢、评论-->
      <div class="upprt-part">
        <span class=" iconfont" :class="{'like': isLike}" @click="likeBtn">{{isLike?'&#xe8c3;':'&#xe8ab;'}}</span>
        <span class="download iconfont" @click="downLoad">&#xebb4;</span>
        <span class="comment iconfont" @click="commentBtn">&#xe607;</span>
      </div>

      <!-- 中间部分 - 播放条 -->
      <div class="middle-part">
        <span class="song-newTime">{{songNewTime | toTime}}</span>
        <div class="progress">
          <div class="pro-wrapper">
            <div class="pro-bottom" ref="process_bottom"
                @touchmove="sliderTouchMove" 
                @touchstart = "sliderTouchStart" 
                > <div>
              </div>
            </div>
            <div class="pro-top" ref="music_process"
              @touchmove="sliderTouchMove" 
              @touchstart = "sliderTouchStart" >
              <div class="slider-pointer"></div>
            </div>
          </div>
        </div>
        <span class="song-time">{{songTime | toTime}}</span>
      </div>

      <!-- 下部分 - 播放按钮 -->
      <div class="lower-port">
        <span class="play-mode iconfont" @click="changePlayMode">
          {{playMode == 0 ? '&#xe609;':'' }} 
          {{playMode == 1 ? '&#xe622;':'' }}
          {{playMode == 2 ? '&#xe608;':'' }}
          <!--  0 -> 顺序播放(默认)   1 -> 随机播放    2 -> 单曲循环 -->
        </span>
        <span class="last-song iconfont"  @click="lastSong">&#xe610;</span>
        <span class="play iconfont" @click="play" >{{playSong?'&#xe624;':'&#xe619;'}}</span>
        <span class="next-song iconfont"  @click="nextSong">&#xe611;</span>
        <span class="song-list iconfont" @click="showList">&#xe6bf;</span>
      </div>


      <!-- Music - 歌曲 -->
    <audio :src="song_src" ref="play"  @timeupdate="getCurr" @canplay="onload" ></audio>
     <!-- @timeupdate : 当视频播放位置已经改变，显示视频当前播放位置（一秒计）: -->
    </div>
</template>

<script>
export default {
    name:"playControl",
    data(){
        return{
            isLike:'',//歌曲是否喜欢 true-喜欢 | flase-不喜欢
            playMode:0 ,//播放模式 0 -> 顺序播放(默认)   1 -> 随机播放    2 -> 单曲循环
            middlePart:'', //用于渲染歌曲的进度 -
            songNewTime:'00:00', //歌曲正在播放的时间 一开始未00:00
            songTime:'', //歌曲的时长 
            playSong:true,//歌曲是否播放 true-暂停 | false-播放  
            song_src:"",//歌曲src 用来渲染到dom元素的src
            jindu:'',
            playModeChange:'',//改变播放模式
            sliderWidth:'', //进度条宽度
            viewWidth:'',//页面宽度
            cankao:'', // (页面宽度-进度条宽度) / 2
            touchStartY:'',
            touchMoveY:'',
            touchEndY:'',
        }
    },
    props:[
        'id',//播放的歌曲
        'songList_1',//传递过来的假json数据
        'showSongList',//是否显示歌曲列表
        'songNumber', //歌曲数量
        'showComment',//显示评论
    ],  
    computed:{
      url(){
        return this.$axios.defaults.baseURL
      }
    },
    created:function(){
        const songList  = this.songList_1[this.id]
        this.isLike = songList.isLike
        this.song_src = this.url + songList.audio.slice(8)
    },
    mounted:function(){
        //将进度条的dom挂载到this.jindu上
        this.jindu = this.$refs.music_process 
        this.sliderWidth = this.$refs.music_process.clientWidth
        this.viewWidth =  document.body.clientWidth
        this.cankao = (this.viewWidth -  this.sliderWidth) /2
    },
    methods:{
      play:function(){  // 方法解释: 播放按钮的方法
        if(this.playSong){
          this.playSong = false
          this.$refs.play.play();
        }else{
          this.playSong = true
          this.$refs.play.pause();
         }  
      },
      lastSong:function(){ // 方法解释: 下一首按钮的方法
        switch(this.playMode){
			  		case 0: //顺序播放(默认)
			  		if(this.id === 0){
                        this.$emit("changeId",this.songNumber - 1) 
                    }else{
                        this.$emit("changeId",(this.id -1) % this.songNumber) 
                    } 
			  		break;

			  		case 1://随机播放
			  			var index = Math.round(Math.random()* (this.songNumber -1))
                    while(this.id == index){
                        // while循环判断 若生成的index随机数和现在的播放的歌曲序号相同 则进入循环重新取值 直到生成的随机数和现在歌曲的序号不相等
                        index = Math.round(Math.random()* (this.songNumber -1))
                    }
                        this.$emit("changeId",index) 
                        break;
              	
            case 2://单曲循环
			  			this.$refs.play.currentTime = 0
			  			break;

			  		default://正常不会有这种情况的...
			  			console.log('程序出错了');
			  			break;
			  }
      },
      nextSong:function(){   
        // 方法解释: 上一首按钮的方法
         switch(this.playMode){
			  		case 0: //顺序播放(默认)
                this.$emit("changeId",(this.id +1) % this.songNumber) 
			  			break;
			  		case 1://随机播放
			  			var index = Math.round(Math.random()* (this.songNumber -1))
                while(this.id == index){
                    // while循环判断 若生成的index随机数和现在的播放的歌曲序号相同 则进入循环重新取值 直到生成的随机数和现在歌曲的序号不相等
                    index = Math.round(Math.random()* (this.songNumber -1))
                }
                this.$emit("changeId",index) 
			  			break;
              	
            case 2://单曲循环
			  			this.$refs.play.currentTime = 0
			  			break;

			  		default://正常不会有这种情况的...
			  			console.log('程序出错了');
			  			break;
			  }
      },
      changePlayMode:function(){ // 方法解释: 模式按钮的方法,改变模式  
        // 方法解释: 模式按钮的方法,改变模式         
        //  playMode = 0 -> 顺序播放(默认)   1 -> 随机播放    2 -> 单曲循环
        this.playMode = ++this.playMode % 3
        this.playModeChange=false;
        this.playModeChange=true;
      },
      getCurr:function(){  // 方法解释: audio元素播放的时候会调用这个方法 !多次调用
        this.songNewTime =  parseInt(this.$refs.play.currentTime)
        if(this.$refs.play.ended){
          this.nextSong()
          // this.$emit("showSongList",!this.showSongList) 
          // this.id =  ++this.id % this.songList.length
        }
      },
      likeBtn:function(){ // 方法解释: 喜欢按钮的方法
        this.isLike  = !(this.isLike)
        this.songList_1[this.id].isLike = !(this.songList_1[this.id].isLike)
      },
      sliderTouchMove:function(ev){
        this.touchMoveY = ev.changedTouches[0].pageX - this.cankao
        this.touchEndY = this.touchMoveY - this.sliderWidth 
        if(this.touchEndY >= -5 || this.touchEndY <= (-this.sliderWidth) ){
          //不做处理
        }else{
          this.jindu.style.transform = "translateX(" + this.touchEndY + "px)" //进行偏移
        }
        
        // 实时的进度渲染
        var i = parseInt ((1 + this.touchEndY/this.sliderWidth) * 100)
        if(i < 0){
          this.jindu.style.transform = "translateX(" + -100 + "%)" 
          this.$refs.play.currentTime = 0
        }else if(i > 100){
          this.jindu.style.transform = "translateX(" + -2 + "%)" 
          this.$refs.play.currentTime = this.songTime
        }else{
          this.jindu.style.transform = "translateX(" + 100 - i + "%)" 

          this.$refs.play.currentTime = this.songTime * (i / 100)
        }
      },
      sliderTouchStart:function(ev){
        this.touchStartY = ev.changedTouches[0].pageX
      },//获取手指按下的位置
      onload:function(){ // 监听歌曲是否加载完毕 加载完之后执行这个方法
        this.songTime =   parseInt(this.$refs.play.duration)
      },
      showList:function(){ this.$emit("showSongList",!this.showSongList)} ,// 方法解释: 显示 隐藏 歌曲列表的方法
      commentBtn:function(){this.$emit("changeShowComment",!this.showComment)},
      downLoad:function(){window.open(this.song_src)}
    },
    watch:{
        id(id,oldId){//方法解释: 监听id的变换
        this.song_src =  this.url + this.songList_1[id].audio.slice(8)
        this.isLike = this.songList_1[id].isLike
        this.playSong = true
        },
        songNewTime(time,oldTime){
            this.middlePart =  parseInt(this.songNewTime / this.songTime * 100)
            this.jindu.style.transform = "translateX(-" + (101 - this.middlePart ) + "%)"
            this.$emit("timeChange",this.middlePart,this.songNewTime) 
        }
        
    },
    filters: {// 过滤器解释: toTime - 秒数转化为mm:ss形式
    toTime(sec) { 
      let s = sec % 60 < 10 ? ('0' + sec % 60) : sec % 60
      let min = Math.floor(sec / 60) < 10 ? ('0' + Math.floor(sec / 60)) : Math.floor(sec / 60)
      min === min ? min=min :  min = '00';
      s === s ?  s=s : s = '00';
      return min + ':' + s
    }
  }

   
}
</script>

<style scoped>
/* 底部区域 */
.bottom{
    height: 1.5rem;
    box-sizing: border-box;
    position: fixed;
    width: 100%;
    bottom: .2rem;
}

  /* 播放模式 */
  @keyframes drive-0 { 
    0% { opacity: 0; } 
    30% { opacity: 1; } 
    70% { opacity: 1; } 
    100% { opacity: 0; } 
  }
  @keyframes drive-1 { 
    0% { opacity: 0; } 
    30% { opacity: 1; } 
    70% { opacity: 1; } 
    100% { opacity: 0; } 
  }
  @keyframes drive-2 { 
    0% { opacity: 0; } 
    30% { opacity: 1; } 
    70% { opacity: 1; }  
    100% { opacity: 0; } 
  }

  .playMode{
    position: fixed;
    width: .8rem;
    height: .3rem;
    border: 1px solid rgba(255, 255, 255, 1);
    text-align: center;
    bottom: 2rem;
    left: 50%;
    border-radius: .1rem;
    transform: translateX(-50%);
    transition: all .3s ease;
    opacity: 0;
  }
  .playMode span{
    line-height: .3rem;
    color: rgba(255, 255, 255, 1);
    font-size: .14rem;
  }
  .playMode.mode-0{
    animation-name: drive-0;
     animation-duration:1.5s;
  }
  .playMode.mode-1{
    animation-name: drive-1;
     animation-duration:1.5s;
  }
  .playMode.mode-2{
    animation-name: drive-2;
     animation-duration:1.5s;
  }

  /* 上部分 - 评论、喜欢、评论 */


.upprt-part{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 auto;
    width: 60%;
}
.bottom .upprt-part .like{
    color: rgb(255, 16, 16);
}
.upprt-part .iconfont{
    font-size: .24rem;
    color: #fff;
}
.upprt-part .like{

}
.upprt-part .download{
    font-size: .3rem;
}
    /* 中间部分 - 播放条 */
.middle-part{
    display: flex;
    margin: .1rem .15rem;
    justify-content: space-between;
    color: rgba(255, 255, 255, .7);
}
.middle-part .progress{
    width: 78%;
}
.progress .pro-wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.progress .pro-bottom{
    height: 16px;
    transform: translateY(-8px);
    position: absolute;
    width: 100%;
    top: 50%
}
.progress .pro-bottom div{
  position: relative;
  top: 8px;
  height: 1px;
  background: #fff;

}
.progress .pro-top{
    background: red;
    height: 1px;
    position: relative;
    width: 100%;
    top: 50%;
    transform: translateX(-100%);
}
.progress .pro-top .slider-pointer{
    position: absolute;
    height: .08rem;
    width: .08rem;
    right: -8px;
    top: -.03rem;
    border-radius: 50%;
    background: red;
}


    /* 上部分 - 播放按钮 */
.lower-port{
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.lower-port .iconfont{
    font-size: .28rem;
    color: #fff;
}

.lower-port .play {
    font-size: .5rem;
}

</style>
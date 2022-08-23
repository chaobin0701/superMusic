<template>
  <div id="wrapper">

    <!-- 评论 -->
   <comment
    v-if="showComment"
    :class="{'show': showComment}"
    :id="id"
    :songAuthor="songAuthor"
    :songName="songName"
    :songImgSrc="songImgSrc"
    :showComment="showComment"
    :username="username"
    :bgId="bgId"
    :txId="txId"


    @changeShowComment="changeShowComment"
   ></comment>

     <!-- 中间的图片区域 -->
    <div class="content">
      <div ref="songBackgroundImg" class="content-bg" @click="test"></div>
      <div class="song-picture" > 
        <img :src="songImgSrc" alt="" ref="img">
      </div>
    </div>

      <!-- 头部区域 -->
    <header>
      <div class="title">
        <p class="song-name">{{songName}}</p>
        <p class="song-author">{{songAuthor}}</p>
      </div>
    </header>

    

      <!-- 歌曲列表 -->
      <song-list
        v-if="songList != 1"
        :songNumber="songNumber"
        :songList_1="songList"
        :id="id"
        :showSongList="showSongList"

        @changeShowSongLits="changeShowSongLits"
        @changeSongListClick="changeSongListClick"
      ></song-list>


    <!-- 底部区域 -->
    <play-control
      v-if="songList != 1"
      :showComment="showComment"
      :songList_1="songList"
      :id="id"
      :showSongList="showSongList"
      :songNumber="songNumber"

      @changeId = "changeId"
      @showSongList="showList"
      @timeChange="timeChange"
      @changeShowComment="changeShowComment"
    ></play-control>

  </div>
</template>

<script>
import login from './components/login/login.vue'
  
export default {
  components: { login },
  data(){
    return{
      songList:1,//歌曲列表
      id : 0, //播放歌曲的序号
      songAuthor:'', //演唱者的名字
      songName:'', //歌曲名 
      songImgSrc:'', //歌曲图片的路径
      songBackgroundImg:'', //用来获取背景图片的dom元素
      showSongList:false, //是否显示歌曲列表 true-显示 | false-不显示
      songNumber:'', //歌曲数量
      showComment:false,
      songNewTime:'' ,//歌曲的播放时间
      turn:0,
    }
  },
  props:[
    'username',
    'txId',
    'bgId'
  ],
  computed:{
    url(){
      return this.$axios.defaults.baseURL
    }
  },
  created:function(){

  },
  mounted(){
    //将背景图片的dom挂载到this.songBackgroundImg
    this.songBackgroundImg = this.$refs.songBackgroundImg 
   
    //将唱片的dom挂载到this.imgRotate
    this.imgRotate = this.$refs.img

      // axios 异步请求歌曲列表信息
    this.$axios.get('getSongList')  
      .then(res =>{
        const {data} = res.data
        this.songList = data
        //获取到第一首歌曲的信息进行初始渲染
        const songList  = this.songList[this.id]
        this.song_src = this.url + songList.audio.slice(8)
        this.songName = songList.song
        this.songAuthor = songList.singer
        this.songImgSrc = this.url + songList.image.slice(8)
        this.songNumber = this.songList.length 

      // 给背景图片设置初始的URL
      this.songBackgroundImg.style.backgroundImage = "url("+ this.url +this.songList[this.id].image.slice(8) +") "
      })
        .catch(err=>console.log(err))
  },
  methods:{
      showList:function(){
        // 方法解释: 显示 隐藏 歌曲列表的方法
        this.showSongList = !this.showSongList
      },
      changeShowSongLits:function(data){
        // 接受子组件的点击事件并使歌曲列表隐藏
        this.showSongList = data
      },
      changeSongListClick:function(data){
        // 接送歌曲列表传递过来的id 并改变
        this.id = data
      },
      changeId:function(data){
        // 接收songContent组件传过来的id值来改变歌曲
        this.id = data
      },
      timeChange:function(middlePart,songNewTime){
      //方法解释: 监听songNewTime的变换
      if(songNewTime != 0){
        this.imgRotate.style.transition = "all 1s linear"
      }
      this.songNewTime = songNewTime
      },
      changeShowComment:function(data){
      this.showComment = data
      },
      test:function(){
        // 测试方法 点击背景即可触发
      }
	},
  watch:{
    id(id){
     //方法解释: 监听id的变换
      this.songName = this.songList[id].song
      this.songAuthor = this.songList[id].singer
      this.songImgSrc = this.url + this.songList[id].image.slice(8)
      this.songBackgroundImg.style.backgroundImage = "url("+this.url +this.songList[this.id].image.slice(8) +") "
      this.imgRotate.style.transition = "none"
      this.turn = 0
      this.imgRotate.style.transform = "rotate(-" +  (this.turn * 20) + "deg)"
    },
    songNewTime(songNewTime,oldSongNewTime){
      var i = songNewTime - oldSongNewTime
      if(i = 1){
        this.imgRotate.style.transform = "rotate(-" +  (this.turn * 20) + "deg)"
      }else if(i < 0){
        console.log(songNewTime - oldSongNewTime)
      }
     this.turn += 1
    }
  }
}
</script>

<style scoped>
  #wrapper {
    width: 100%;
    height: 100%;
    background-color:#e5e6c4;
  }
</style>
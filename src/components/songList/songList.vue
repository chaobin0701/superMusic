<template>
  <div  id="list" class="list"  @click="showList" :class="{'active': showSongList}">
          <div class="songListWrapper" :class="{'active': showSongList}">
            <div class="songNumber">
              <span class="text">当前播放</span>
              <span class="number">({{songNumber}})</span>
            </div>
            <div class="songListBox" 
            ref="songList_wrapper">
              <ul class="songList" 
              ref="songList"  
              >
                   <li v-for="(song,index) in songList_1" :key="index" @click="songListClick(index)">
                    <span class="icon iconfont" v-show="index == id">&#xe6ac;</span>
                    <span class="songListAuthor" :class="{'Playing':index == id}">{{song.song}}</span>
                    <span class="fg" :class="{'Playing':index == id}">-</span>
                    <span class="songListName" :class="{'Playing':index == id}" >{{song.singer}}</span> 
                  </li> 
                </ul>
            </div> 
          </div>
      </div>
</template>

<script>

export default {
    name:"songList",
    data(){
        return{
            songListHeight:'',
            ListwrapperHeight : '',//用来获取进度条的dom元素
        }
    },
    props:[
        'songNumber', //歌曲数量
        'songList_1',//传递过来的假json数据
        'id',//播放的歌曲
        'showSongList'//是否显示歌曲列表 true-显示 | false-不显示
    ],
    methods:{
    showList:function(){
        // 方法解释: 显示 隐藏 歌曲列表的方法
        //this.showSongList = !this.showSongList 避免子组件直接修改props的值

        this.$emit('changeShowSongLits',!this.showSongList) 
      },
    songListClick:function(index){
        // 方法解释: 点击歌曲列表里的歌曲 - 跳转歌曲播放
        // this.id = index; 避免子组件直接修改props的值
         this.$emit('changeSongListClick',index) 
        console.log(index)
      },
    },
    created(){
    },
    mounted(){
        this.songListHeight = this.$refs.songList.offsetHeight
        this.ListwrapperHeight = this.$refs.songList_wrapper.offsetHeight
    }
}
</script>

<style scoped>

/* 歌曲列表 */
    .list{
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        visibility:hidden;
        width: 100%;
        height: 100%;
        top: 0;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.5);
        transition: all .3s;
        opacity: 0;
        z-index: 10;
    }
    .list.active{
        opacity: 1;
        visibility:visible;
    }
    .songListWrapper{
        width: 94%;
        height: 4rem;
        border-radius: .1rem;
        background-color: #fff;
        margin-bottom: .3rem;
        transform: translatey(4rem);
        transition: all .5s;
        opacity: 0;
    }
    .songListWrapper.active{
        opacity: 1;
        transform: translatey(0rem);
    }

    .list .songNumber{
        height: .4rem;
        width: 100%;
        border-bottom: rgb(233, 233, 233) 1px solid;
        display: flex;
        align-items: center;
    }
    .list .songNumber .text{
        font-size: .16rem;
        font-weight: bold;
        padding-left: .05rem;
    }
    .list .songNumber .number{
        padding-left: .05rem;
        color: rgb(126, 126, 126);
    }
    .songListBox{
        overflow: auto;
        height: 3.6rem;
        position: relative;
    }
    .songList{
        position: absolute;
        width: 95%;
        margin: .05rem 2.5% 0 2.5%;

    }
    .songList li{
        height: .36rem;
    }
    .songList .fg{
        margin: 0 .05rem;
    }
    .songList .icon{
        margin-right: .07rem;
        color: red;
    }
    .songList .songListAuthor{
        font-size: .15rem;
        color: #000;
    }
    .songList .songListName{
        font-size: .1rem;
        color: rgb(126, 126, 126);
    }
    .songListWrapper .songList .Playing{
        color: red;
    } 
</style>
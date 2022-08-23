<template>
  <div class="wrapper">
    <!-- 顶部 -->
    <div class="top">
      <!-- 第一部分 -->
      <div class="top-1">
        <span class="iconfont" @click="changeShowComment">&#xe68b;</span>
        <span class="commentNumber">评论({{commentNumber}})</span>
      </div>
      <!-- 第二部分 -->
      <div class="song">
        <img :src="songImgSrc" ref="img" />
        <span class="songTitle">{{ songName }}</span>
        <span class="fg">-</span>
        <span class="singer">{{ songAuthor }}</span>
      </div>
    </div>

    <!-- 评论部分 -->
    <div class="comment">
      <div class="comment-top">
        <span @click="test">评论区</span>
      </div>
    

      <!-- 评论区 -->
      <div class="comment-area-wrapper" ref="commentWrapper">
        <ul class="comment-area" ref="comment">
          <li v-for="(userComment, index) in commentList" :key="index" ref="userComment">
            <!-- 头像 -->
            <div class="comment-left">
              <i :src="songImgSrc" 
              class="userImg" 
              :style="{background:bgData[userComment.userbgId].color}"
              >
              <img :src="txData[userComment.usertxId].src">
              </i>
            </div>
            <!-- 左边区域 -->
            <div class="comment-right">
              <!-- 顶部区域 -->
              <div class="comment-wrapper">
                <!-- 用户信息 -->
                <div class="user">
                  <p class="username">{{ userComment.username }}</p>
                  <p class="time">{{ userComment.time }}</p>
                </div>
                <!-- 点赞 -->
                <div class="up" :class="{ whetherUp: userComment.whetherUp }">
                  <span class="upNumber">{{ userComment.upNumber }}</span>
                  <span class="iconfont" @click="upClick(index)">&#xec7f;</span>
                </div>
              </div>
              <!-- 评论内容 -->
              <p class="comment-content">
                {{userComment.comment}}
              </p>
            </div>
          </li>
        </ul>
      </div>
        <!-- 发表评论 -->
      <div class="form">
        <input
          type="text"
          placeholder="友好的输入你的评论吧！"
          required
          value=""
          class="value"
          v-model="commentData"
        />
        <input type="submit" value="发送" class="input" @click="postComment" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
 
  name: "comment",
  data() {
    return {
      commentData: "",
      commentList: "",//歌曲评论列表数据 用于渲染页面
      commentWrapperHeight:'', //评论元素的边框高度
      commentHeight:'',//评论元素的高度
      commentNumber:'',//评论的数量 用于渲染
      txData:[
                {"src":"./static/userPhoto/tx1.png"},
                {"src":"./static/userPhoto/tx2.png"},
                {"src":"./static/userPhoto/tx3.png"},
                {"src":"./static/userPhoto/tx4.png"},
                {"src":"./static/userPhoto/tx5.png"},
                {"src":"./static/userPhoto/tx6.png"},
                {"src":"./static/userPhoto/tx7.png"},
                {"src":"./static/userPhoto/tx8.png"},
                {"src":"./static/userPhoto/tx9.png"},
                {"src":"./static/userPhoto/tx10.png"},
                {"src":"./static/userPhoto/tx11.png"},
                {"src":"./static/userPhoto/tx12.png"},
                {"src":"./static/userPhoto/tx13.png"},
                {"src":"./static/userPhoto/tx14.png"},
                {"src":"./static/userPhoto/tx15.png"},
                {"src":"./static/userPhoto/tx16.png"}
            ] ,
      bgData:[
                  {"color":"#ffc6ce"},
                  {"color":"#c3ecfe"},
                  {"color":"#ecc6df"},
                  {"color":"#c4fffd"},
                  {"color":"#feecd6"},
                  {"color":"#f7f7f7"},
                  {"color":"#fec9d1"},
                  {"color":"#c4fffd"}
              ]
    };
  },
  props: [
    "id", //播放的歌曲
    "songAuthor", //演唱者的名字
    "songName", //歌曲名
    "songImgSrc", //歌曲图片的路径
    "showComment", //显示评论
    "username", //登陆页面输入的名字
    "bgId",//登陆页面选择的头像背景
    "txId"//登陆页面选择的头像
  ],
  created(){
  },
  mounted(){
    this.commentWrapperHeight = this.$refs.commentWrapper.clientHeight // 把评论边框的高度赋值给this.commentWrapperHeight
    this.getSongComment() //初始化 获取当前歌曲的评论列表
  },
  methods: {
    changeShowComment:function(){this.$emit("changeShowComment", !this.showComment)},
    postComment:function(){   // 点击发表评论的时候发生的事件
      if (this.commentData) {
        var myDate = new Date();
        var date =
          myDate.getFullYear() +
          "年" +
          myDate.getMonth() +
          "月" +
          myDate.getDate() +
          "日";

        let data = {
          comment: this.commentData,
          id: this.id,
          time: date,
          upNumber: this.id,
          usertxId: this.usertxId,
          userbgId: this.userbgId,
          username: this.username,
          whetherUp: false,
        };
        console.log(data)
        //this.postSongComment(data); //axios给服务器发送评论内容
        this.$refs.comment.value = ""; //清空输入框
      }
    },
    upClick:function(){
      this.commentList[index].whetherUp = !this.commentList[index].whetherUp;
      var i = this.commentList[index].whetherUp;
      if (i) {
        this.commentList[index].up++;
      } else {
        this.commentList[index].up--;
      }
    },
    postSongComment:function(data){
      // axios 异步请求歌曲列表信息
      this.$axios
        .post("insertComment", data)
        .then((res) => {
          this.getSongComment();
        })
        .catch((err) => console.log(err));
    },
    getSongComment:function() {
       // axios方法 请求歌曲评论信息
      this.$axios
        .get("getSongComment", {
          params: {
            id: this.id,//传递歌曲的id值 获取到响应的评论
          },
        })
        .then((res) => {
          const {data} = res.data 
          this.commentList = data; //把a的数据给到评论列表去渲染
          this.commentNumber = data.length   //获取评论列表的长度 
        })
        .catch((err) => console.log(err));
    },
    test:function(){ //测试方法 点击 评论区即可

    }
  },filters: {
    // 过滤器
    changeBG(index){
      
    }
  }

};
</script>

<style scoped>
/* 被点赞 */
.up.whetherUp span {
  color: red;
}

.wrapper {
  display: flex;
  position: fixed;
  flex-direction: column;
  box-sizing: border-box;
  z-index: 30;
  height: 100%;
  width: 100%;
  background-color: white;
  padding: 0 0.1rem;
  visibility: hidden;
  opacity: 0;
  transition: 0.3s all ease;
  transform: translateY(1rem);
}
.wrapper.show {
  opacity: 1;
  visibility: inherit;
  transform: translateY(0rem);
}
/* 顶部区域 */
.top {
  border-bottom: 8px solid rgb(241, 241, 241);
  height: 13%;
}
.top .top-1 {
  height: 0.4rem;
  line-height: 0.4rem;
  font-size: 0.18rem;
  font-weight: 600;
}
.top .top-1 .commentNumber {
  margin-left: 0.1rem;
}
/* 第二部分 */
.song {
  height: 0.6rem;
  display: flex;
  align-items: center;
}
.song img {
  box-sizing: border-box;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  border: 0.05rem solid black;
}
.song .songTitle {
  padding: 0 0.08rem;
  font-size: 0.16rem;
}
.song .fg {
  font-size: 0.16rem;
}
.song .singer {
  padding: 0 0.08rem;
  font-size: 0.12rem;
  color: rgb(60, 60, 60);
}


/* 评论部分 */
.comment {
  height: 87%;
  display: flex;
  flex-direction: column;
}
.comment .comment-top {
  box-sizing: border-box;
  height: 5%;
  padding: .08rem 0 0 0;
}
.comment-top span {
  font-size: 0.15rem;
  font-weight: bold;
}
/* 评论区 */

/* 发表评论 */
.form {
  height: 7%;
  z-index: 30;
  display: flex;
  bottom: 0rem;
  width: 3.55rem;
  border-top: 1px solid rgb(233, 233, 233);
   background: white;
   align-items: center; 
  position: fixed;

}
.form .value {
  box-sizing: border-box;
  border-radius: 0.05rem;
  margin-right: 0.1rem;
  padding: 0 0.15rem;
  height: 0.4rem;
  background-color: rgb(250, 250, 250);
  flex: 9;
  border: none;
}
.form .input {
  height: 0.4rem;
  font-weight: bold;
  color: rgb(105, 105, 105);
  box-sizing: border-box;
  border-radius: 0.05rem;
  background-color: rgb(250, 250, 250);
  flex: 2;
  border: none;
}


.comment-area-wrapper {
  height: 88%;
  width: 93%;
  overflow: auto;
  
}
.comment-area-wrapper::-webkit-scrollbar {display:none}
.comment-area {
  width: 100%;
  padding-bottom: 0.1rem;
}
.comment-area li {
  width: 100%;
  display: flex;
  padding: 0.1rem 0;
  border-bottom: 1px solid rgb(233, 233, 233);
}
.comment-left {
  height: 100%;
  width: 0.3rem;
  padding-right: 0.08rem;
}
.comment-left .userImg {
  flex: 2;
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 50%;
  margin: 0 auto;
  display: inline-block;
}
.comment-left .userImg img{
  height: 82%;
  width: 82%;
  margin: 9%;
}
.comment-right {
  flex: 8;
}
.comment-right .comment-wrapper {
  display: flex;
  justify-content: space-between;
}
.comment-right .user {
}
.comment-right .user .username {
  font-size: 0.13rem;
}
.comment-right .user .time {
  text-align: left;
  font-size: 0.12rem;
  transform: scale(0.8);
  color: rgb(185, 185, 185);
  transform: translateX(-3%);
}
.comment-right .comment-content {
  font-size: 0.14rem;
  padding-top: 0.04rem;
  line-height: 0.2rem;
}
</style>
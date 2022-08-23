<template>
 <div class="wrap-wrapper">
      <div class="login-wrapper">
      <!-- logo区域 -->
    <div class="logo">

    </div>

    <!-- 填写用户信息区域 -->
    <div class="login-data">
        <div class="data-wrapper">
            <div class="data-term">
                <span>用户名:</span>
                <input type="text"  name="text" v-model="username" placeholder="取个阳间的名字吧！">
            </div>
            <div class="data-term">
                <span>头 像:</span>
                <div class="button tx-choice">
                    <i v-for="(data,index) in txData" :key="index"
                    @click="txClick(index)"
                    :class="{'active':index == txId}"
                    > 
                        <img :src="require(`../../assets/userPhoto/${data.src}.png`)">
                    </i>
     
                </div>
            </div>
            <div class="data-term">
                <span>背景:</span>
                <div class="button bg-choice">
                    <i v-for="(data,index) in bgData" :key="index" 
                    @click="bgClick(index)"
                    :style="{background:`${data.color}`}"
                    :class="{'active':index == bgId}"
                    ></i>
                </div>
            </div>
            <div class="data-term">
                <span>邀请码:</span>
                <input type="text" name="text" v-model="userYQM" placeholder="一定要填对"> 
            </div>
             <div class="data-term data-term-last">
                <button class="sumbit" @click="login">登陆</button>

            </div>

        </div>
    </div>

  </div>
 </div>
</template>

<script>

import txData from "../../assets/json/txData"
import bgData from "../../assets/json/bgData"

export default {
    name:"login",
    data(){
        return{
            txData:txData.txData,
            bgData:bgData.bgData,
            yqm:'123123', //邀请码
            bgId:0, //头像背景代码
            txId:0, //头像代码
            username:'',//用户输入的名称
            userYQM:''
        }
    },
    methods:{
        txClick:function(index){this.txId = index},
        bgClick:function(index){this.bgId = index},
        login:function(){
            if(this.username == ''){
                alert('你忘记输入用户名了!')
            }else if(this.userYQM == ''){
               alert('你忘记输入邀请码了!')
            }else if(this.userYQM == this.yqm){
                 this.$emit('login',
                    this.username,
                    this.txId,
                    this.bgId,
                 ) 
            }else{
                alert('邀请码出错')
            }
        }
    }
}
</script>

<style scoped>
.wrap-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.login-wrapper{
    width: 100%;
    height: 900px;
    background: url(../../assets/loginBg/bg.png);
    background-size: 100% 100%;
     background-color: #84bbbc;
}
.logo{
    height: 1.5rem;
    width: 100%;
    background: red;
    background: url(../../assets/loginBg/logo.png) no-repeat;
   
    background-size: 100% ;
    background-position: bottom;
}

/* 填写用户信息区域 */
.login-data{
    width: 90%;
    height: 5rem;
    margin: .25rem auto;
}
.data-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.data-term{
    width: 100%;
 
    padding: .1rem 0 ;
    display: flex;
    justify-content: space-between;
}
.data-term span{
    box-sizing: border-box;
    display: inline-block;
    text-align: right;
    padding-right: .1rem;
    width: .8rem;
    line-height: .35rem;
    font-size: .2rem;
    font-weight: bold;
    color: #000;
    text-shadow: rgba(0, 0, 0, .3) .01rem .01rem .03rem;
}
.data-term input{
    box-sizing: border-box;
    flex: 1;
    background-color: white;
    padding-left: .05rem;
    border: .03rem solid #ccc;
    border-radius: .08rem;
    box-shadow: rgba(0, 0, 0, .4) .01rem .01rem .03rem;
}
.data-term .button{
    line-height: .3rem;
    text-align: center;
    flex: 1;
    background-color: white;
    padding-left: .05rem;
    border: .03rem solid #ccc;
    border-radius: .08rem;
    font-weight: bold;
    font-size: .17rem;
    box-shadow: rgba(0, 0, 0, .4) .01rem .01rem .03rem;
    color: #365346;
}

/* 挑选 */
.data-term .tx-choice{
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.data-term .tx-choice i{
    margin: .05rem 0;
    height: .5rem;
    width: .5rem;
    border-radius: .1rem;
    background-color: rgb(231, 231, 231);
    transition: all .3s ease;
    box-shadow: rgba(0, 0, 0, .2) 0px 0px 4px;
}
.data-term .tx-choice i.active{
    box-shadow: rgba(255, 0, 0, .8) 0px 0px 8px;
    background-color: white;
}
.data-term .tx-choice i img{
    width: 80%;
    height: 80%;
    margin: 10% auto;
}

.data-term .bg-choice{
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
.data-term .bg-choice i{
    margin: .05rem 0;
    height: .5rem;
    width: .5rem;
    border-radius: .1rem;
    background-color: rgb(231, 231, 231);
    transition: all .3s ease;
    box-shadow: rgba(0, 0, 0, .2) 0px 0px 4px;
}
.data-term .bg-choice i.active{
    box-shadow: rgba(255, 0, 0,.8) 0px 0px 8px;
}
.data-term .sumbit{
    line-height: .3rem;
    text-align: center;
    width: 1rem;
    background-color: white;
    padding-left: .05rem;
    border: .03rem solid #ccc;
    border-radius: .08rem;
    font-weight: bold;
    font-size: .17rem;
    box-shadow: rgba(0, 0, 0, .4) .01rem .01rem .03rem;
    color: #365346;
}
.data-term-last{
    justify-content: center;
}

</style>
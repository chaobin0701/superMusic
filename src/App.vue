<template>
  <div id="wrapper">
    <login
    v-if="!showMusic"
      @login="login"
    ></login>
    <music
    v-if="showMusic"
    :username="username"
    :txId="txId"
    :bgId="bgId">
      </music>
  </div>
</template>

<script>
  export default {
    name:"app",
    data(){
      return{
        username:'',
        txId:'',
        bgId:'',
        showMusic:false
      }
    },
    methods:{
      login:function(username,txId,bgId){
        this.username = username,
        this.txId = txId,
        this.bgId = bgId,
        this.showMusic=true
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

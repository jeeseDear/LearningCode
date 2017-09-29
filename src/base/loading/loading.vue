<template>
  <div class="loading">
    <img src="./loading.gif" alt="">
    <p class="desc">{{title}}</p>
  </div>
</template>
<style lang="scss" rel="stylesheet/css">
@import "~common/sass/variable.scss";
  .loading{
    width:100%;
    text-align:center;
     img{
       width:pxTorem(40px);
       height:pxTorem(40px);
     }
     .desc{
        line-height: 20px;
        @include font-size-small();
        color: $color-text-l;
     }
  }
</style>
<script>
  export default{
    props:{
      title:{
         type:String,
         default:'正在载入...'
      }
     
    }
  }
</script>

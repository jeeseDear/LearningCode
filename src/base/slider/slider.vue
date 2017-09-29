<template>  
  <div class="swiper-container galley-top">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for = "item in data">
        <a :href="item.linkUrl">
          <img  class="needsclick":src="item.picUrl" alt="" @load="refresh">
        </a>
      </div>
    </div>
     <div class="swiper-pagination"></div>
  </div>
 
</template>
<style lang="scss" rel="stylesheet/css">
    @import "~assets/swiper/swiper.min.css";
    @import "~common/sass/variable.scss";
    .galley-top{
        .swiper-slide{
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;
            -ms-flex-pack: center;
            -webkit-justify-content: center;
            justify-content: center;
            -ms-flex-align: center;
            -webkit-align-items: center;
            align-items: center;
            width:100%;
            a,img{
                display:inline-block;
                width:100%;
                // height:pxTorem(300px);
            }
        }
        .swiper-pagination-bullet{
                width:15px;
        }
    }
   
</style>
<script>
import Swiper from "static/swiper/swiper.min.js"
    export default{
        props:["data","refresh"],
        // data () {
        //     return {
        //         galleyTop: null
        //     }
        // },
        mounted(){
            this._lunbo()
        },
        // beforeDestroy () {
        //     this.galleyTop.destroy()
        // },
        methods:{
          _lunbo(){
             this.galleyTop = new Swiper('.galley-top',{
                loop: true,
                pagination: '.swiper-pagination',
                autoplayDisableOnInteraction:false,
                paginationClickable: true,
                autoplay: 5000,
               
              })
          }
        }
    }
</script>
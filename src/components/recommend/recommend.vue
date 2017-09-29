<template lang="">
    <div class="recommend">  
        <scroll ref="scroll" class="recommend-content":data="discList">
            <div>
                <div class="slider-wrapper">
                    <slider v-if="recommends.length" :data="recommends" :refresh ="loadImage">

                    </slider>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li v-for="item in discList" class="item">
                            <div class="icon">
                            <img v-lazy="item.imgurl">
                            </div>
                            <div class="text">
                            <div class="name" v-html="item.creator.name"></div>
                            <div class="dissname" v-html="item.dissname"></div>
                            </div>
                        </li>
                    </ul>             
                </div>
            </div>
            <loading v-show="!discList.length" class="loading-container"></loading>   
        </scroll>
    </div>   
</template>
<style lang= "scss" rel="stylesheet/css">
@import '~common/sass/variable.scss';
    .recommend{
        position:fixed;
        width:100%;
        top:pxTorem(176px);
        left:0;
        bottom:0;
        .recommend-content{
            overflow:hidden;
            height:100%;
            .slider-wrapper{
                position: relative;
                width: 100%;
                overflow: hidden;
                }
            .recommend-list{
                .list-title{
                    padding-top:pxTorem(40px);
                    text-align:center;
                    color:$color-theme;
                    @include font-size-medium();
                }
                .item{
                    display:flex;
                    box-sizing:border-box;
                    align-items:center;
                    padding-top:pxTorem(40px);
                }
                .icon{
                    flex:0 0 pxTorem(120px);
                    padding-right:pxTorem(40px);
                    img{
                        width:pxTorem(120px);
                        height:pxTorem(120px);
                    }
                }
                .text{
                    flex:1;
                    flex-direction:column;
                    .name{
                        padding:0 pxTorem(40px) pxTorem(40px) 0
                    }
                    .dissname{
                        color:$color-text-d
                    }
                }
            }
            .loading-container{
                position:absolute;
                top:50%;
                left:50%;
                transform:translate(-50%,-50%);
            }
        }
    }
</style>
<script>
    import Loading from 'base/loading/loading'
    import Scroll from 'base/scroll/scroll'
    import {getRecommend,getDisclist} from 'api/recommend'
    import {ERR_OK} from 'api/config'
    import Slider from 'base/slider/slider'
    export default {  
        created(){
            setTimeout(this._getDiscList,2000)
            this._getRecommend();
            //this._getDiscList()
        },
        data(){
                return {
                    recommends :[],
                    discList:[]
                }
        },
        methods:{
            _getRecommend() {
                getRecommend().then((res) => {
                        if (res.code === ERR_OK) {
                            this.recommends = res.data.slider;
                            //console.log(this.recommends)
                        }
                    })
                },
            _getDiscList(){
                getDisclist().then((res)=>{
                    //console.log(res)
                    if(res.code === ERR_OK){
                    this.discList = res.data.list             
                    }
                })
            },
            loadImage() {
                if (!this.checkloaded) {
                    this.checkloaded = true
                    this.$refs.scroll.refresh()
                    console.log(this.$refs.scroll)
                }
            },
        },
        components:{
            "slider":Slider,
            "scroll":Scroll,
            "loading":Loading
        }
    }
</script>
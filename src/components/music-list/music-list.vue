<template>
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper" ref="playWrapper" @click ="random">
                <div class="play">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll @scroll="scroll" :probeType="propeType":listen-scroll="listenScroll" :data="songs" class="list" ref="list">
            <div class="song-list-wrapper">
                <song-list :songs="songs" @select="selectItem"></song-list>
            </div>
         </scroll>
    </div>
</template>
<style lang="scss">
    @import "~common/sass/variable.scss";
    @import '~common/sass/mixin';
    .music-list{
        position: fixed;
        z-index: 99;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: $color-background;
        .back{
            position:absolute;
            top:pxTorem(0px);
            left:pxTorem(12px);
            z-index:50;
            .icon-back{
                display:block;
                padding:pxTorem(20px);
                @include font-size-large-x();
                color: $color-theme;
            }
        }
        .title{
            position: absolute;
            top: 0;
            left: 10%;
            z-index: 40;
            width: 80%;
            padding-top:pxTorem(20px);
            @include no-wrap();
            text-align: center;
            line-height: pxTorem(40px);
            @include font-size-large();
            color: $color-text;
        }
        .bg-image{
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 70%;
            transform-origin: top;
            background-size: cover;
           // z-index:40;
            .filter{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(7, 17, 27, 0.4);
              
            }
            .play-wrapper{
                position:absolute;
                bottom:pxTorem(20px);
                z-index:50;
                width:100%;
            }
            .play-wrapper .play{
                box-sizing:border-box;
                width:pxTorem(270px);
                padding:pxTorem(14px) 0;
                margin:0 auto;
                text-align:center;
                border:pxTorem(2px) solid $color-theme;
                color: $color-theme;
                border-radius:pxTorem(200px);
                font-size: 0px;
            }
            .play-wrapper .play .icon-play{
                display:inline-block;
                vertical-align:middle;
                margin-right:pxTorem(12px);
                @include font-size-medium-x();
            }
            .play-wrapper .play .text{
                display: inline-block;
                vertical-align: middle;
                @include font-size-small();
            }
        }
        .bg-layer{
            position: relative;
            height: 100%;
            background: $color-background;
        }
        .list{
            position: fixed;
            top:0;
            bottom:0;
            width: 100%;
            //overflow:hidden;
            background: $color-background;
            //z-index:30;
            .song-list-wrapper{
                  padding: pxTorem(40px) pxTorem(60px);
            }
        }
    }
</style>
<script>
    import Scroll from 'base/scroll/scroll'
    import SongList from 'base/song-list/song-list'
    import { mapActions } from 'vuex'
    const RESERVERD_HEIGHT = 84
    export default{
        props:{
            bgImage:{
                type:String,
                default:''
            },
            songs:{
                type:Array,
                default:[]
            },
            title:{
                type:String,
                default:''
            }
        },
        computed:{
            bgStyle(){
                return `background-image:url(${this.bgImage})`
            }
        },
        mounted(){
            this.imageHeight = this.$refs.bgImage.clientHeight
            this.minTranslateY = -this.imageHeight+RESERVERD_HEIGHT
            this.$refs.list.$el.style.top = `${this.imageHeight}px`
            console.log(this.imageHeight)
        },
        methods:{
            scroll(pos){
                this.scrollY = pos.y
            },
            back(){
                this.$router.go(-1)
            },
            selectItem(item,index){
                this.selectPlay({
                    list : this.songs, 
                    index
                })
            },
            random(){
                this.randomPlay({
                    list:this.songs
                })
            },
            ...mapActions([
                'selectPlay',
                'randomPlay'
            ])
        },
        data(){
            return {
                scrollY:0
            }
        },
        created(){
            this.propeType = 3
            this.listenScroll = true
        },
        components:{
            SongList,
            Scroll
        },
        watch:{
            scrollY(newY){
                let translateY = Math.max(this.minTranslateY,newY)
                console.log(newY)
                let zIndex = 0
                let scale = 1
                let blur = 0
                this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
                this.$refs.layer.style['webkittransform'] = `translate3d(0,${translateY}px,0)`
                const percent = Math.abs(newY / this.imageHeight)
                if(newY>0){
                    scale  = 1 +percent
                    zIndex = 10
                }else{
                    blur = Math.min(20*percent,20)
                }
                this.$refs.filter.style['backdrop-filter'] = `blur(${blur})`
                this.$refs.filter.style['webkitbackdrop-filter'] = `blur(${blur})`
                console.log(newY,this.minTranslateY)
                if(newY < this.minTranslateY){
                    zIndex =10
                    this.$refs.bgImage.style.paddingTop = 0
                    this.$refs.bgImage.style.height = `${RESERVERD_HEIGHT}px`
                    this.$refs.playWrapper.style.display="none"
                }else{
                    this.$refs.bgImage.style.paddingTop = '70%'
                    this.$refs.bgImage.style.height = 0
                    this.$refs.playWrapper.style.display="block"
                }
                this.$refs.bgImage.style['transform'] = `scale(${scale})`
                this.$refs.bgImage.style['webkittransform'] = `scale(${scale})`
                this.$refs.bgImage.style.zIndex = zIndex
            }
        }
    }
</script>
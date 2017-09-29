<template>
    <div class="player" v-show ="playlist.length>0">
      <transition name="normal" @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
        <div class="normal-player" v-show="fullScreen">
            <div class="background">
                 <img width="100%" height="100%" :src="currentSong.image">
            </div>
            <div class="top">
                <div class="back">
                    <i class="icon-back"@click="back"></i>
                </div>
                <h1 class="title" v-html="currentSong.name"></h1>
                <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <div class="middle" @touchstart.prevent = "middleTouchStart"
            @touchmove.prevent = "middleTouchMove"
            @touchend = "middleTouchEnd"
            >
                <div class="middle-l" ref="middleCd">
                    <div class="cd-wrapper" ref="cdWrapper">
                        <div class="cd":class="cdPlay" ref="cD">
                            <img :src="currentSong.image" class="image" alt="">
                        </div>
                    </div>
                </div>
                <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                    <div class="lyric-wrapper">
                        <div v-if="currentLyric">
                            <p ref="lyricLine"
                            class="text"
                            :class="{'current': currentLineNum ===index}"
                            v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
                        </div>
                    </div>
                </scroll>
            </div>
            <div class="bottom">
                <div class="dot-wrapper">
                    <span class="dot":class="{ 'active':currentShow ==='cd' }"></span>
                    <span class="dot":class="{ 'active':currentShow ==='lyric' }"></span>
                </div>    
                <div class="progress-wrapper">
                    <span class="time time-l">{{ format(currentTime) }}</span>
                    <div class="progress-bar-wrapper">
                        <progress-bar :percent="percent" @percentChange="getPercent"></progress-bar>
                    </div>
                    <span class="time time-r">{{ format(currentSong.duration) }}</span>
                </div>
                <div class="operate">
                    <div class="icon i-left">
                        <i :class="playingMode" @click="changeMode"></i>
                    </div>
                    <div class ="icon i-left">
                        <i class="icon-prev" @click="prev" :class="disableCls"></i>
                    </div>
                    <div class="icon i-center">
                        <i :class="playIcon" @click="togglePlaying"></i>
                    </div>
                    <div class="icon i-next">
                        <i class="icon-next" @click = "next"  :class="disableCls"></i>
                    </div>
                    <div class="icon i-right">
                        <i :class="getFavoriteIcon" @click ="toggleFavoriteIcon"></i>
                    </div>
                </div>
            </div>
        </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" @click="open" v-show = "!fullScreen">
                <div class="icon":class="cdPlay">
                    <img :src="currentSong.image" alt="">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <ProgressCircle :percent="percent">
                     <i @click.stop="togglePlaying" :class="miniIcon" class="mini-icon"></i>
                    </ProgressCircle>
                </div>
                <div class="control" @click.stop="showPlaylist">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <audio :src="currentSong.url" ref="audio" @error="error" @canplay="ready" @timeupdate="timeUpdate" @ended="end"></audio>
    </div>
</template>
<style lang="scss" rel="stylesheet/css">
    @import "~common/sass/variable.scss";
    @import '~common/sass/mixin';
    .player{
        .normal-player{
                position:fixed;
                top:0;
                left:0;
                bottom: 0;
                right: 0;
                height:100%;
                width:100%;
                background: $color-background;
                height:100%;
                width:100%;
                .background{
                    position:absolute;
                    top:0;
                    left:0;
                    height:100%;
                    width:100%;
                    z-index: -1;
                    opacity: 0.6;
                    filter: blur(20px);
                }
                .top{
                    position:relative;
                    width:100%;
                    top:pxTorem(24px);
                    left:0;
                    h1,h2{
                        text-align:center;
                        @include font-size-large();
                    }
                    h2{
                        margin-top:pxTorem(34px);
                        @include font-size-medium()
                    }
                }
                .back{
                    position:absolute;
                    left:pxTorem(26px);
                    transform:rotate(270deg);
                    -webkit-transform:rotate(270deg);
                    .icon-back{
                        color:$color-theme;
                        @include font-size-large();
                    }
                }
                .middle{
                    position: fixed;
                    width: 100%;
                    top: pxTorem(160px);
                    bottom: 170px;
                    white-space: nowrap;
                    font-size: 0;
                }
                .middle-l{
                    display: inline-block;
                    vertical-align: top;
                    position: relative;
                    width: 100%;
                    height: 0;
                    padding-top: 80%;
                }
                 .middle-r{
                    display: inline-block;
                    vertical-align: top;
                    box-sizing:border-box;
                    position:relative;
                    width: 100%;
                    height: 90%;
                    overflow: hidden;
                    .lyric-wrapper{
                        width: 80%;
                        margin: 0 auto;
                        text-align: center;
                        .text{
                            line-height: pxTorem(64px);
                            color: $color-text-l;
                            @include font-size-medium();
                            &.current{
                                  color: $color-text
                            }
              
                        }
                    }
          
                }
                .middle-l .cd-wrapper{
                    position:absolute;
                    left:10%;
                    top:0;
                    width:80%;
                    height:100%;
                }
                .middle-l .cd-wrapper .cd{
                    box-sizing:border-box;
                    position: absolute;
                    top:0;
                    left:0;
                    width:100%;
                    height:100%;
                    border:pxTorem(20px) solid rgba(255,255,255,.1);
                    border-radius:50%;
                    &.play{
                        animation: rotate 20s linear infinite;
                        -webkit-animation: rotate 20s linear infinite;
                    }
                    &.pause{
                        animation-play-state:paused;
                        -webkit-animation-play-state:paused;
                    }
                }
                .middle-l .cd-wrapper .cd img{
                    position: absolute;
                    width:100%;
                    height:100%;
                    left:0;
                    top:0;
                    border-radius:50%;
                }
                .bottom{
                    position:absolute;
                    bottom:pxTorem(100px);
                    width:100%;
                    .dot-wrapper{
                        text-align:center;
                        .dot{
                            display:inline-block;
                            margin:0 4px;
                            width:8px;
                            height:8px;
                            border-radius:50%;
                            background: $color-text-l;
                            &.active{
                                width: 20px;
                                border-radius: 5px;
                                background: $color-text-ll;
                            }
                        }
                    }
                }
                .bottom .operate{
                    display:flex;
                }
                &.normal-enter-active,&.normal-leave-active{
                    transition:all 0.4s;
                    .top,.bottom{
                        transition:all 0.4s cubic-bezier(0.86,0.18,0.82,1.32);
                    }
                }
                &.normal-enter,&.normal-leave-to{
                    opacity:0;
                    .top{
                        transform:translate3d(0,-100px,0);
                    }
                    .bottom{
                        transform:translate3d(0,100px,0)
                    }
                }
                .icon{
                    flex:1;
                    font-size:pxTorem(60px);
                    color:$color-theme;
                    text-align:center;
                    // padding: 0px pxTorem(50px)
                }
                .progress-wrapper{
                    display: flex;
                    align-items: center;
                    width: 90%;
                    margin: 0px auto;
                    padding: 10px 0 20px 0;
                    .time{
                        color: $color-text;
                        @include font-size-small();
                        line-height: 30px;
                    }
                    .progress-bar-wrapper{
                        flex:1;
                        margin:0 10px;
                    }
                    &.time-l{
                        text-align: left;
                    }
                    &.time-r{
                        text-align: right;
                    }
                }
        }
        .mini-player{
            display:flex;
            position:absolute;
            bottom:0px;
            left:0px;
            background:$color-highlight-background;
            padding:pxTorem(20px) 0px;
            width:100%;
            &.mini-enter-active,&.mini-leave-active{
                transition:all .5s;
            }
            &.mini-enter,&.mini-leave-to{
                opacity:0;
            }
            .icon{
                padding:0;
                padding:0 pxTorem(20px);
                width:pxTorem(80px);
                &.play{
                    animation: rotate 20s linear infinite;
                    -webkit-animation: rotate 20s linear infinite;
                    }
                &.pause{
                    animation-play-state:paused;
                    -webkit-animation-play-state:paused;
                }
            }
            .icon img{
                width:pxTorem(80px);
                height:pxTorem(80px);
                border-radius:50%;
            }
            .text{
                flex:1;
                margin-top:pxTorem(10px);
                .name{
                    @include font-size-medium();
                }
                .desc{
                    @include font-size-small();
                    color:$color-text-d;
                    padding-top:pxTorem(18px);
                }
            }
            .control{
                flex: 0 0 44px;
                width: 44px;
                margin-top:pxTorem(20px);
                padding:0 pxTorem(40px);
                color:$color-theme-d ;
                position:relative;
                i{
                @include font-size-large-x();
                &.mini-icon{
                    position: absolute;
                    left:-10;
                    top: 0;
                }
                }
                .disable{
                    color:$color-theme-d
                }
            }
        }
        @keyframes rotate{
            0%{
                transform:rotate(0deg)
            },
            100%{
                transform:rotate(360deg)
            }
        }
        @-webkit-keyframes rotate{
            0%{
                -webkit-transform:rotate(0deg)
            },
            100%{
                -webkit-transform:rotate(360deg)
            }
        }
    }
</style>
<script>
    import { playMode } from 'common/js/config'
    import Animations from 'create-keyframe-animation'
    import progressBar from 'base/progress-bar/progress-bar'
    import ProgressCircle from 'base/progress-circle/progress-circle'
    import Scroll from 'base/scroll/scroll'
    import { shuffer } from 'common/js/shuffer'
    import scroll from 'base/scroll/scroll'
    import { song } from 'common/js/song'
    import Lyric from 'lyric-parser'
    import { mapGetters } from 'vuex'
    import { mapMutations } from 'vuex'
    export default{
        data(){
            return {
                iconMode:'icon-loop',
                getFavoriteIcon:'icon-not-favorite',
                songsReady: false,
                currentTime:0,
                currentLineNum:0,
                currentLyric:null,
                currentShow:'cd'
            }
        },
        created(){
            this.touch = []
        },
        computed:{
            ...mapGetters([
            'fullScreen',
            'playing',
            'playlist',
            'currentSong',
            'singer',
            'mode',
            'currentIndex',
            'sequenceList'
            ]
            ),
            disableCls(){
                this.songsReady ? "" : "disable"
            },
            playIcon(){
                return  this.playing ? 'icon-pause':'icon-play'
            },
            playingMode(){
                return this.mode === 1 ? 'icon-loop' :this.mode ===0?'icon-sequence' : 'icon-random'
            },
            cdPlay(){
               return this.playing ? 'play':'play pause'
            },
            percent(){
                return this.currentTime / this.currentSong.duration
            },
            miniIcon() {
                return this.playing ? 'icon-pause':'icon-play'
            }
        },
        methods:{
            back(){
                this.setFullScreen(false)
            },
            open(){
                this.setFullScreen(true)
            },
            _getPosAndScale(){
                const targetWidth = 40
                const paddingLeft = 40
                const paddingBottom = 30
                const paddingTop = 80
                const width = window.innerWidth * 0.8
                const scale = targetWidth / width
                const x = -(window.innerWidth / 2 - paddingLeft)
                const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
                return {
                x,
                y,
                scale
                }
            },
            enter(el,done){
                const {x, y, scale} = this._getPosAndScale()
                let animation = {
                    0:{
                        transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
                    },
                     60:{
                        transform:'translate3d(0,0,0) scale(1.1)'
                    },
                     100:{
                        transform:'translate3d(0,0,0) scale(1)'
                    }
                }
                Animations.registerAnimation({
                    name:'move',
                    animation,
                    presets:{
                        duration:400,
                        easing:'linear'
                    }
                })
                Animations.runAnimation(this.$refs.cdWrapper,'move',done)
            },
            afterEnter(){
                Animations.unregisterAnimation('move')
                this.$refs.cdWrapper.style.animation=''
            },
            leave(el,done){
                const { x,y, scale } = this._getPosAndScale()
                this.$refs.cdWrapper.style.transition='all .4s'
                this.$refs.cdWrapper.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale})`
                this.$refs.cdWrapper.addEventListener('transitionend',done)
            },
            afterLeave(){
                this.$refs.cdWrapper.style.transition=''
                this.$refs.cdWrapper.style['transform']=''
            },
            togglePlaying(){
                if (!this.songsReady) {
                  return
                }
                this.setPlayingState(!this.playing)
               
            },
            toggleFavoriteIcon(){
                this.getFavoriteIcon === 'icon-not-favorite'? this.getFavoriteIcon='icon-favorite':this.getFavoriteIcon ='icon-not-favorite'
            },
            changeMode(){
                const mode = (this.mode + 1) % 3
                this.setPlayMode(mode)
                let list = null
                if(mode === playMode.random){
                    list = shuffer(this.sequenceList)
                }else{
                    list = this.sequenceList
                }
                this.resetCurrentIndex(list)
                this.setPlayList(list)
            },
            end(){
                if(this.mode === playMode.loop){
                    this.loop()
                }else{
                    this.next()
                }
            },
            loop(){
                this.$refs.audio.currentTime = 0
                this.setPlayingState(true)
                this.$refs.audio.play()
            },
            resetCurrentIndex(list){
               let index = list.findIndex((item)=>{
                    return item.id === this.currentSong.id 
                })
                this.setCurrentIndex(index)
            },
            prev(){
                if(!this.songsReady){
                    return
                }
                let index = this.currentIndex - 1
                if(index === -1){
                    index = this.playlist.length - 1
                }
                this.setCurrentIndex(index)
                this.$refs.audio.play()
                this.setPlayingState(true)
                this.songsReady = false
            },
            next(){
                if(!this.songsReady){
                    return
                }
                let index = this.currentIndex + 1
                if(index === this.playlist.length){
                    index = 0
                }
                this.setCurrentIndex(index)
                this.$refs.audio.play()
                this.setPlayingState(true)
                this.songsReady = false
            },
            ready(){
                this.songsReady = true
            },
            error(){
                this.songsReady = true
            },
            // cdCls(){},
            timeUpdate(e){
                this.currentTime = e.target.currentTime
            },
            getPercent(percent){
                this.$refs.audio.currentTime = this.currentSong.duration*percent
                if(!this.playing){
                    this.togglePlaying()
                }    
            },
            _pad(value){
               return value < 10 ? `0${value}` : value
            },
            format(time){
                time = time | 0
                let minute = time / 60 | 0
                let seconds = time % 60
                minute = this._pad(minute)
                seconds = this._pad(seconds)
                return `${minute} : ${seconds}`
            },
            getLyric(){
                this.currentSong.getLyric().then((lyric)=>{
                    this.currentLyric = new Lyric(lyric,this.handler)
                    if(this.playing){
                        this.currentLyric.play()
                    }
                    console.log(this.currentLyric)
                })
            },
            handler({lineNum, txt}){
                this.currentLineNum = lineNum
                console.log({lineNum, txt})
            },
            middleTouchStart(e){
                this.touch.initiated = true
                // 用来判断是否是一次移动
                this.touch.moved = false
                const touch = e.touches[0]
                this.touch.startX = touch.pageX
                this.touch.startY = touch.pageY
            },
            middleTouchMove(e){
                if(!this.touch.initiated){
                    return
                }
                const touch = e.touches[0]
                const deltaX = touch.pageX - this.touch.startX
                const deltaY = touch.pageY - this.touch.startY
                if(Math.abs(deltaY)>Math.abs(deltaX)){
                    return 
                }
                if (!this.touch.moved) {
                  this.touch.moved = true
                }
                const left = this.currentShow === 'cd' ? 0 :-window.innerWidth
                const width = Math.min(0,Math.max(-window.innerWidth,left + deltaX))
                this.touch.touchPercent = Math.abs(width / window.innerWidth)
                console.log(width)
                this.$refs.lyricList.$el.style.transform = `translate3d(${width}px,0,0)`
                this.$refs.lyricList.$el.style.webkittransform = `translate3d(${width}px,0,0)`
                this.$refs.middleCd.style.opacity = `${1 - this.touch.toucPercent}`
            },
            middleTouchEnd(e){
                if (!this.touch.moved) {
                    return
                }
                let width
                let opacity
                if(this.currentShow === 'cd'){
                    if(this.touch.touchPercent > 0.1){
                        this.currentShow = 'lyric'
                        width = -window.innerWidth
                        opacity = 0
                    }else{
                        opacity = 1
                    }
                }else{
                    if(this.touch.touchPercent < 0.9){
                        this.currentShow = 'cd'
                        opacity = 1
                        width = 0
                        
                    }else{
                        width = -window.innerWidth
                        opacity = 0
                    }
                }
                console.log(this.touch.touchPercent)
                this.$refs.lyricList.$el.style.transform = `translate3d(${width}px,0,0)`
                this.$refs.lyricList.$el.style.transition = 'transform 400ms linear '
                this.$refs.middleCd.style.opacity = `${opacity}`
                this.$refs.middleCd.style.transition = 'opacity 400ms linear'
                this.touch.initiated = false
            },
            ...mapMutations({
                setFullScreen : 'SET_FULL_SCREEN',
                setPlayingState :'SET_PLAYING_STATE',
                setPlayMode:'SET_PLAY_MODE',
                setCurrentIndex:'SET_CURRENT_INDEX',
                setPlayList:'SET_PLAYLIST'
            }) 
        },
        watch:{
            currentSong(){
                this.$nextTick(()=>{
                     this.$refs.audio.play()
                     this.getLyric()
                })
            },
            playing(newPlaying) {
                const audio = this.$refs.audio
                this.$nextTick(() => {
                newPlaying ? audio.play() : audio.pause()
                })
            },
            currentIndex(){
                this.$nextTick(()=>{
                     this.$refs.audio.play()
                })
            },
            currentTime(newValue){
                if(newValue >= this.currentSong.duration){
                    this.setPlayingState(!this.playing)
                }
            }
        },
        components:{
            'progress-bar' : progressBar,
            ProgressCircle,
            "scroll":Scroll,
        }
    }
</script>
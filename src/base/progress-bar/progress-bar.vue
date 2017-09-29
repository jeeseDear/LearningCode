<template>
    <div class="progress-bar">
       <div class="bar-inner" ref="barInner">
            <div class="progress" ref="progress"></div>
            <div class="progress-wrapper-btn" ref="progressBtn" @click="progressClick"
            @touchstart.prevent = "progressTouchStart"
            @touchmove.prevent = "progressTouchMove"
            @touchend = "progressTouchEnd"
            >
                <div class="progress-btn"></div>
            </div>
       </div>
    </div>
</template>
<style lang="scss">
@import '~common/sass/variable.scss';
@import '~common/sass/mixin.scss';
.progress-bar{
        width:100%;
        height:30px;
        .bar-inner{
            position:relative;
            width:100%;
            height:4px;
            top:15px;
            background:rgba(0,0,0,.3);
            .progress{
                background:$color-theme;
                height:4px;
            } 
            .progress-wrapper-btn{
                position:relative;
                top:-16px;
                width:20px;
                height:20px;
                border-radius:50%;
                border:5px solid #eaeaea;
            }
            .progress-btn{
                width:20px;
                height:20px;
                border-radius:50%;
                background:$color-theme;
            }

        }
        
    }
</style>
<script>
import { mapMutations } from 'vuex'
    export default{
        props:{
            percent:{
                type:Number,
                default:0
            }
        },
        computed:{
        ...mapMutations({
                    setPlayingState : 'SET_PLAYIN_STATE'
                })
        },
        created(){ 
            this.touches = {};
        },
        methods:{
            progressTouchStart(e){
                this.touches.initState = true
                this.touches.initialPosition = e.touches[0].pageX
                this.touches.progressLeft = this.$refs.progress.clientWidth
            },
            progressTouchMove(e){
                 const delatX =Math.min(e.touches[0].pageX - this.touches.initialPosition + this.touches.progressLeft,this.$refs.barInner.clientWidth)
                 this._offSetwidth(delatX)

            },
            progressTouchEnd(e){
                this.touches.initState = false
                this.percent = 1
                this._trriglePercent()
            },
            progressClick(e){
                const rect = this.$refs.barInner.getBoundingClientRect()
                const offsetWidth = e.pageX - rect.left 
                this._offSetwidth(offsetWidth)
            },
            _trriglePercent(){
                let perc = this.$refs.progress.clientWidth / (this.$refs.barInner.clientWidth - 30)
                this.$emit("percentChange",perc)
            },
            _offSetwidth(offsetwidth){
                this.$refs.progress.style.width = `${offsetwidth}px`
                this.$refs.progressBtn.style['transform'] = `translate3d(${offsetwidth}px,0,0)`
            }
        },
        watch:{
            percent(newValue){
                // console.log(newValue)
                const progressBtn = 30;
                if(newValue >= 0 && !this.touches.initState){
                    let progressWidth = newValue*(this.$refs.barInner.clientWidth - progressBtn);
                    // console.log(progressWidth)
                    this._offSetwidth(progressWidth)
                }
                
            }
        }
    }
</script>

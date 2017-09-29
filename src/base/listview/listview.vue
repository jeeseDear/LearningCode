<template>
     <scroll class="listview" 
     :data="data"
      ref="listview" 
      :listenScroll="listenScroll"
      :probeType="probeType"
      @scroll = "scroll">
        <ul>
            <li v-for="group in data" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{ group.title }}</h2>
                <ul>
                    <li  @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
                        <img  alt="" class="avatar" v-lazy="item.avatar">
                        <span class="name">{{ item.name }}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="List-shortcut" @touchstart ="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"> 
            <ul>
                <li v-for="(item,index) in shortcutList" :data-index="index" class="item"
                :class="{'current':currentIndex === index}">
                    {{ item }}
                </li>
            </ul>
        </div>
        <div class="list-fixed" ref="fixed" v-show="fixedTitle">
            <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>
     </scroll>
</template>
<style lang="scss">
    @import "~common/sass/variable.scss";
    .listview{
        position:relative;
        width:100%;
        height:100%;
        overflow:hidden;
        .list-group{
            padding-bottom:pxTorem(60px);
        .list-group-title{
            height:pxTorem(60px);
            line-height:pxTorem(60px);
            padding-left:pxTorem(20px);
            @include font-size-small();
            color: $color-text-l;
            background-color:$color-highlight-background;
        }
        .list-group-item{
            display:flex;
            align-items:center;
            padding:pxTorem(40px) 0 0 pxTorem(60px)
                
        }
        }
        .list-group-item img{
            flex:0 0 pxTorem(100px);
            width:pxTorem(100px);
            height:pxTorem(100px);
            border-radius:50%;
        }
        .list-group-item .name{
            flex:1;
            flex-direction:column;
            margin-left:pxTorem(40px)
        }
        .List-shortcut{
            position:absolute;
            right:0;
            top: 50%;
            transform: translateY(-50%);
            z-index:30;
            .item{
            @include font-size-small();
                padding:6px;
                color: $color-text-l;
                line-height:1;
                &.current{
                color: $color-theme
                
            }
         }
            
        }
        .list-fixed{
            position:absolute;
            top:0;
            left:0;
            width:100%;
            .fixed-title{
                height:pxTorem(60px);
                line-height:pxTorem(60px);
                padding-left:pxTorem(20px);
                @include font-size-small();
                color: $color-text-l;
                background-color:$color-highlight-background;
            }
        }
    }
</style>
<script>
    import Scroll from 'base/scroll/scroll'
    import {getData} from 'common/js/dom'
    const ANCHOR_HEIGHT = 18
    const TITLE_HEIGHT = 30
    export default{
        props:{
            data:{
                type:Array,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                default:[]
            }
        },
        data(){
            return {
                scrollY : -1,
                currentIndex: 0,
                diff:-1
            }
            
        },
        created(){
            this.touch = {},
            this.listenScroll = true,
            this.listHeight = [],
            this.probeType =3
        },
        computed:{
            shortcutList(){
                return this.data.map((group)=>{
                    return group.title.substr(0,1)
                })
            },
            fixedTitle(){
                if(this.scrollY>0){
                    return ""
                }
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title: ""
            }
        },
        methods:{
            selectItem(item){
                this.$emit('select',item)
            },
            onShortcutTouchStart(e){
                let anchorIndex = getData(e.target,"index")
                console.log(e.touches)
                let firstTouch = e.touches[0]
                this.touch.y1 = firstTouch.pageY
                this.touch.anchorIndex = anchorIndex
                this._scrollTo(anchorIndex)
            },
            onShortcutTouchMove(e){
                let firstTouch = e.touches[0]
                this.touch.y2 = firstTouch.pageY
                let delta = (this.touch.y2 - this.touch.y1)/ ANCHOR_HEIGHT | 0
                let anchorIndex = parseInt(this.touch.anchorIndex) + delta
                this._scrollTo(anchorIndex)
                console.log(anchorIndex)
            },
            scroll(pos){
                this.scrollY = pos.y
            },
            _scrollTo(index){
                //传入右侧的列表的索引 移动到指定区块
                if(!index && index!==0){
                    return
                }
                if(index<0){
                    index = 0
                }else if(index>this.listHeight.length-2){
                    index = listHeight.length-2
                }
                this.scrollY = -this.listHeight[index]
                console.log(this.scrollY)
                this.$refs.listview.scrollToElement(this.$refs.listGroup[index])
            },
            _calculateHeight(){
                this.listHeight = []
                const list = this.$refs.listGroup
                //console.log(list)
                let height = 0
                this.listHeight.push(height)
                for(let i = 0; i<list.length;i++){
                    let item = list[i]
                    height += item.clientHeight
                    this.listHeight.push(height)
                }
            // console.log(this.listHeight)
            }
        },
        watch:{
            data(){
                setTimeout(()=>{
                    this._calculateHeight()
                },20)
            },
            scrollY(newY){
                const listHeight = this.listHeight
                //console.log(listHeight)
                //顶部
                if(newY>0){
                    this.currentIndex = 0
                }
                console.log(this.currentIndex)
                //中间
                for(let i =0;i<listHeight.length-1;i++){
                    let height1 = listHeight[i]
                    let height2 = listHeight[i+1]
                // console.log(height1,height2)
                    if((-newY)>=height1&&-newY<height2){
                        this.currentIndex = i
                        this.diff = height2 + newY
                       // console.log( height2 + newY)
                        return
                    }
                }
                //底部
                this.currentIndex =listHeight.length-2
            },
            diff(newVal){
                let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
                if (this.fixedTop === fixedTop) {
                return
                }
                this.fixedTop = fixedTop
                this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            }
        },
        components:{
            Scroll
        }
    }
</script>

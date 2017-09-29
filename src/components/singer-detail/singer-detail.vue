<template>
    <transition name="slider">
        <music-list class="singer-detail" :songs="songs" :title="title" :bg-image="bgImage"></music-list>
    </transition>
</template>
<style lang="scss" rel="stylesheet/css">
    @import "~common/sass/variable.scss";
    .singer-detail{
        width:100%;
        height:100%;
        position:fixed;
        top:0;
        left:0;
        z-index:100;
        background-color:$color-background
    }
    .slider-enter-active,.slider-leave-active{
        transition: all 1s;
    }
    .slider-enter,.slider-leave-to{
        transform:translate3d(100%,0,0)
    }
</style>
<script type="text/ecmascript-6">
    import { mapGetters} from 'vuex'
    import { getSingerDetail } from 'api/singer'
    import { createSong } from 'common/js/song'
    import { ERR_OK } from 'api/config'
    import MusicList from 'components/music-list/music-list'
    export default{
        data(){
            return {
                songs:[]
            }
        },
        created(){
            this._getDetail()
           //console.log(this.singer)
        },
        computed:{
            title(){
                return this.singer.name
            },
            bgImage(){
                return this.singer.avatar
            },
            ...mapGetters([
            'singer'
            ])
        },
        methods:{
            _getDetail(){
                if(!this.singer.id){
                    this.$router.push('/singer')
                    return
                }
                getSingerDetail(this.singer.id).then((res)=>{
                    console.log(res.data.list)
                    this.songs = this._normalizeSongs(res.data.list)
                    console.log(this.songs)
                })        
            },
            _normalizeSongs(list){
                let ret = []
               list.forEach((item)=>{
                    let {musicData} = item    
                    if(musicData.songid && musicData.albummid){
                        ret.push(createSong(musicData))
                    } 
                })
                return ret
            }
        },
        components:{
            "music-list":MusicList
        }
    }
</script>
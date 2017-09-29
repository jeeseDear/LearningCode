<template>
    <div class="singer">
        <list-view :data="singers" class="singer-content" @select = "selectSinger"></list-view>
        <router-view></router-view>
    </div>
</template>
<style lang="scss" rel="stylesheet/css">
@import "~common/sass/variable.scss";
  .singer{
    position:fixed;
    width:100%;
    top:pxTorem(176px);
    left:0;
    bottom:0;
    .singer-content{
        overflow:hidden;
        height:100%;
    }
  }
</style>
<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'
const HOT_NAME ="热门"
const HOT_SINGER = 10
export default{
    data(){
        return{
            singers:[]
        }
    },
    created(){
        this._getSingerList()
    },
    methods:{
            ...mapMutations({
            setSinger: 'SET_SINGER'
        }),
        selectSinger(singer){
            this.$router.push({
                path:`/singer/${singer.id}`
            })
            console.log(singer)
            this.setSinger(singer)
        },
        _getSingerList(){
            getSingerList().then((res)=>{
                if(res.code === ERR_OK){
                    this.singers = this._normalLizeSinger(res.data.list)
                    console.log(this.singers)
                }
            })
        },
        _normalLizeSinger(list){
            let map={
                hot:{
                title : HOT_NAME,
                items :[]
                }
            }
            list.forEach((item,index)=>{
                if(index < HOT_SINGER){
                    map.hot.items.push(new Singer({
                        id:item.Fsinger_mid,
                        name:item.Fsinger_name,
                    }))
                }
                const key = item.Findex
                if(!map[key]){
                    map[key]={
                        title:key,
                        items:[] 
                    }
                }
                map[key].items.push(new Singer({
                id:item.Fsinger_mid,
                name:item.Fsinger_name
                }))
            })
            //对象的遍历是无序的 所以转换成有序的数组
            let hot = []
            let ret = []
            for(let key in map){
            //   console.log(map[key].items)
                if(map[key].title === HOT_NAME){
                    console.log(HOT_NAME)
                    hot.push(map[key])
                }else if(map[key].title.match(/[a-zA-Z]/)){
                ret.push(map[key])
                }
            }
            console.log(hot)
            //比较title的unicode编码 按顺序排列
            ret.sort(function(a,b){
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret)
        }
        
    },
    components:{
        "list-view" :ListView
    }
}
</script>
<template>
    <div class="song-list">
        <ul>
            <li v-for="(song,index) in songs" class="item" @click = "selectItem(song,index)">
                <div class="content">
                    <h2 class="name">{{ song.name }}</h2>
                    <p class="desc">{{ getDesc(song) }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<style lang="scss">
    @import  "~common/sass/variable.scss";
    @import '~common/sass/mixin';
    .song-list{
        .item{
            margin-bottom:pxTorem(80px);
            @include font-size-medium();
            .desc{
                margin-top:pxTorem(28px);
                color:#646464;
            }
        }
    }
</style>
<script>
    export default{
        props:{
            songs:{
                type:Array,
                default:[]
            }
        },
        methods:{
            getDesc(song){
                return `${song.singer}.${song.album}`
            },
            selectItem(item,index){
                this.$emit('select',item,index)
            }
        }
    }
</script>
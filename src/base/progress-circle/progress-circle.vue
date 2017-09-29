<template>
    <div class="progress-circle">
        <svg width="44" height= "44" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="44" class="progress-background" fill="transparent"></circle>
            <circle cx="44" cy="44" r="44" class="progress-bar" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
        </svg>
        <slot></slot>
    </div>
</template>
<style lang="scss">
@import '~common/sass/variable.scss';
    .progress-circle{
        circle{
            stroke-width: 5px;
            transform-origin: center;
            &.progress-background{
                transform: scale(0.9);
                stroke: $color-theme-d;
            }
            &.progress-bar{
                transform: scale(0.9) rotate(-90deg);
                stroke:$color-theme
            }
        }
    }
</style>
<script>
    export default{
        props:{
            percent:{
                type:Number,
                default:0
            }
        },
        data(){
            return {
                dashArray : Math.PI * 88
            }
        },
        computed:{
            dashOffset(){
                return (1 - this.percent)*this.dashArray
            }
        }
    }
</script>
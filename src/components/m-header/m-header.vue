<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {}
</script>

<style scoped lang="scss" rel="stylesheet/css">
  @import "~common/sass/variable.scss";
  @import "~common/sass/mixin.scss";
  .m-header{
    position: relative;
    height: pxTorem(88px);
    text-align: center;
    color: $color-theme;
    font-size: 0;
    .icon{
      display: inline-block;
      vertical-align: top;
      margin-top: 6px;
      width: pxTorem(60px);
      height: pxTorem(64px);
      margin-right: 9px;
      background-image:bg-image('logo');
      background-size: pxTorem(60px) pxTorem(64px);
    }
    .text{
      display: inline-block;
      vertical-align: top;
      line-height: pxTorem(88px);
      @include font-size-large();
    }
    .mine{
      position: absolute;
      top: 0;
      right: 0;
      .icon-mine{
        display: block;
        padding: pxTorem(24px);
        font-size: pxTorem(40px);
        color: $color-theme;
      }
    }
  }
</style>
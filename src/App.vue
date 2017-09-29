<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
     <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
import { mapGetters } from 'vuex'
export default {
  components : {
    MHeader,
    Tab,
    'player':Player
  }
}
</script>

<style>
#app{
  height:100%;
}
</style>

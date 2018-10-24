<template>
  <div id="app">
    hello world
  </div>
</template>

<script>
import list from './list.js'
export default {
    data () {
        return {
            name:list
        }
    }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  transform: rotate(0deg);
}
</style>
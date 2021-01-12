<template>
  <div id="app">
    <conta-cadastro />
  </div>
</template>

<script>
import contaCadastro from './components/conta-cadastro.vue'

export default {
  name: 'App',
  components: {
    contaCadastro
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

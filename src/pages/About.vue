<template>
  <div class="hello">
    <RouterView> </RouterView>
    <p>About</p>
    <el-button>about</el-button>
  </div>
</template>
  
  <script>
export default {
  name: "Vue-About",
  props: {
    msg: String,
  },
};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
</style>
  
<template>
    <div class="hello">
      <AddSpareSpecs></AddSpareSpecs>
      <ShowSpareSpecs></ShowSpareSpecs>
    </div>
  </template>
  
  <script>
  import AddSpareSpecs from '@/components/Base/SpareSpecs/AddSpareSpecs.vue';
  import ShowSpareSpecs from '@/components/Base/SpareSpecs/ShowSpareSpecs.vue';
  export default {
    name: 'Vue-SparesSpecsEnter',
    props: {
    },
    components:{
      AddSpareSpecs,
      ShowSpareSpecs
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  </style>
  
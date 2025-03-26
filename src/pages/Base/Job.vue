<template>
    <div class="hello">
      <AddJob></AddJob>
      <ShowJob></ShowJob>
    </div>
  </template>
  
  <script>
  import AddJob from '@/components/Base/Job/AddJob.vue'
  import ShowJob from '@/components/Base/Job/ShowJob.vue'
  export default {
    name: 'Vue-Job',
    props: {},
    components: {
      AddJob,
      ShowJob
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
  
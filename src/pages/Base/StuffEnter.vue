<template>
    <div class="hello">
      <AddStuff></AddStuff>
      <ShowStuff></ShowStuff>
     </div>
  </template>
  
  <script>

  import AddStuff from '@/components/Base/StuffEnter/AddStuff.vue'
  import ShowStuff from '@/components/Base/StuffEnter/ShowStuff.vue'
  export default {
    name: 'Vue-StuffEnter',
    props: {},
    components:{
      AddStuff,
      ShowStuff
    },
    data() {
      return {
        form: {
          id:'',
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  
  </style>
  
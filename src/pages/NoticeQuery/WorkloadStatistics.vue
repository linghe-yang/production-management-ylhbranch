<template>
    <div class="hello">
      <DealWorkLoadStatistics>    
      </DealWorkLoadStatistics>
    </div>
  </template>
  
  <script>
  import DealWorkLoadStatistics from '@/components/NoticeQuery/DealWorkLoadStatistics.vue'
  export default {
    name: 'Vue-WorkloadStatistics',
    components:{
        DealWorkLoadStatistics
    },
    props: {
      msg: String
    },
    data(){
      return{}
    },
    methods:{
  
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  
  </style>
  
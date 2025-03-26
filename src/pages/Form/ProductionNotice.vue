<template>
    <div class="hello">
      <DealProductNotice v-if="!reported">    
      </DealProductNotice>
      
      <ExcelReportVue v-if="reported">
        <el-button @click="back">返回</el-button>
      </ExcelReportVue>

    </div>
  </template>
  
  <script>
  import ExcelReportVue from '@/components/Form/ExcelReport.vue';
  import DealProductNotice from '@/components/Form/ProductNotice.vue'
import { mapState } from 'vuex';
  export default {
    name: 'Vue-ProductionNotice',
    components:{
      ExcelReportVue,
      DealProductNotice,
    },
    props: {
      msg: String
    },
    data(){
      return{}
    },
    computed:{
      ...mapState({
        reported: s => s.module_globalData.reported 
      })
    },
    methods:{
      back: function(){
        this.$store.state.module_globalData.reported = false
      },
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

  </style>
  
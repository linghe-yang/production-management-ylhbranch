<template>
    <div>
  
      <el-tabs v-model="activeName">
      <el-tab-pane label="领料" name="first"> 
        <Get>
        </Get>
      </el-tab-pane>
      <el-tab-pane label="单据查询" name="second">
        <Query>
        </Query>
      </el-tab-pane>
    </el-tabs>
    <Excel></Excel>
    </div>
  
  </template>
  
  <script>
  import Get from "./MaterialRequisition/GetMaterial.vue"
  import Query from "./MaterialRequisition/MQNoticeQuery.vue"
  
  import Excel from "@/components/DealExcel.vue";
  export default {
    name: 'Vue-DealMaterialRequisition',
    components:{
        Get,
        Query,
  
      Excel
    },
    data(){
      return {
        activeName:"first"
      }
    },
    props: {
    },
    methods: {
    }
  }
  </script>
  
  <style>
  </style>
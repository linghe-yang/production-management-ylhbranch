<template>
    <div>
  
      <el-tabs v-model="activeName">
      <el-tab-pane label="直接入库" name="first"> 
        <ID>
        </ID>
      </el-tab-pane>
      <el-tab-pane label="单据查询" name="second">
        <NQ>
        </NQ>
      </el-tab-pane>
    </el-tabs>
    <Excel></Excel>
    </div>
  
  </template>
  
  <script>
  import ID from "./IntoStorageDirectly/InDirectly.vue"
  import NQ from "./IntoStorageDirectly/ISDNoticeQuery.vue"
  
  import Excel from "@/components/DealExcel.vue";
  export default {
    name: 'Vue-DealIntoStorageDirectly',
    components:{
        ID,
        NQ,
  
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
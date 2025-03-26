<template>
    <div>
      <el-row>
        <el-col :span="5"
          ><div class="grid-content bg-purple">
            <span class="input-span">
              开始日期
              <el-date-picker
                v-model="selectedData.beginTime"
                type="date"
                size="mini"
                placeholder="选择时间"
                style="width: 140px; margin-left: 10px"
              >
              </el-date-picker>
            </span></div
        ></el-col>
        <el-col :span="5"
          ><div class="grid-content bg-purple-light">
            <span class="input-span">
              结束日期
              <el-date-picker
                v-model="selectedData.endTime"
                type="date"
                size="mini"
                placeholder="选择时间"
                style="width: 140px; margin-left: 10px"
              >
              </el-date-picker>
            </span></div
        ></el-col>
        <el-col :span="8"
          ><div class="grid-content bg-purple-light">
            <span class="input-span">
              <el-button size="mini">查询</el-button>
            </span></div
        ></el-col>
      </el-row>
      <slot></slot>
      <!-- <Excel :height="'200px'" title="B"></Excel> -->
    </div>
  </template>
  
  <script>
  // import Excel from "@/components/Form/DealExcel.vue";
  export default {
    name: "Vue-ISDNoticeQuery",
    components:{
      // Excel
    },
    data(){
      return{
          selectedData:{
              beginTime:null,
              endTime:null
          }
      }
    },
    props: {},
    methods: {},
  };
  </script>
  
  <style scoped>
  .el-row {
    margin-bottom: 4px;
  }
  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .input-span {
    display: flex;
    align-items: center;
    font-size: small;
  }
  </style>
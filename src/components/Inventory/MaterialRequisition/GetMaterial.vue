<template>
    <div>
      <el-row>
        <el-col :span="5"
          ><div class="grid-content bg-purple-light">
            <span class="input-span">
              手工号
              <el-input
                size="mini"
                v-model="selectedData.manualNum"
                placeholder="0000"
                style="width: 150px; margin-left: 10px"
              ></el-input>
            </span></div
        ></el-col>
        <el-col :span="12"
          ><div class="grid-content bg-purple">
            <span class="input-span">
              总单号
              <el-input
                size="mini"
                v-model="selectedData.generalNoticeNum"
                placeholder="0000"
                style="width: 300px; margin-left: 10px"
              ></el-input>
            </span></div
        ></el-col>
        <el-col :span="7"
          ><div class="grid-content bg-purple-light">
            <span class="input-span">
              合计
              <el-input
                size="mini"
                v-model="selectedData.all"
                placeholder="0000"
                style="width: 150px; margin-left: 10px"
              ></el-input>
            </span>
          </div></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="17"
          ><div class="grid-content bg-purple-light">
            <span class="input-span">
              仓库
              <el-select
              v-model="selectedData.store"
              placeholder="请选择"
              size="mini"
              style="margin-left: 10px"
            >
              <el-option
                v-for="item in storeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            </span></div
        ></el-col>
        <el-col :span="7"
          ><div class="grid-content bg-purple-light">
            <span class="input-span">
              日期
              <el-date-picker
              v-model="selectedData.date"
              type="date"
              size="mini"
              placeholder="选择日期"
              style="width: 150px; margin-left: 20px"
            >
            </el-date-picker>
            </span>
          </div></el-col
        >
      </el-row>
      <!-- <Excel :height="'200px'"></Excel> -->
      <slot></slot>
      <el-row>
        <el-col :span="18">
          <el-button>新增单据</el-button>
          <el-button>保存单据</el-button>
          <el-button>修改单据</el-button>
          <el-button>删除单据</el-button>
          </el-col
        >
      </el-row>
    </div>
  </template>
    
    <script>
  // import Excel from "@/components/Form/DealExcel.vue";
  export default {
    name: "Vue-GetMaterial",
    components: {
      // Excel,
    },
    props: {},
    data() {
      return {
        selectedData: {
            manualNum: null,
            generalNoticeNum: null,
            all: null,
            store:null,
            date:null
        },
        storeList: [
        {
          value: "选项1",
          label: "项目1",
        },
        {
          value: "选项2",
          label: "项目2",
        },
        {
          value: "选项3",
          label: "项目3",
        },
      ],
      };
    },
  
    methods: {
  
    },
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
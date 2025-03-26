<template>
  <div>
    <el-row>
      <el-col :span="6"
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
      <el-col :span="6"
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
      <el-col :span="6"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            岗位
            <el-input
                size="mini"
                v-model="selectedData.post"
                placeholder="0000"
                style="width: 150px; margin-left: 10px"
              ></el-input>
          </span>
        </div></el-col
      >
      <el-col :span="6"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            工人
            <el-input
                size="mini"
                v-model="selectedData.worker"
                placeholder="0000"
                style="width: 150px; margin-left: 10px"
              ></el-input>
          </span>
        </div></el-col
      >
    </el-row>
    <el-row>
        <el-col :span="20"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            单号
            <el-input
                size="mini"
                v-model="selectedData.noticeNum"
                placeholder="0000"
                style="width: 400px; margin-left: 10px"
              ></el-input>
              <el-button size="mini">查询</el-button>
          </span>
        </div></el-col
      >
      <el-col :span="4"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
              <el-button size="mini">导出excel</el-button>
          </span>
        </div></el-col
      >

    </el-row>
    <el-tabs v-model="activeName">
      <el-tab-pane label="明细" name="first"> </el-tab-pane>
      <el-tab-pane label="汇总" name="second"> </el-tab-pane>
      <el-tab-pane label="进度查询" name="third"> </el-tab-pane>
    </el-tabs>
    <Excel></Excel>
  </div>
</template>
  
  <script>
import Excel from "@/components/DealExcel.vue";
export default {
  name: "Vue-DealWorkLoadStatistics",
  components: {
    Excel,
  },
  data() {
    return {
      activeName:'first',
      selectedData: {
        beginTime:null,
        endTime:null,
        post:null,
        worker:null,
        noticeNum:null
      },
    };
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
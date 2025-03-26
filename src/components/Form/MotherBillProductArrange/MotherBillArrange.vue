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
      <el-col :span="12"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            母单号
            <el-input
              size="mini"
              v-model="selectedData.billNum"
              placeholder="请输入"
              style="width: 400px; margin-left: 30px"
            ></el-input>
            <el-button @click="query" size="mini">查询</el-button>
          </span></div
      ></el-col>
      <!-- <el-col :span="2"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            <el-button size="mini">存列宽</el-button>
          </span></div
      ></el-col> -->
    </el-row>
    <!-- <el-row>
      <el-col :span="5"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            生产单号
            <el-input
              size="mini"
              v-model="selectedData.productNum"
              placeholder="请输入"
              style="width: 150px; margin-left: 10px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple">
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
          </span></div
      ></el-col>
      <el-col :span="8"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            自动单号
            <el-input
              size="mini"
              v-model="selectedData.autoNum"
              placeholder="0000"
              style="width: 150px; margin-left: 10px"
            ></el-input>
          </span>
        </div></el-col
      >
    </el-row> -->
    <!-- <Excel :height="'200px'"></Excel> -->
    <slot></slot>

  </div>
</template>
  
  <script>
// import Excel from "@/components/Form/DealExcel.vue";
import util from "@/utils/util";
export default {
  name: "Vue-MotherBillArrange",
  components: {
    // Excel,
  },
  props: {},
  data() {
    return {
      selectedData: {
        beginTime:'',
        endTime:'',
        billNum:'',
        // productNum: null,
        // date: null,
        // autoNum: null
      },
    };
  },
  mounted(){
    let d = new Date()
    d.setDate(d.getDate()+1)
    this.selectedData.endTime = d
  },
  methods: {
    query() {
      try {
        if (this.selectedData.billNum == "") {
          if (this.selectedData.beginTime == '') {
            let data = {
              begin_time: "",
              end_time: util.formatDate(this.selectedData.endTime, "ymd"),
              mb_num: "",
            };
            this.$API.reqGetMotherBillList(data).then((response) => {
              this.sendData(JSON.parse(JSON.stringify(response.data)));
            });
          } else {
            let data = {
              begin_time: util.formatDate(this.selectedData.beginTime, "ymd"),
              end_time: util.formatDate(this.selectedData.endTime, "ymd"),
              mb_num: "",
            };
            this.$API.reqGetMotherBillList(data).then((response) => {
              this.sendData(JSON.parse(JSON.stringify(response.data)));
            });
          }
        } else {
          // 按单号查询
          this.$API
            .reqGetMotherBillList({
              begin_time: '',
              end_time: '',
              mb_num: this.selectedData.billNum,
            })
            .then((response) => {
              this.sendData(JSON.parse(JSON.stringify(response.data)));
            });
        }
      } catch (err) {
        this.$message.error(err);
      }
    },
    sendData(data) {
      this.$emit("recvData", data);
    }
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
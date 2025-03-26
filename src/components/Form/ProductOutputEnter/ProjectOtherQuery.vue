<template>
  <div>
    <el-row>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <span class="input-span">
            开始日期
            <el-date-picker
              v-model="selectedData.begin_date"
              type="date"
              size="mini"
              placeholder="选择时间"
              style="width: 140px; margin-left: 10px"
            >
            </el-date-picker>
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            结束日期
            <el-date-picker
              v-model="selectedData.end_date"
              type="date"
              size="mini"
              placeholder="选择时间"
              style="width: 140px; margin-left: 10px"
            >
            </el-date-picker>
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            <el-button size="mini" @click="query">查询</el-button>
          </span>
        </div>
      </el-col>
    </el-row>
    <slot></slot>
    <!-- <Excel :height="'200px'" title="B"></Excel> -->
  </div>
</template>

<script>
// import Excel from "@/components/Form/DealExcel.vue";
import util from '@/utils/util';
export default {
  name: "Vue-ProjectOtherQuery",
  components: {
    // Excel
  },
  data() {
    return {
      selectedData: {
        begin_date: null,
        end_date: new Date(),
      },
      postList: [],
    };
  },
  props: {},
  methods: {
    query() {
      if (this.selectedData.end_date == null) {
        this.$message.error("请输入截至日期");
        return;
      }
      this.$API
        .reqGetOddJobs({
          begin_date:
            this.selectedData.begin_date == null
              ? ""
              : util.formatDate(this.selectedData.begin_date, "ymd"),
          end_date: util.formatDate(this.selectedData.end_date, "ymd"),
        })
        .then((res) => {
          if (res.data != []) {
            this.$emit("recvData", res.data);
          }
        });
    },
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

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.input-span {
  display: flex;
  align-items: center;
  font-size: small;
}
</style>
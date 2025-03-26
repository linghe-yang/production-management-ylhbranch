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
            操作人
            <el-select
              filterable
              :filter-method="staffNameFilter"
              v-model="selectedData.staff_name"
              placeholder="请选择"
              size="mini"
              @visible-change="getStaff"
            >
              <el-option
                v-for="item in staffList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            岗位
            <el-select
              filterable
              :filter-method="staffJobFilter"
              v-model="selectedData.staff_job"
              placeholder="请选择"
              size="mini"
              @visible-change="getPost"
            >
              <el-option
                v-for="item in postList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            单号
            <el-input
              size="mini"
              v-model="selectedData.work_num"
              placeholder="0000"
              style="width: 400px; margin-left: 30px"
            ></el-input>
            <el-button size="mini" @click="query">查询</el-button>
          </span>
        </div>
      </el-col>
      <!-- <el-col :span="2"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            <el-button size="mini">存列宽</el-button>
          </span></div
      ></el-col> -->
    </el-row>
    <slot></slot>
    <!-- <Excel :height="'200px'" title="B"></Excel> -->
  </div>
</template>

<script>
// import Excel from "@/components/Form/DealExcel.vue";
import util from "@/utils/util";
import { mapState } from "vuex";
export default {
  name: "Vue-ProductEntryQuery",
  components: {
    // Excel
  },
  data() {
    return {
      staffList: [],
      postList: [],
    };
  },
  computed: {
    ...mapState("module_productOutput", ["selectedData"]),
  },
  props: {},
  mounted() {
    let d = new Date();
    d.setDate(d.getDate() + 1);
    this.selectedData.end_date = d;
  },
  methods: {
    staffNameFilter(e) {
      this.selectedData.staff_name = e;
    },
    staffJobFilter(e) {
      this.selectedData.staff_job = e;
    },
    getStaff() {
      this.$API.reqGetAllStaff().then((response) => {
        if (response.data != undefined) {
          let staffList = response.data.map((x) => {
            return { label: x.name, value: x.name };
          });
          staffList.push({ label: "无", value: "" });
          this.staffList = staffList;
        }
      });
    },
    getPost() {
      this.$API.reqGetAllJob().then((response) => {
        if (response.data != undefined) {
          let postList = response.data.map((x) => {
            return { label: x.name, value: x.name };
          });
          postList.push({ label: "无", value: "" });
          this.postList = postList;
        }
      });
    },
    query() {
      try {
        let data = {
          begin_date:
            this.selectedData.begin_date == null
              ? ""
              : util.formatDate(this.selectedData.begin_date, "ymd"),
          end_date:
            this.selectedData.end_date == null
              ? ""
              : util.formatDate(this.selectedData.end_date, "ymd"),
          staff_name:
            this.selectedData.staff_name == "无"
              ? ""
              : this.selectedData.staff_name,
          staff_job:
            this.selectedData.staff_job == "无"
              ? ""
              : this.selectedData.staff_job,
          work_num: this.selectedData.work_num,
        };
        this.$API.reqGetOutput(data).then((response) => {
          this.sendData(JSON.parse(JSON.stringify(response.data)));
        });
      } catch (err) {
        this.$message.error(err);
      }
    },
    sendData(data) {
      this.$emit("recvData", data);
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
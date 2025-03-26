<template>
  <div>
    <el-row>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <span class="input-span">
            单号
            <el-input
              size="mini"
              v-model="selectedData.work_num"
              placeholder="0000"
              style="width: 150px; margin-left: 10px"
            ></el-input>
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            岗位
            <el-select
              v-model="selectedData.post"
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
export default {
  name: "Vue-ProjectRemainQuery",
  components: {
    // Excel
  },
  data() {
    return {
      selectedData: {
        work_num: "",
        post: "",
      },
      postList: [],
    };
  },
  props: {},
  methods: {
    getPost() {
      this.$API.reqGetAllJob().then((response) => {
        if (response.data != undefined) {
          let postList = response.data.map((x) => {
            return { label: x.name, value: x.name };
          });
          this.postList = postList;
        }
      });
    },
    query() {
      if (this.selectedData.work_num == "") {
        this.$message.error("请输入单号");
        return;
      }
      if (this.selectedData.post == "") {
        this.$message.error("请选择岗位");
        return;
      }
      let form_type = 2;
      if (this.selectedData.post == "焊接") form_type = 4;
      else if (this.selectedData.post == "整理") form_type = 3;
      if (form_type == 4 || form_type == 3) {
        this.$API.reqGetReport({
          work_num: this.selectedData.work_num,
          form_type: 3,
        });
        this.$API.reqGetReport({
          work_num: this.selectedData.work_num,
          form_type: 4,
        });
      }

      // this.$API
      //   .reqGetProductNotice({ work_num: this.selectedData.work_num })
      //   .then((res) => {
      //     if (res.data != null) {
      //       let total_set_num = parseInt(res.data.set_num);
      //       if (form_type == 4 || form_type == 3) {
      //         let p1 = this.$API.reqGetReport({
      //           work_num: this.selectedData.work_num,
      //           form_type: 3,
      //         });
      //         let p2 = this.$API.reqGetReport({
      //           work_num: this.selectedData.work_num,
      //           form_type: 4,
      //         });
      //         let promises = Promise.all([p1, p2]);
      //         promises.then(() => {
      //           this.$message.success("保存成功");
      //         });
      //         this.$API
      //           .reqGetReport({
      //             work_num: this.selectedData.work_num,
      //             form_type: 4,
      //             // complete:total_set_num,
      //           })
      //           .then((res) => {
      //             if (res.data.length != 0) {
      //               this.$emit("recvData", res.data, total_set_num);
      //             } else {
      //               this.$API
      //                 .reqGetReport({
      //                   work_num: this.selectedData.work_num,
      //                   form_type: 3,
      //                   // complete:total_set_num,
      //                 })
      //                 .then((res) => {
      //                   if (res.data.length != 0) {
      //                     this.$emit("recvData", res.data, total_set_num);
      //                   } else {
      //                     this.$message.error("未找到单据");
      //                     this.$emit("recvData", null);
      //                   }
      //                 });
      //             }
      //           });
      //       }
      //     }
      //   });
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
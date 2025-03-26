<template>
  <div>
    <el-row>
      <el-col :span="4"
        ><div class="grid-content bg-purple">
          <span class="input-span">
            备品数量
            <el-input
              size="mini"
              v-model="cuttingData.sparesNum"
              placeholder="0"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            数量
            <el-input
              size="mini"
              v-model="cuttingData.cutNum"
              placeholder="0"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            宽度
            <el-input
              size="mini"
              v-model="cuttingData.width"
              placeholder="0"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="3"
        ><div class="grid-content bg-purple-light">
          <el-button @click="addCutting">添加</el-button>
        </div></el-col
      >
      <el-col :span="3"
        ><div class="grid-content bg-purple-light">
          <el-button type="primary" @click="confirmCutting">确认</el-button>
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-table :data="tableData" stripe style="width: 80%" :border="true">
        <el-table-column prop="order" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.row.order }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sparesNum" label="备品数量"> </el-table-column>
        <el-table-column prop="num" label="数量"> </el-table-column>
        <el-table-column prop="width" label="宽度"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="small"
              @click="deleteCutting(scope.$index, tableData)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
  
  <script>
// import util from "@/utils/util.js";
// import fomula from "@/utils/fomula.js";
export default {
  name: "Vue-CutHalf",
  data() {
    return {
      cuttingData: {
        rows: this.rows,
        sparesNum: 0,
        cutNum: null,
        width: 1000,
      },
      tableData: [],
    };
  },
  props: ["rows"],
  watch: {
    rows(newValue) {
      this.cuttingData.rows = newValue;
    },
  },

  methods: {
    addCutting() {
      try {
        if (this.cuttingData.cutNum === null) {
          throw Error("请输入数量");
        }
        this.tableData.forEach((t) => {
          if (
            t.order.filter((x) => this.cuttingData.rows.includes(x)).length !==
            0
          ) {
            throw Error("请勿选择重复的行");
          }
        });
        this.tableData.push({
          order: this.cuttingData.rows,
          width: parseInt(this.cuttingData.width),
          num: parseInt(this.cuttingData.cutNum),
          sparesNum: parseInt(this.cuttingData.sparesNum),
        });
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        });
      } catch (err) {
        this.$message.error(err);
      }
    },
    deleteCutting(index, rows) {
      rows.splice(index, 1);
    },
    confirmCutting() {
      if (this.tableData.length === 0) {
        this.$message.error("请添加减半片记录");
        return;
      }
      this.$confirm("确认要减半片吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("confirmcutting", this.tableData);
        })
        .catch(() => {});
    },
    clearTableData() {
      this.tableData = [];
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
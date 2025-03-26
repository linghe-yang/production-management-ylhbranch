<template>
  <el-card class="box-card" style="width: 80%">
    <el-table :data="tableData" :border="true" style="width: 80%">
      <el-table-column prop="id" label="箱编号" width="180"> </el-table-column>

      <el-table-column prop="color" label="颜色">
        <template slot-scope="scope">
          <el-color-picker
            v-if="scope.row.id == editId"
            v-model="scope.row.color"
          ></el-color-picker>
          <div v-else :style="{ background: scope.row.color }">&nbsp;</div>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.id != editId"
            @click="changeClick(scope.row)"
            size="small"
            >编辑</el-button
          >
          <el-button
            type="warn"
            v-if="scope.row.id == editId"
            @click="cancelClick(scope.row)"
            size="small"
            >取消</el-button
          >
          <el-button
            type="primary"
            v-if="scope.row.id == editId"
            @click="saveClick(scope.row)"
            size="small"
            >保存</el-button
          >
          <el-button
            type="danger"
            v-if="scope.row.id != editId"
            @click="delClick(scope.row)"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Vue-ShowBoxColor",
  props: {},
  methods: {
    fetchData() {
      this.$API.reqGetAllBox().then((response) => {
        function customSort(a, b) {
          const idA = a.id.toUpperCase();
          const idB = b.id.toUpperCase();

          // 按照id的长度来比较，长度短的在前面
          if (idA.length !== idB.length) {
            return idA.length - idB.length;
          }

          // 长度相同时按照字母顺序比较
          return idA.localeCompare(idB);
        }
        let res = JSON.parse(JSON.stringify(response.data));
        res.sort(customSort)

        this.$data.tableData = res;
      });
    },
    delClick(row) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$API
            .reqDelBox(JSON.parse(JSON.stringify({ id: row.id })))
            .then(() => {
              this.fetchData();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      this.editId = "";
    },
    cancelClick(row) {
      if (row.id) {
        for (let i in row) {
          row[i] = this.editData[i];
        }
        this.editId = "";
      } else {
        this.tableData.forEach((item, index) => {
          if (item.id == "") {
            this.tableData.splice(index, 1);
          }
        });
      }
    },
    saveClick(row) {
      this.$confirm("此操作将永久更改信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$API.reqSetBox(JSON.parse(JSON.stringify(row))).then(() => {
            this.fetchData();
            this.editId = "";
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消更改",
          });
        });
    },
    changeClick(row) {
      if (
        this.tableData.some((item) => {
          return item.id == "";
        })
      ) {
        this.$message({
          message: "请先保存",
          type: "warning",
        });
        return;
      }
      this.editData = JSON.parse(JSON.stringify(row)); //把当前行数据存一份，取消的时候行数据还原
      this.editId = row.id;
    },
  },
  data() {
    return {
      editData: [], //编辑行初始数据
      editId: "", //判断编辑的是哪一行
      tableData: [
        // {
        //   id: "0023",
        //   color: "#DA2E2E",
        // }
      ],
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    updated: {
      handler(updated) {
        if (updated) {
          this.$store.commit("updated", false);
          this.fetchData();
        }
      },
    },
  },
  computed: {
    showTable() {
      return this.filterDataShow.slice(
        (this.currentPage - 1) * this.pagesize,
        this.currentPage * this.pagesize
      );
    },
    ...mapState({
      updated: (state) => state.module_Base.updated,
    }),
  },
};
</script>
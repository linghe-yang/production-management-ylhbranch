<template>
  <div>
    <el-row>
      <!-- <el-col :span="4"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            生产单号
            <el-input
              size="mini"
              v-model="selectedData.productNum"
              placeholder="0"
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
      <el-col :span="6"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            自动单号
            <el-input
              size="mini"
              v-model="selectedData.autoNum"
              placeholder="0"
              style="width: 150px; margin-left: 10px"
            ></el-input>
          </span></div
      ></el-col> -->
      <el-col :span="5"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            总长度
            <el-input
              size="mini"
              v-model="selectedData.fullLength"
              placeholder="0"
              style="width: 150px; margin-left: 10px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="5"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            生产片数
            <el-input
              size="mini"
              v-model="selectedData.productPiece"
              placeholder="0"
              style="width: 150px; margin-left: 10px"
            ></el-input>
          </span></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="6"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            总片数
            <el-input
              size="mini"
              v-model="selectedData.fullPiece"
              placeholder="0"
              style="width: 150px; margin-left: 10px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="6"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            总面积
            <el-input
              size="mini"
              v-model="selectedData.fullArea"
              placeholder="0"
              style="width: 150px; margin-left: 10px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="6"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            生产面积
            <el-input
              size="mini"
              v-model="selectedData.ProductArea"
              placeholder="0"
              style="width: 150px; margin-left: 10px"
            ></el-input>
          </span></div
      ></el-col>
    </el-row>
    <el-row>
      
    </el-row>
  </div>
</template>
  
  <script>
import { mapState } from 'vuex';
export default {
  name: "Vue-ProductEnter",
  components: {},
  props: {},
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    ...mapState("module_productOutput", ["selectedData"]),
  },
  mounted() {

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
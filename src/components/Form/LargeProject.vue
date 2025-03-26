<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="生成大项目签收单" name="0">
        <LP> </LP>
      </el-tab-pane>
      <el-tab-pane label="删除大项目签收单" name="1">
        <el-row>
          <el-col :span="6"
            ><div class="grid-content bg-purple-light">
              <span class="input-span">
                按项目名称删除
                <el-input
                  size="mini"
                  v-model="projectNameQuery"
                  placeholder="请输入"
                  style="width: 200px; margin-left: 30px"
                ></el-input>
                <el-button type="mini" @click="delProject"> 删除 </el-button>
              </span>
            </div></el-col
          >
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
  
<script>
import LP from "./LargeProject/LargeProject.vue";

export default {
  name: "Vue-DealMotherBillArrange",
  components: {
    LP,
  },
  data() {
    return {
      activeName: "0",
      projectNameQuery:''
    };
  },
  props: {},
  mounted() {},
  methods: {
    delProject(){
      if (this.projectNameQuery == "") {
        this.$message.error("请输入项目名称");
        return;
      }
      this.$API
        .reqDeleteLargeProject({ project_name: this.projectNameQuery })
        .then((res) => {
          if (typeof res.code == 'number' && res.code == 200) {
            this.$message.success("删除成功")
          }else{
            this.$message.error("找不到该项目")
          }
        });
      
    }
  },
};
</script>
  
<style></style>
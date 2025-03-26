<template>
  <el-card class="box-card" style="width: 80%">
    <div slot="header" class="clearfix">
      <span>新增备品规格</span>
    </div>
    <div class="text item">
      <el-form
        :model="formSpareSpecs"
        :rules="rules"
        ref="formSpareSpecs"
        label-width="30%"
        style="width: 80%"
      >
        <el-form-item label="编号" prop="id">
          <el-input v-model="formSpareSpecs.id"></el-input>
        </el-form-item>
        <el-form-item label="长度" prop="length">
          <el-input v-model="formSpareSpecs.length"></el-input>
        </el-form-item>
        <el-form-item label="宽度" prop="width">
          <el-input v-model="formSpareSpecs.width"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formSpareSpecs')"
            >添加</el-button
          >
          <el-button @click="resetForm('formSpareSpecs')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Vue-AddSpareSpecs",
  props: {},
  data() {
    return {
      rules: {
        id: [{ required: true, message: "请输入编号", trigger: "changed" }],
        length: [{ required: true, message: "请输入长度", trigger: "changed" }],
        width: [{ required: true, message: "请输入宽度", trigger: "changed" }],
      },
      formSpareSpecs: {
        id:"",
        length: "",
        width: "",
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$API.reqAddSpareSpecs(this.$data[formName]).then(() => {
            this.$refs[formName].resetFields();
            this.$store.commit("updated", true);
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style></style>
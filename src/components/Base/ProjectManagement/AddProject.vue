<template>
  <el-card class="box-card" style="width: 80%">
    <div slot="header" class="clearfix">
      <span>新增项目</span>
    </div>
    <div class="text item">
      <el-form
        :model="ProjectForm"
        :rules="rules"
        ref="ProjectForm"
        label-width="30%"
        style="width: 80%"
      >
        <el-form-item label="项目编号" prop="id" :required="true">
          <el-input v-model="ProjectForm.id"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="ProjectForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ProjectForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ProjectForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Vue-AddProject",
  props: {},
  data() {
    return {
      rules: {
        id: [{ required: true, message: "请输入项目编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
      },
      ProjectForm: {
        id: "",
        name: "",
        finish: 0,
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$API.reqAddProject(this.$data[formName]).then(() => {
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
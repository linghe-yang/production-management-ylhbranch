<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>新增产品</span>
    </div>
    <div class="form">
      <el-form
        ref="formProduct"
        :model="formProduct"
        label-position="right"
        :rules="rules"
        label-width="200px"
        style="width: 80%"
      >
        <el-form-item label="产品号" prop="id">
          <el-col :span="20">
            <el-input v-model="formProduct.id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-col :span="20">
            <el-input v-model="formProduct.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="产品规格" prop="size">
          <el-col :span="20">
            <el-input v-model="formProduct.size"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="成本价" prop="cost">
          <el-col :span="20">
            <el-input v-model="formProduct.cost"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="产品分类" prop="class">
          <el-col :span="20">
            <el-select v-model="formProduct.class" placeholder="请选择">
              <el-option label="纸箱" value="纸箱"></el-option>
              <el-option label="包装膜" value="包装膜"></el-option>
              <el-option label="原料" value="原料"></el-option>
              <el-option label="管材管件" value="管材管件"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formProduct')"
            >添加</el-button
          >
          <el-button @click="resetForm('formProduct')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Vue-AddProduct",
  props: {},
  data() {
    return {
      rules: {
        id: [{ required: true, message: "请输入产品编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        size: [{ required: true, message: "请输入产品规格", trigger: "blur" }],
        cost: [{ required: true, message: "请输入成本价", trigger: "blur" }],
      },
      formProduct: {
        id: "",
        name: "",
        size: "",
        cost: "",
        class: "",
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$API.reqAddProduct(this.$data[formName]).then(() => {
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

<style>
</style>
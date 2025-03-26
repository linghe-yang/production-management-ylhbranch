<template>
  <el-card class="box-card" style="width: 80%">
    <div slot="header" class="clearfix">
      <span>新增员工</span>
    </div>
    <div class="formStuff">
      <el-form
        ref="formStuff"
        :rules="rules"
        :model="formStuff"
        label-width="200px"
        style="width: 80%"
      >
        <el-form-item label="员工号" prop="id">
          <el-input v-model="formStuff.id"></el-input>
        </el-form-item>
        <el-form-item label="员工名称" prop="name">
          <el-input v-model="formStuff.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formStuff.phone"></el-input>
        </el-form-item>
        <!-- 
        <el-form-item label="员工密码" prop="password">
          <el-input v-model="formStuff.phone"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="员工职务" prop="duty">
                    <el-select v-model="formStuff.duty" placeholder="请选择">
                        <el-option v-for="item in tableData" :label="item.name" :value="item.name"
                            :key="item.id"></el-option>
                    </el-select>
                </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('formStuff')"
            >添加</el-button
          >
          <el-button @click="resetForm('formStuff')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Vue-AddStuff",
  props: {},
  data() {
    return {
      rules: {
        id: [{ required: true, message: "请输入员工编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入员工名称", trigger: "blur" }],
        password: [
          { required: true, message: "请输入员工密码", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入员工电话", trigger: "blur" }],
        duty: [
          { required: true, message: "请选择员工职位", trigger: "changed" },
        ],
      },
      formStuff: {
        id: "",
        name: "",
        password: "",
        phone: "",
        duty: "",
      },
      tableData: [],
    };
  },
  mounted(){
  },
  methods: {
    fetchData() {
      this.$API.reqGetAllJob().then((response) => {
        if (response.data != undefined)
          this.$data.tableData = JSON.parse(JSON.stringify(response.data));
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$API.reqAddStaff(this.$data[formName]).then(() => {
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
  created() {
    this.fetchData();
  },
};
</script>

<style></style>
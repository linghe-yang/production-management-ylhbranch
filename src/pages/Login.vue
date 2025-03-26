<template>
  <div class="login-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="login-form"
    >
      <h2 class="login-title">系统登录</h2>
      <el-form-item label="账号" prop="username">
        <el-select v-model="name" placeholder="请选择">
          <el-option
            v-for="item in tableData"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

  
<script>
export default {
  name: "Vue-Login",
  props: {
    msg: String,
  },
  data() {
    return {
      form: {
        username: "",
        // password: "",
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
        ],
        // password: [
        //   { required: true, message: "密码不能为空", trigger: "blur" },
        // ],
      },
      tableData: [],
      name:null
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.$API.reqGetAllStaff().then((response) => {
        this.$data.tableData = JSON.parse(JSON.stringify(response.data));
      });
    },
    login() {
      // 在这里实现验证登录的逻辑
      // 使用this.username和this.password获取用户名和密码
      // 假设有一个名为authenticate的函数用于验证登录
      // console.log(this.$data.form);
      if(this.$data.name == null){
        return
      }
      const isLoggedIn = "true";
      if (isLoggedIn) {
        localStorage.setItem("isLoggedIn", "true"); // 登录成功后将登录状态存储在localStorage中
        localStorage.setItem("myName", this.$data.name);
        this.$router.push("/Detail"); // 登录成功后跳转到主页
      } else {
        // 处理登录失败的情况
      }
    },
  },
};
</script>

<style scoped>
/* 表单 */
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgb(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 20px;
}
/* 背景 */
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
/*标题*/
.login-title {
  text-align: center;
  color: #303133;
}
</style>

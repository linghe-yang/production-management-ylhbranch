<template>
  <el-card class="box-card" style="width: 80%">
    <div slot="header" class="clearfix">
      <span>新增客户</span>
    </div>
    <div class="form">
      <el-form ref="formCustomer" :model="formCustomer" label-position="right" :rules="rules" label-width="200px"
        style="width: 80%">
        <el-form-item label="客户号" prop="id">
          <el-col :span="16">
            <el-input v-model="formCustomer.id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="客户名称" prop="name">
          <el-col :span="16">
            <el-input v-model="formCustomer.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="Logo">
          <el-upload class="upload-logo" ref="upload" :action="UploadLogo" :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove" :file-list="fileList" list-type="picture" :limit="1" :multiple="false"
            :auto-upload="false" :http-request="uploadRequest"
            :on-change="onAddImg"
            >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg文件，且不超过1M
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <!-- <el-form-item label="电话" prop="phone">
          <el-col :span="16">
            <el-input v-model="formCustomer.phone"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input type="textarea" v-model="formCustomer.address"></el-input>
        </el-form-item> --> <!--甲方要求不要电话与地址-->
        <el-form-item>
          <el-button type="primary" @click="submitForm">添加</el-button>
          <el-button @click="resetForm('formCustomer')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "Vue-AddCustomer",
  props: {},
  data() {
    return {
      rules: {
        id: [{ required: true, message: "请输入客户编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        phone: [{ required: true, message: "请输入客户电话", trigger: "blur" }],
        address: [
          { required: true, message: "请输入客户地址", trigger: "blur" },
        ],
      },
      UploadLogo: "http://47.98.125.34:8080/uploadLogo",

      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      hasImage:false,
      formCustomer: {
        id: "",
        name: "",
        logo: "", //url
        phone: "",
        address: "",
      },
    };
  },
  methods: {
    uploadRequest(e) {
      if (this.beforeAvatarUpload(e.file)) {
        
        this.$API.reqUploadLogo({ file: e.file }).then((response) => {
          try {
            let formName = 'formCustomer'
            if (response.code == 200)
              this.$data[formName].logo = "http://47.98.125.34:8080" + response.result;
            // this.$data[formName].logo = response.result;
            else throw Error(response.code);
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.$API.reqAddCustomer(this.$data[formName]).then(() => {
                  this.$refs[formName].resetFields();
                  this.$store.commit("updated", true);
                  this.handleRemove()
                });
              } else {
                throw Error("error submit!!");
              }
            });
          } catch (err) {
            this.$message.error(err);
          }
        });
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      return isJPG && isLt2M;
    },
    handleRemove() {
      this.hasImage = false
      this.$refs.upload.clearFiles();
      this.formCustomer = {
        id: "",
        name: "",
        logo: "",
        phone: "",
        address: "",
      }
    },
    onAddImg(){

      this.hasImage = true
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    submitForm() {
      if(this.hasImage){
        this.$refs.upload.submit();
      }else{
        let formName = 'formCustomer'
        this.$API.reqAddCustomer(this.$data[formName]).then(() => {
          this.$refs[formName].resetFields();
          this.$store.commit("updated", true);
          this.handleRemove()
        });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>


<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
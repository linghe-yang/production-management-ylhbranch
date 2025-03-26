<template>
    <el-card class="box-card" style="width: 80%;">
        <div slot="header" class="clearfix">
            <span>新增分箱颜色</span>
        </div>
        <div class="text item">
            <el-form :model="formColor" :rules="rules" ref="formColor" label-width="30%" style="width: 80%;">
                <el-form-item label="编号" prop="id" :required=true>
                    <el-input v-model="formColor.id"></el-input>
                </el-form-item>
                <el-form-item label="颜色" prop="color">
                    <el-color-picker v-model="formColor.color"></el-color-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('formColor')">添加</el-button>
                    <el-button @click="resetForm('formColor')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>

<script>

export default {
    name: 'Vue-AddBoxColor',
    props: {},
    data() {
        return {
            rules: {
                id: [
                    { required: true, message: '请输入编号', trigger: 'blur' }
                ],
                color:[
                    {required: true,message: '请选择颜色', trigger: 'changed' }
                ]
            },
            formColor: {
                id: '',
                color: '',
            },
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$API.reqAddBox(this.$data[formName])
                    .then(()=>{
                        this.$refs[formName].resetFields();
                        this.$store.commit("updated",true);
                    })
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }

    }
}
</script>

<style></style>
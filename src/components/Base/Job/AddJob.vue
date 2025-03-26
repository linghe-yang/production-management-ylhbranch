<template>
    <el-card class="box-card" style="width: 80%;">
        <div slot="header" class="clearfix">
            <span>新增岗位</span>
        </div>
        <div class="text item">
            <el-form :model="formJob" :rules="rules" ref="formJob" label-width="30%" style="width: 80%;">
                <el-form-item label="编号" prop="id" :required=true>
                    <el-input v-model="formJob.id"></el-input>
                </el-form-item>
                <el-form-item label="岗位名称" prop="name">
                    <el-input v-model="formJob.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('formJob')">添加</el-button>
                    <el-button @click="resetForm('formJob')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</template>

<script>

export default {
    name: 'Vue-AddJob',
    props: {},
    data() {
        return {
            rules: {
                id: [
                    { required: true, message: '请输入编号', trigger: 'blur' }
                ],
                name:[
                    {required: true,message: '请输入岗位名称', trigger: 'changed' }
                ]
            },
            formJob: {
                id: '',
                name: '',
            },
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$API.reqAddJob(this.$data[formName]);
                    this.$refs[formName].resetFields();
                    this.$store.commit("updated",true);
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
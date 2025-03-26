<template>
    <div>
        <el-header>
		<div class='sys-title'>企业生产管理系统</div>
        <el-button type="text"  @click="logOut" >退出登录</el-button>
	</el-header>
    </div>
</template>

<script>
export default {
    name: 'Vue-Banner',
    props: {
    },
    methods: {
        logOut(){//退出登录
            localStorage.setItem('isLoggedIn',"false")
            this.$router.replace('/Login')
        }
    }
  }
</script>

<style>
</style>
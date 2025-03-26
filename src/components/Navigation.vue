<template>
  <!-- 通过el-menu-item-group组件可以实现菜单进行分组，分组名可以通过title属性直接设定，也可以通过具名 slot 来设定。 -->
  <!-- element-ui中的导航栏标签为<el-menu>，可以利用其完成跳转页面功能在<el-menu>加上:router='true'index必须绑定路由的path(原封不动的粘贴过去)要特别关注<el-menu>的属性值设置 -->
  <el-menu
    :router="true"
    :unique-opened="true"
    background-color="#545c64"
    text-color="#fff"
    collapse
    active-text-color="#ffd04b"
    class="menu-container"
  >
    <el-submenu index="/base">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>基础信息</span>
      </template>
      <el-menu-item index="/Detail/base/1-1">员工录入</el-menu-item>
      <el-menu-item index="/Detail/base/1-2">产品录入</el-menu-item>
      <el-menu-item index="/Detail/base/1-3">分箱颜色</el-menu-item>
      <el-menu-item index="/Detail/base/1-4">客户录入</el-menu-item>
      <el-menu-item index="/Detail/base/1-5">项目管理</el-menu-item>
      <el-menu-item index="/Detail/base/1-6">岗位</el-menu-item>
      <el-menu-item index="/Detail/base/1-7">备品规格录入</el-menu-item>
    </el-submenu>
    <el-submenu index="/form">
      <template slot="title">
        <i class="el-icon-s-order"></i>
        <span>单据录入</span>
      </template>
      <el-menu-item index="/Detail/form/2-1">生产通知单</el-menu-item>
      <el-menu-item index="/Detail/form/2-2">母单录入</el-menu-item>
      <el-menu-item index="/Detail/form/2-3">母单安排生产计划</el-menu-item>
      <el-menu-item index="/Detail/form/2-4">生产量录入</el-menu-item>
      <el-menu-item index="/Detail/form/2-5">大项目签收单</el-menu-item>
    </el-submenu>
    <!-- <el-submenu index="/inventory">
      <template slot="title">
        <i class="el-icon-s-claim"></i>
        <span>库存单据</span>
      </template>
      <el-menu-item index="/Detail/inventory/3-1">直接入库</el-menu-item>
      <el-menu-item index="/Detail/inventory/3-2">领料</el-menu-item>
      <el-menu-item index="/Detail/inventory/3-3">整理出库</el-menu-item>
    </el-submenu>
    <el-submenu index="/noticeQuery">
      <template slot="title">
        <i class="el-icon-s-marketing"></i>
        <span>报表查询</span>
      </template>
      <el-menu-item index="/Detail/noticeQuery/4-1">工作量统计</el-menu-item>
    </el-submenu> -->
    <!-- <el-menu-item index="/home">
					<template slot='title'>
						<span>个人中心</span>
					</template>
				</el-menu-item>
				<el-menu-item index="/Detail/manage">
					<template slot='title'>
						<span>工作管理</span>
					</template>
				</el-menu-item> -->
  </el-menu>
</template>

<script>
export default {
  name: "Vue-Navigation",
  props: {
    msg: String,
  },
};
</script>

<style>
.menu-container {
  height: 100%;
  top: 0;
  left: 0;
  width: 100px;
}
.menu-container el-submenu el-menu-item {
  font-size: xx-small;
}
</style>
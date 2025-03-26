<template>
  <div>
      <el-container id="detail">
          <el-header>
              <Banner></Banner>
              <!-- 标题 -->
          </el-header>
          <el-container>
              <el-aside width="100px">
                  <Navigation></Navigation>
                  <!-- 导航栏 -->
              </el-aside>
              <el-main>
                  <router-view></router-view>
              </el-main>
          </el-container>
      </el-container>
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue';
import Navigation from '@/components/Navigation.vue'
export default {
  name: 'Vue-Detail',
  components: {
      Navigation,
      Banner
  },
}
</script>

<style>
#detail {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  width: 100%;
}

.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;

}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;

}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;

}

body>.el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
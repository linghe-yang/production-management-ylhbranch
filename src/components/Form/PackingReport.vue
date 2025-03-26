<template>
  <div>
    <el-row>
      <slot></slot>
    </el-row>
    <div v-for="(src, index) in srcs" :key="index">
      <iframe :src="src" width="100%" height="500px" frameborder="0"></iframe>
    </div>
    <!-- <iframe :src="srcs[0]" width="100%" height="1200px" frameborder="0"></iframe> -->
  </div>
</template>
    
    <script>
export default {
  name: "Vue-PackingReport",
  data() {
    return {
      srcs: [],
    };
  },
  created() {
    this.getParams();
  },
  methods: {
    getParams() {
      let workNum = this.$route.query.workNum;
      this.$API.reqGetPacking({ work_num: workNum }).then((res) => {
        res.data.forEach((item)=>{
          this.srcs.push(
            `http://47.98.125.34:8087/jmreport/view/911906887336148992?workNum=${workNum}&thisBoxNum=${item.this_box_num}&totalBoxNum=${item.total_box_num}&box=${item.box}`
          );
        })

      });

      // for(let thisBoxNum = 1;thisBoxNum < boxs.length;thisBoxNum++){
      //   this.srcs.push(`http://47.98.125.34:8087/jmreport/911906887336148992?workNum=${workNum}&thisBoxNum=${thisBoxNum}&totalBoxNum=${boxs.length}`)
      // }
    },
  },
  watch: {
    $route: "getParams",
  },
};
</script>
    <style scoped>
</style>

<template>
  <div class="hello">
    <el-row >
      <el-col :span="12">
        <ShowClassofProduct></ShowClassofProduct>
      </el-col>
      <el-col :span="12">
        <AddProduct></AddProduct>
      </el-col>
    </el-row>
    <ShowProduct></ShowProduct>
  </div>
</template>
  
<script>
import AddProduct from '@/components/Base/ProductEnter/AddProduct.vue'
import ShowProduct from '@/components/Base/ProductEnter/ShowProduct.vue'
import ShowClassofProduct from '@/components/Base/ProductEnter/ShowClassofProduct.vue'
export default {
  name: 'Vue-ProductEnter',
  props: {
  },
  components:{
    AddProduct,
    ShowProduct,
    ShowClassofProduct,
  },
  data() {
    return {

    }
  },
  methods: {
  }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
  
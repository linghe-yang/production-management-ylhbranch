<template>
  <div class="hello">
    <AddCustomer></AddCustomer>
    <ShowCustomer></ShowCustomer>
    


  </div>
</template>
  
<script>
import AddCustomer from '@/components/Base/CustomerEnter/AddCustomer.vue'
import ShowCustomer from '@/components/Base/CustomerEnter/ShowCustomer.vue'
export default {
  name: 'Vue-CustomerEnter',
  props: {
  },
  components:{
    AddCustomer,
    ShowCustomer
  },
  methods:{
  },
  data() {
    return {
      cusForm:{
        id:'',
        name:'',
        logo:'',
        phone:'',
        address:''
      }
    }

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
  
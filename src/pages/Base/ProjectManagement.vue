<template>
  <div class="hello">
    <AddProject></AddProject>
    <ShowProject></ShowProject>
  </div>
</template>
  
<script>
import AddProject from "@/components/Base/ProjectManagement/AddProject.vue"
import ShowProject from "@/components/Base/ProjectManagement/ShowProject.vue"
export default {
  name: 'Vue-ProjectManagement',
  props: {
    msg: String
  },
  components:{
    AddProject,
    ShowProject,
  },
  methods: {
    

  },
  data() {
    return {
     

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
  
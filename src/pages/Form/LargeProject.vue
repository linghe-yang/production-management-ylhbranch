<template>
  <div class="hello">
    <LargeProject>    
    </LargeProject>
  </div>
</template>

<script>
import LargeProject from '@/components/Form/LargeProject.vue'
export default {
  name: 'Vue-LargeProject',
  components:{
    LargeProject
  },
  props: {
    msg: String
  },
  data(){
    return{}
  },
  methods:{

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

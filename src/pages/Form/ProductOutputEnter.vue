<template>
  <div class="hello">
    <DealProductOutput>    
    </DealProductOutput>
  </div>
</template>

<script>
import DealProductOutput from '@/components/Form/ProductOutput.vue'
export default {
  name: 'Vue-ProductOutputEnter',
  components:{
    DealProductOutput
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

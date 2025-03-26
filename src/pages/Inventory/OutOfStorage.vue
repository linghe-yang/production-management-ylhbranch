<template>
  <div class="hello">
    <DealOutOfStorage>    
    </DealOutOfStorage>
  </div>
</template>

<script>
import DealOutOfStorage from '@/components/Inventory/OutOfStorage.vue'
export default {
  name: 'Vue-OutOfStorage',
  components:{
    DealOutOfStorage
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

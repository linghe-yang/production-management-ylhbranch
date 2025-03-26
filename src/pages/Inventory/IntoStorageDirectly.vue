<template>
  <div class="hello">
    <DealIntoStorageDirectly>    
    </DealIntoStorageDirectly>
  </div>
</template>

<script>
import DealIntoStorageDirectly from '@/components/Inventory/IntoStorageDirectly.vue'
export default {
  name: 'Vue-IntoStorageDirectly',
  components:{
    DealIntoStorageDirectly
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

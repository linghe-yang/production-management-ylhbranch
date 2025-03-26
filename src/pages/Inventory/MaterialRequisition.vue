<template>
  <div class="hello">
    <DealMaterialRequisition>    
    </DealMaterialRequisition>
  </div>
</template>

<script>
import DealMaterialRequisition from '@/components/Inventory/MaterialRequisition.vue'
export default {
  name: 'Vue-MaterialRequisition',
  components:{
    DealMaterialRequisition
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

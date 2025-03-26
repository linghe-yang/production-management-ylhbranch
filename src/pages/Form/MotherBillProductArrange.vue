<template>
  <div class="hello">
    <DealMotherBillArrage>    
    </DealMotherBillArrage>
  </div>
</template>

<script>
import DealMotherBillArrage from '@/components/Form/MotherBillArrageProduct.vue'
export default {
  name: 'Vue-MotherBillProductArrange',
  components:{
    DealMotherBillArrage
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

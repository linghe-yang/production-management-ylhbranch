<template>
  <div class="hello">
    <DealMotherBill>    
    </DealMotherBill>
  </div>
</template>

<script>
import DealMotherBill from '@/components/Form/MotherBill.vue'
export default {
  name: 'Vue-MotherBill',
  components:{
    DealMotherBill
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

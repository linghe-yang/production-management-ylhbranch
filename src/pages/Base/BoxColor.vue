<template>
  <div class="hello">
    <AddBoxColor></AddBoxColor>
    <ShowBoxColor></ShowBoxColor>

  </div>
</template>
  
<script>
import AddBoxColor from '@/components/Base/BoxColor/AddBoxColor.vue'
import ShowBoxColor from '@/components/Base/BoxColor/ShowBoxColor.vue'
export default {
  name: 'Vue-BoxColor',
  components:{
    AddBoxColor,
    ShowBoxColor
  },
  props: {
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },

  },
  data() {
    return {
      tableData: [{
        boxId: '0013',
        color: '',
      }, {
        boxId: '0014',
        color: '',
      }],
      formColor: {
        id: '',
        color: '',
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
  
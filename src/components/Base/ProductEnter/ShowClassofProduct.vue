<template>
    <div>
        <el-card class="box-card">
        <el-cascader-panel :options="options"></el-cascader-panel>
        <el-form :inline="true" :model="formInline" class="demo-form-inline" >
          <!-- <el-form-item> -->
            <!-- 嵌套修改和输入操作到按钮 -->
              <!-- <el-button >修改当前分类</el-button>
          </el-form-item>
          <el-form-item>
              <el-button >添加子分类</el-button>
          </el-form-item> -->
        </el-form>
    </el-card>
    </div>
</template>

<script>
export default {
    name:'Vue-ShowClassofProduct',
    props:{},
    data() {
        return {
            visibleEdit: 'false',
      visibleAdd: 'false',
      options: [{
        value: 'zhinan',
        label: '分类',
        children: [{
          value: '纸箱',
          label: '纸箱',
          children: [{
          }]
        }, {
          value: '包装膜',
          label: '包装膜',
          children: [{
          }]
        }, {
          value: '原料',
          label: '原料',
          children: [{

          }]
        }, {
          value: '管材管件',
          label: '管材管件',
          children: [{
          }]
        }]
      },
      ],
      currentOption: '',
      formInline: {
        user: '',
        region: ''
      },
     
        }
    }
}
</script>
<template>
  <el-upload
    ref="upload"
    name="file"
    action=""
    :limit="1"
    :before-upload="beforeUpload"
    :show-file-list="false"
  >
    <el-button slot="trigger" type="primary" plain
      ><slot></slot></el-button
    >
  </el-upload>
</template>
      
      <script>
import LuckyExcel from "luckyexcel";
export default {
  name: "Vue-InputExcel",
  methods: {
    beforeUpload(file) {
      const suffix = file.name.split(".");
      if (suffix[suffix.length - 1] !== "xlsx") {
        this.$message.error("文件格式只能是.xlsx");
        return false;
      }
      // eslint-disable-next-line no-undef
      LuckyExcel.transformExcelToLucky(file, (exportJson) => {
        if (!exportJson.sheets || exportJson.sheets.length === 0) {
          this.$message.warning("读取excel文件内容失败");
          return;
        }
        this.$emit('drawExcel',exportJson.sheets)
      });
    }
  },
};
</script>
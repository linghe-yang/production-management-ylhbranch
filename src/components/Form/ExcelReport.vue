<template>
  <div>
    <el-row>
      <slot></slot>
    </el-row>
    <iframe :src="src" width="100%" height="1200px" frameborder="0"></iframe>
  </div>
</template>
    
    <script>
export default {
  name: "Vue-ExcelReport",
  data() {
    return {
      src: `http://47.98.125.34:8087/jmreport/`,
    };
  },
  created() {
    this.getParams()
  },
  methods: {
    getParams() {
      let reportedFile = this.$route.query.reportedFile;
      this.src += reportedFile
      // this.reportedFile = reportedFile;
    },
  },
  watch: {
    $route: "getParams",
  },
};
</script>
    <style scoped>
</style>
<!-- <template>
  <div>
    <el-row :gutter="3">
      <el-col :span="4"
        ><slot></slot
        ></el-col
      >
      <el-col :span="4">
        <el-upload
          ref="upload"
          name="file"
          action=""
          :limit="1"
          :before-upload="beforeUpload"
          :show-file-list="false"
        >
          <el-button slot="trigger" type="primary" class="tool" plain
            >导入excel</el-button
          >
        </el-upload>
      </el-col>
      <el-col :span="4"
        ><el-button
          v-print="`#${printParam.id}`"
          type="primary"
          class="tool"
          plain
          @click="printFn(false)"
          >打印</el-button
        ></el-col
      >
      <el-col :span="4">
        <el-button
          v-print="`#${printParam.id}`"
          type="primary"
          class="tool"
          plain
          @click="printFn(true)"
          >打印选中区域</el-button
        ></el-col
      >
      <el-col :span="4"
        ><span>页边距（mm）：</span>
        <el-input-number
          v-model="printParam.printMargin"
          size="mini"
          controls-position="right"
          :min="0"
          :max="100"
          label="页边距"
        ></el-input-number>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" class="tool" plain @click="download"
          >导出</el-button
        ></el-col
      >
    </el-row>

    <div ref="canvas" :id="options.container" class="luckysheet-content"></div>
    <div
      :id="printParam.id"
      style="
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
      "
      :style="{ padding: printParam.printMargin + 'mm' }"
    />
  </div>
</template>
    
    <script>
import exportExcel from "@/utils/exportExcel.js";
import LuckyExcel from "luckyexcel";
import notice from "@/assets/productForm";
export default {
  name: "Vue-ExcelReport",
  props: {
    /* 编辑器的内容 */
    value: {
      type: String,
    },
    /* excel名称 */
    title: {
      type: String,
      default: "",
    },
    /* 只读 */
    readOnly: {
      type: Boolean,
      default: false,
    },
    printPosition: {
      default: "center",
      type: String,
    },
  },
  data() {
    return {
      luckysheet: null,
      options: {
        container: "luckysheet", //容器id名
        title: this.title, // 表 头名
        lang: "zh", // 中文
        showtoolbar: true, // 是否显示工具栏
        showinfobar: false, // 是否显示顶部信息栏
        showsheetbar: true, // 是否显示底部sheet按钮
        forceCalculation: true, //强制刷新公式
        showtoolbarConfig: {
          chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
          print: false,
          pivotTable: false,
        },
        
      },
      sheetParams: [
        {
          name: "sheet1",
          color: "",
          index: 1,
          status: 0,
          order: 1,
          celldata: notice.celldata,
          config: notice.config,
          showGridLines:"0"
        },
      ],
      printParam: {
        // 对应区域
        id: "print_html",
        printMargin: 0,
      },
    };
  },
  created() {},
  mounted() {
    var initData = this.value ? JSON.parse(this.value) : this.sheetParams;
    this.initLuckysheet(initData);
  },
  methods: {
    initLuckysheet(data) {
      // eslint-disable-next-line no-undef
      luckysheet.destroy();
      this.options.data = data;
      // eslint-disable-next-line no-undef
      luckysheet.create(this.options);
      var that = this;
      /*
          var d = this.luckysheet.getluckysheetfile()[0].data    
          console.log(this.luckysheet.transToCellData(d)) 

          console.log(this.luckysheet.getluckysheetfile()[0])
          */
      this.$refs.canvas.addEventListener("click", async function () {
        try {
          // eslint-disable-next-line no-undef
          const xml = await luckysheet.getluckysheetfile();
          that.$emit("input", JSON.stringify(xml));
        } catch (error) {
          that.$modal.msgError("实时保存失败" + error);
        }
      });

      // });
    },
    printFn(flag) {
      // eslint-disable-next-line no-undef
      const src = flag? luckysheet.getScreenshot(): luckysheet.getScreenshot({range:"A1:W18"});
      const $img = `<img src=${src} style="max-width: 100%;" />`;
      // let temp = document.querySelector(`#${this.options.container}`).innerHTML
      this.$nextTick(() => {
        document.querySelector(`#${this.printParam.id}`).innerHTML = $img;
      });
    },
    async exportExcel() {
      // eslint-disable-next-line no-undef
      const data = luckysheet.getluckysheetfile();
      const exportData = await exportExcel(data);
      const blob = new Blob([exportData]);
      const file = new File([blob], this.file?.name || "文档.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      return file;
    },
    async download() {
      const file = await this.exportExcel();
      if (window.navigator && window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(file, file.name);
      } else {
        const a = document.createElement("a");
        a.download = file.name;
        a.href = URL.createObjectURL(file);
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },
    beforeUpload(file) {
      const suffix = file.name.split(".");
      if (suffix[suffix.length - 1] !== "xlsx") {
        this.$message.error("文件格式只能是.xlsx");
        return false;
      }
      // eslint-disable-next-line no-undef
      luckysheet.destroy();
      // eslint-disable-next-line no-undef
      LuckyExcel.transformExcelToLucky(file, (exportJson) => {
        if (!exportJson.sheets || exportJson.sheets.length === 0) {
          this.$message.warning("读取excel文件内容失败");
          return;
        }
        this.initLuckysheet(exportJson.sheets);
      });
    },
  },
};
</script>
    <style lang="css" scoped>
.luckysheet-content {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: calc(100vh);
  left: 0px;
  top: 40px;
  bottom: 0px;
}
</style>
  
  <style media="print">
@page {
  size: auto; /* auto is the initial value */
  margin: 0mm; /* this affects the margin in the printer settings */
}
</style>


 -->

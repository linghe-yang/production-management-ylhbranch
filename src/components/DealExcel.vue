<template>
  <div>
    <div ref="canvas" :id="options.container" class="luckysheet-content" :style="{ height: height + 'px' }"></div>
    <slot></slot>
  </div>
</template>
      
<script>
import exportExcel from "@/utils/exportExcel.js";
// import LuckyExcel from "luckyexcel";
export default {
  name: "Vue-ExcelReport",
  props: {
    /* 编辑器的内容 */
    value: {
      type: Array,
    },
    /* excel名称 */
    title: {
      type: String,
      default: "excel",
    },
    height: {
      type: String,
      default: "480",
    },
  },
  data() {
    return {
      luckysheet: null,
      options: {
        container: this.title, //容器id名
        title: this.title, // 表 头名
        lang: "zh", // 中文
        showtoolbar: false, // 是否显示工具栏
        showinfobar: false, // 是否显示顶部信息栏
        //   rowHeaderWidth:0,
        // columnHeaderHeight:0,
        showsheetbar: true, // 是否显示底部sheet按钮
        forceCalculation: true, //强制刷新公式
        showtoolbarConfig: {
          chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
          print: false,
          pivotTable: false,
        },
        hook: {
          sheetActivate: this.sheetActivate,
          cellUpdated: this.cellUpdated,
          cellUpdateBefore: this.cellUpdateBefore,
          cellEditBefore: this.cellEditBefore,
        },
      },
      sheetParams: [
        {
          name: "sheet1",
          color: "",
          index: 1,
          status: 0,
          order: 1,
        },
      ],
    };
  },
  created() { },
  mounted() {
    var initData = this.value ? this.value : this.sheetParams;
    this.initLuckysheet(initData);
  },
  methods: {
    initLuckysheet(data) {
      try {
        // eslint-disable-next-line no-undef
        luckysheet.destroy();
      } catch (e) {
        e;
      }
      this.options.data = data;
      // eslint-disable-next-line no-undef
      luckysheet.create(this.options);
      var that = this;
      /*
        console.log(this.luckysheet.getluckysheetfile())
            var d = this.luckysheet.getluckysheetfile()[0].data
            console.log(this.luckysheet.transToCellData(d)) 
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
    async exportFile(filename) {
      // eslint-disable-next-line no-undef
      const data = luckysheet.getluckysheetfile();
      const exportData = await exportExcel(data);
      const blob = new Blob([exportData]);
      const file = new File([blob], this.file?.name || filename + ".xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      return file;
    },
    async download(filename = "文档") {
      const file = await this.exportFile(filename);
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
    //以下是API，可在父节点通过this.$ref.xxxx.调用

    /**
     * @param order:int 可选 要获取的sheet的order，默认当前sheet
     * @description 获取sheet的celldata数据 return [{r:int,c:int,v:object},...]
     */
    getSheetCelldata(order = null) {
      if (order !== null) {
        // eslint-disable-next-line no-undef
        return luckysheet.transToCellData(luckysheet.getSheetData(order));
      }
      // eslint-disable-next-line no-undef
      return luckysheet.transToCellData(luckysheet.getSheetData());
    },

    /**
     * @param order:int 可选 要获取的sheet的order，默认当前sheet
     * @description 获取sheet的表名
     */
    getSheetName(order = null) {
      if (order !== null) {
        // eslint-disable-next-line no-undef
        return luckysheet.getSheet({ order: order }).name;
      }
      // eslint-disable-next-line no-undef
      return luckysheet.getSheet().name;
    },

    /**
     * @param r:int 要获取的行标
     * @param begin_c:int 可选 起始列标，默认0
     * @param end_c:int 可选 终止列标，默认最后一列
     * @param order:int 可选 要获取的sheet的order，默认当前sheet
     * @description 获取sheet的一行return [{r:int,c:int,v:object},...]
     */
    getRow(r, begin_c = 0, end_c = -1, order = null) {
      let celldata = this.getSheetCelldata(order);
      if (end_c === -1 && begin_c === 0) {
        return celldata.filter((x) => x.r === r);
      } else if (end_c === -1) {
        return celldata.filter((x) => x.r === r && x.c >= begin_c);
      }
      return celldata.filter(
        (x) => x.r === r && x.c >= begin_c && x.c <= end_c
      );
    },

    /**
     * @param c:int 要获取的行标
     * @param begin_r:int 可选 起始行标，默认0
     * @param end_r:int 可选 终止行标，默认最后一行
     * @param order:int 可选 要获取的sheet的order，默认当前sheet
     * @description 获取sheet的一列return [{r:int,c:int,v:object},...]
     */
    getColumn(c, begin_r = 0, end_r = -1, order = null) {
      let celldata = this.getSheetCelldata(order);
      if (end_r === -1 && begin_r === 0) {
        return celldata.filter((x) => x.c === c);
      } else if (end_r === -1) {
        return celldata.filter((x) => x.c === c && x.r >= begin_r);
      }
      return celldata.filter(
        (x) => x.c === c && x.r >= begin_r && x.r <= end_r
      );
    },
    /**
     * @description 获取当前所有选区对应的row的array
     */
    getRangeRowArray() {
      let ranges = this.getRange();
      let rows = [];
      ranges.forEach((range) => {
        for (let i = range.row[0]; i <= range.row[1]; i++) {
          rows.push(i);
        }
      });
      return rows
    },

    /**
     * @param r:int 要上色的行的行标
     * @param begin_c:int 起始列标
     * @param end_c:int 终止列标
     * @param color:string 十六进制颜色，默认白色
     * @param order:int 可选 sheet的order，默认当前sheet
     * @description 为一行上色
     */
    colorRow(r, begin_c, end_c, color = "#ffffff", order = null) {
      for (let c = begin_c; c <= end_c; ++c) {
        let v = this.getCellValue(r, c, order);
        this.setCellValue(
          r,
          c,
          {
            ct: {
              fa: "General",
              t: "g",
            },
            bg: color,
            m: v,
            v: v,
          },
          order
        );
      }
    },

    exchangeRow(r1, r2, callback, order = null) {
      let celldata = this.getSheetCelldata(order);
      let row1 = celldata.filter((x) => x.r === r1);
      let row2 = celldata.filter((x) => x.r === r2);
      row1.forEach((e) => {
        this.setCellValue(r2, e.c, e.v, order);
      });
      row2.forEach((e) => {
        this.setCellValue(r1, e.c, e.v, order);
      });
      callback();
    },

    /**
     * @param order:int 可选 sheet的order，默认当前sheet
     * @param celldata:array 要替换的数据
     * @description 将sheet中对应的内容覆盖为celldata，不会清空celldata中没有的数据
     */
    draw(celldata, order = null) {
      celldata.forEach((e) => {
        this.setCellValue(e.r, e.c, e.v, order);
      });
    },

    /**
     * @param order:int 可选 sheet的order，默认当前sheet
     * @param newCelldata:array 可选 要替换的数据，默认为空
     * @description 将sheet的内容替换，不填newCelldata则为清空，不同于draw方法，它会先清空所有数据
     */
    replaceContent(newCelldata = null, order = null, callback = () => { }) {
      let oldCelldata = this.getSheetCelldata(order);
      oldCelldata.forEach((e) => {
        this.clearCellInstantly(e.r, e.c);
      });
      if (newCelldata != null) {
        newCelldata.forEach((e) => {
          this.setCellValue(e.r, e.c, e.v);
        });
      }
      callback()
    },

    /**
     * @description 在nextTick后设置单元格值，在某些场景会用到
     */
    setCellValueNextTick(r, c, v, order = null) {
      this.$nextTick(() => {
        this.setCellValue(r, c, v, order);
      });
    },

    /**
     * @param newSheets:array [{
          name: "sheet1",
          celldata:[...],
          config:{...},
          ...
        },...]
     * @description 将当前excel中的所有sheet替换为newSheets中的sheet
     */
    setNewSheets(newSheets) {
      // eslint-disable-next-line no-undef
      luckysheet.destroy();
      this.options.data = newSheets;
      // eslint-disable-next-line no-undef
      luckysheet.create(this.options);
      // eslint-disable-next-line no-undef
      // luckysheet.refresh()
    },
    //以下为原生API，可通过luckysheet的API文档查询作用
    getCellValue(r, c, order = null) {
      if (order !== null) {
        // eslint-disable-next-line no-undef
        return luckysheet.getCellValue(r, c, { order: order });
      }
      // eslint-disable-next-line no-undef
      return luckysheet.getCellValue(r, c);
    },
    getAllSheets() {
      // eslint-disable-next-line no-undef
      return luckysheet.getAllSheets();
    },
    setCellValue(r, c, v, order = null) {
      if (order !== null) {
        // eslint-disable-next-line no-undef
        luckysheet.setCellValue(r, c, v, { order: order });
      } else {
        // eslint-disable-next-line no-undef
        luckysheet.setCellValue(r, c, v);
      }
    },
    setSheetAdd(options) {
      // eslint-disable-next-line no-undef
      luckysheet.setSheetAdd(options);
    },
    setSheetDelete(options) {
      // eslint-disable-next-line no-undef
      luckysheet.setSheetDelete(options);
    },
    clearCell(row, column) {
      this.$nextTick(() => {
        // eslint-disable-next-line no-undef
        luckysheet.clearCell(row, column);
      });
    },
    clearCellInstantly(row, column) {
      // eslint-disable-next-line no-undef
      luckysheet.clearCell(row, column);
    },
    getRange() {
      // eslint-disable-next-line no-undef
      return luckysheet.getRange();
    },
    setRangeShow(range, func) {
      // eslint-disable-next-line no-undef
      luckysheet.setRangeShow(range);
      func()
    },
    clearRange(range = null) {
      if (range == null) {
        // eslint-disable-next-line no-undef
        luckysheet.clearRange();
      } else {
        // eslint-disable-next-line no-undef
        luckysheet.clearRange(range);
      }

    },
    deleteRow(rowStart, rowEnd) {
      // eslint-disable-next-line no-undef
      luckysheet.deleteRow(rowStart, rowEnd);
    },
    insertRow(row,num) {
      // eslint-disable-next-line no-undef
      luckysheet.insertRow(row,num);
    },
    //以下为钩子函数，触发使用
    sheetActivate() {
      this.$nextTick(() => {
        this.$emit(
          "sheetchange",
          // eslint-disable-next-line no-undef
          luckysheet.transToCellData(luckysheet.getSheetData())
        );
      });
    },
    cellUpdated(r, c, oldValue, newValue, isRefresh) {
      this.$emit("cellupdated", r, c, oldValue, newValue, isRefresh);
    },
    cellUpdateBefore(r, c, value, isRefresh) {
      this.$emit("cellupdatebefore", r, c, value, isRefresh);
    },
    /**单元格编辑模式进入前触发，可配合cellupdatebefore获取由用户编辑后的单元格 */
    cellEditBefore(range) {
      this.$emit("celleditbefore", range);
    },

  },
};
</script>
<style lang="css" scoped>
.luckysheet-content {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: calc(50vh);
  left: 0px;
  top: 40px;
  bottom: 0px;
}
</style>
    
<style media="print">
@page {
  size: auto;
  /* auto is the initial value */
  margin: 0mm;
  /* this affects the margin in the printer settings */
}
</style>
    <!--打印时添加的样式-->
    <!-- <style scoped media="print">
       /*避免出现空白尾页*/
       @page {
          /* size: auto;  */
          height: 98% !important;
          margin-left: 0px;
          margin-top: 0px;
          padding: 0px;
       }
    </style> -->
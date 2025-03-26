<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="根据母单安排生产计划" name="0">
        <MBA @recvData="drawQueryResult"> </MBA>
      </el-tab-pane>
      <!-- <el-tab-pane label="根据母单安排生产计划(查询)" name="second">
        <MBAQuery>
        </MBAQuery>
      </el-tab-pane> -->
    </el-tabs>
    <Excel v-loading="loading_excel" :value="storage[parseInt(activeName)]" ref="excel" height="650">
      <el-row>
        <el-col :span="18">
          <el-button @click="genProductNotice">生成生产通知单</el-button>
          <!-- <el-button>新增单据</el-button>
        <el-button>保存单据</el-button>
        <el-button>修改单据</el-button>
        <el-button>删除单据</el-button>
        <el-button>保存列宽</el-button> -->
        </el-col>
      </el-row>
    </Excel>
  </div>
</template>
  
<script>
import MBA from "./MotherBillProductArrange/MotherBillArrange.vue";
// import MBAQuery from "./MotherBillProductArrange/MotherBillArrangeQuery.vue"

import Excel from "@/components/DealExcel.vue";
// import util from "@/utils/util.js";
// import fomula from "@/utils/fomula.js";
import initSheets from "@/assets/initSheets";
const tags = ["序号",
  "型号",
  "长度",
  "宽度",
  "数量",
  "剪长度",
  "剪宽度",
  "计数",
  "备品",
  "总长度",
  "下单面积",
  "生产面积",
  "地块户型",
  "位置",
  "箱号"
]
export default {
  name: "Vue-DealMotherBillArrange",
  components: {
    MBA,
    // MBAQuery,

    Excel,
  },
  data() {
    return {
      activeName: "0",
      loading_excel: false,
      row0: initSheets.getTags(initSheets.getMotherBillArrangeSheet()),
      motherBills: [
        {
          date: new Date(),
          MBNum: "M0000",
          customerName: "张三",
          projectName: "项目1",
          organRequire: "整理要求1",
          orientation: "整理方向1",
          packDemand: "包装要求1",
          setNum: "10",
          houseType: "125",
        },
      ],
      storage: [[initSheets.getMotherBillArrangeSheet()]],
      message: null
    };
  },
  props: {},
  mounted() {
    const channelObj = new BroadcastChannel("motherBillArrange");
    // 发送消息
    channelObj.onmessage = (event) => {
      if (event.data == 'OK' && this.message != null) {
        channelObj.postMessage(this.message);
        this.message = null
      }
    };
  },
  methods: {
    // motherBillQuery(selectedData) {
    //   let that = this;
    //   let order_c = this.row0.indexOf("序号");
    //   let date_c = this.row0.indexOf("日期");
    //   let MBNum_c = this.row0.indexOf("母单号");
    //   let customerName_c = this.row0.indexOf("客户名");
    //   let projectName_c = this.row0.indexOf("项目名");
    //   let organRequire_c = this.row0.indexOf("整理要求");
    //   let orientation_c = this.row0.indexOf("整理方向");
    //   let packDemand_c = this.row0.indexOf("包装要求");
    //   let setNum_c = this.row0.indexOf("套数");
    //   let houseType_c = this.row0.indexOf("户型");
    //   function get_v(v) {
    //     return {
    //       ct: {
    //         fa: "General",
    //         t: "g",
    //       },
    //       m: v,
    //       v: v,
    //     };
    //   }
    //   function setSheetData(motherBills) {
    //     let newCelldata = initSheets.getMotherBillSheet().celldata;
    //     for (let r = 1; r <= motherBills.length; ++r) {
    //       newCelldata.push({ r: r, c: order_c, v: get_v(r) });
    //       if (motherBills[r - 1].date != null) {
    //         newCelldata.push({
    //           r: r,
    //           c: date_c,
    //           v: get_v(util.formatDate(motherBills[r - 1].date, "ymd")),
    //         });
    //       }
    //       if (motherBills[r - 1].MBNum != null) {
    //         newCelldata.push({
    //           r: r,
    //           c: MBNum_c,
    //           v: get_v(motherBills[r - 1].MBNum),
    //         });
    //       }
    //       if (motherBills[r - 1].customerName != null) {
    //         newCelldata.push({
    //           r: r,
    //           c: customerName_c,
    //           v: get_v(motherBills[r - 1].customerName),
    //         });
    //       }
    //       if (motherBills[r - 1].projectName != null) {
    //         newCelldata.push({
    //           r: r,
    //           c: projectName_c,
    //           v: get_v(motherBills[r - 1].projectName),
    //         });
    //       }
    //       if (motherBills[r - 1].organRequire != null) {
    //         newCelldata.push({
    //           r: r,
    //           c: organRequire_c,
    //           v: get_v(motherBills[r - 1].organRequire),
    //         });
    //       }
    //       if (motherBills[r - 1].orientation != null) {
    //         newCelldata.push({
    //           r: r,
    //           c: orientation_c,
    //           v: get_v(motherBills[r - 1].orientation),
    //         });
    //       }
    //       if (motherBills[r - 1].packDemand != null) {
    //         newCelldata.push({
    //           r: r,
    //           c: packDemand_c,
    //           v: get_v(motherBills[r - 1].packDemand),
    //         });
    //       }
    //       if (motherBills[r - 1].setNum != null) {
    //         newCelldata.push({
    //           r: r,
    //           c: setNum_c,
    //           v: get_v(motherBills[r - 1].setNum),
    //         });
    //       }
    //       if (motherBills[r - 1].houseType != null) {
    //         newCelldata.push({
    //           r: r,
    //           c: houseType_c,
    //           v: get_v(motherBills[r - 1].houseType),
    //         });
    //       }
    //     }
    //     that.$refs.excel.replaceContent(newCelldata);
    //   }
    //   if (selectedData.billNum !== null) {
    //     let motherBills = this.motherBills; //之后换成从后端查询到的
    //     setSheetData(motherBills);
    //   } else {
    //     let motherBills = this.motherBills; //之后换成从后端查询到的
    //     setSheetData(motherBills);
    //   }
    // },
    genProductNotice() {
      try {
        let rows = this.$refs.excel.getRangeRowArray();
        let order_c = 1;
        if (rows.length !== 1 || rows[0] == 0) {
          throw Error("请框选一项单据拉取");
        }
        if (!this.$refs.excel.getCellValue(Math.max(...rows), order_c)) {
          throw Error("选区超出界限");
        }
        if (rows.filter((x) => x == 0).length !== 0) {
          throw Error("请先框选要拉取的项");
        }
        this.$confirm("是否确认生成通知单?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {

            let mb_num = this.$refs.excel.getCellValue(rows[0], order_c);
            let p1 = this.$API.reqGetMotherBill({ mb_num: mb_num });
            let p2 = this.$API.reqGetReport({ work_num: mb_num, form_type: 1 });
            let promises = Promise.all([p1, p2]);
            promises.then((res) => {
              if (res[0].data.length == 1) {
                const {
                  customer_name,
                  house_type,
                  project_name,
                  set_num,
                  full_length,
                  piece_num,
                  organ_require,
                  full_area,
                  product_area,
                  pack_demand,
                  orientation,
                  full_piece_num,
                } = res[0].data[0];
                let now = new Date()
                let selectedData = {
                  contractNum: null,
                  date: now,
                  projectName: project_name+house_type+'户型',
                  workNum: null,
                  itemName: "毛细管网",
                  orderDate: now,
                  setNum: parseInt(set_num),
                  fullLength: full_length,
                  pieceNum: piece_num,
                  organRequire: organ_require,
                  fullPieceNum: full_piece_num,
                  fullArea: full_area,
                  productArea: product_area,
                  checkReportNum: null,
                  credentialNum: null,
                  receiptNum: null,
                  other: null,
                  packDemand: pack_demand,
                  orientation: orientation,
                  orderTime: now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds(),
                  customerName: customer_name,
                  expressCompany: null, //快递公司
                  expressNum: null, //单号
                };
                if (res[1].data.length != 0) {
                  let sh = initSheets.getNoticeEnterSheet();
                  res[1].data.forEach((e) => {
                    e.house_type = house_type;
                  });
                  sh.celldata.push(...this._setPulledSheet(res[1].data));
                  // sh.celldata.forEach(e => {
                  //   if (e.r !== 0 && e.c == tags.indexOf('数量') && !isNaN(parseInt(e.v.v))) {
 
                  //     e.v.v = parseInt(e.v.v) * selectedData.setNum
                  //     e.v.m = parseInt(e.v.m) * selectedData.setNum
                  //   }
                  // })
                  let message = {
                    selectedData: selectedData,
                    itemList: [sh],
                    isArrange: true
                  }
                  let routeUrl = this.$router.resolve({
                    path: "2-1"
                  });
                  window.open(routeUrl.href, "生产通知单");
                  /* 创建一个广播通道 */
                  this.message = message

                }
              }
            });
          })
          .catch(() => { });
      } catch (err) {
        this.$message.error(err);
      }
    },
    drawQueryResult(data) {
      let init = initSheets.getMotherBillArrangeSheet()
      init.row = data.length +1
      this.$refs.excel.setNewSheets([init])

      // this.$refs.excel.replaceContent(
      //   initSheets.getMotherBillArrangeSheet().celldata
      // );
      // data.forEach((e) => (e.enter_date = util.formatDate(e.enter_date, "all")));
      data.forEach((e, i) => {
        this.$refs.excel.setCellValue(i + 1, 0, e.enter_date);
        this.$refs.excel.setCellValue(i + 1, 1, e.mb_num);
        this.$refs.excel.setCellValue(i + 1, 2, e.customer_name);
        this.$refs.excel.setCellValue(i + 1, 3, e.project_name);
        this.$refs.excel.setCellValue(i + 1, 4, e.organ_require);
        this.$refs.excel.setCellValue(i + 1, 5, e.orientation);
        this.$refs.excel.setCellValue(i + 1, 6, e.pack_demand);
        this.$refs.excel.setCellValue(i + 1, 7, e.set_num);
        this.$refs.excel.setCellValue(i + 1, 8, e.house_type);
      });
    },
    _setPulledSheet(rows) {
      let celldata = [];
      var map = {
        com_order: "序号",
        type: "型号",
        length: "长度",
        width: "宽度",
        num: "数量",
        cut_length: "剪长度",
        cut_width: "剪宽度",
        count: "计数",
        spare: "备品",
        full_length: "总长度",
        order_area: "下单面积",
        product_area: "生产面积",
        house_type: "地块户型",
        position: "位置",
        box:"箱号"
      };
      rows.forEach((e) => {
        let r = parseInt(e.com_order);
        Object.keys(map).forEach((key) => {
          if (key in e) {
            if(key == 'order_area') e[key] = parseFloat(e[key]).toFixed(6);
            if(key == 'product_area') e[key] = parseFloat(e[key]).toFixed(6);
            celldata.push({
              r: r,
              c: tags.indexOf(map[key]),
              v: {
                ct: {
                  fa: "General",
                  t: "g",
                },
                m: e[key],
                v: e[key],
              },
            });
          }
        });
      });
      return celldata;
      // this.$refs.excel.draw(celldata);
      // this.sheetChange(this.$refs.excel.getSheetCelldata());
    },
  },
};
</script>
  
<style></style>
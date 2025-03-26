<template>
  <div>
    <el-row>
      <el-col :span="6"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            按项目名称查询
            <el-input
              size="mini"
              v-model="projectNameQuery"
              placeholder="请输入"
              style="width: 200px; margin-left: 30px"
            ></el-input>
            <el-button type="mini" @click="query"> 查询 </el-button>
          </span>
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="6"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            收货单位
            <el-input
              size="mini"
              v-model="selectedData.receiver"
              placeholder="请输入"
              style="width: 300px; margin-left: 30px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="5"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            项目名称
            <el-input
              size="mini"
              v-model="selectedData.projectName"
              placeholder="请输入"
              style="width: 200px; margin-left: 30px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="7"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            收货地址
            <el-input
              size="mini"
              v-model="selectedData.address"
              placeholder="请输入"
              style="width: 380px; margin-left: 30px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="3"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            收货人
            <el-input
              size="mini"
              v-model="selectedData.receiveObj"
              placeholder="请输入"
              style="width: 120px; margin-left: 30px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="3"
        ><div class="grid-content bg-purple">
          <span class="input-span">
            送货日期
            <el-date-picker
              v-model="selectedData.sendDate"
              type="date"
              size="mini"
              placeholder="选择时间"
              style="width: 140px; margin-left: 10px"
            >
            </el-date-picker>
          </span></div
      ></el-col>
    </el-row>
    <el-row>
      <!-- <el-col :span="3"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            <el-radio v-model="radio" label="1">生产单</el-radio>
            <el-radio v-model="radio" label="2">母单</el-radio>
          </span>
        </div></el-col
      > -->
      <el-col :span="4"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            单号
            <el-input
              size="mini"
              v-model="billNum"
              placeholder="请输入"
              style="width: 160px; margin-left: 30px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            套数
            <el-input
              size="mini"
              v-model="setNum"
              placeholder="请输入"
              style="width: 100px; margin-left: 30px"
              type="number"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            户型
            <el-input
              size="mini"
              v-model="houseType"
              placeholder="请输入"
              style="width: 160px; margin-left: 30px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            箱数
            <el-input
              size="mini"
              v-model="boxNum"
              placeholder="请输入"
              style="width: 100px; margin-left: 30px"
              type="number"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            <el-button size="mini" @click="addForm">添加</el-button>
          </span>
        </div></el-col
      >
      <el-button @click="save">保存单据</el-button>
      <el-button @click="generateBill" type="primary">生成excel单据</el-button>
    </el-row>

    <el-table :data="tableData" :border="true">
      <!-- <el-table-column prop="radio" label="单据类型" width="180">
      </el-table-column> -->

      <el-table-column prop="billNum" label="单号" width="180">
      </el-table-column>
      <el-table-column prop="setNum" label="套数" width="180">
      </el-table-column>
      <el-table-column prop="houseType" label="户型" width="180">
      </el-table-column>
      <el-table-column prop="boxNum" label="箱号" width="180">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="delClick(scope.$index)" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <Excel ref="excel" height="650">
      <!-- <InputExcel @drawExcel="drawExcel">导入Excel</InputExcel> -->
    </Excel>
  </div>
</template>
  
  <script>
import Excel from "@/components/DealExcel.vue";
// import InputExcel from "@/components/InputExcel.vue";
import initSheets from "@/assets/initSheets";
import util from "@/utils/util.js";

const blue = "#DDEBF7";
export default {
  name: "Vue-LargeProject",
  components: {
    Excel,
    // InputExcel,
  },
  props: {},
  data() {
    return {
      selectedData: {
        receiver: "",
        projectName: "",
        address: "",
        receiveObj: "",
        sendDate: new Date(),
      },
      // radio: "1",
      billNum: "",
      setNum: 1,
      houseType: "",
      boxNum: 1,
      tableData: [],
      projectNameQuery: "",
      // storage: []
    };
  },
  methods: {
    save() {
      try {
        if (this.selectedData.receiver == "") throw "收货单位不能为空";
        if (this.selectedData.projectName == "") throw "项目名称不能为空";
        if (this.selectedData.address == "") throw "收货地址不能为空";
        if (this.selectedData.receiveObj == "") throw "收货人不能为空";
        this.$API
          .reqEnterLargeProject({
            receiver: this.selectedData.receiver,
            project_name: this.selectedData.projectName,
            address: this.selectedData.address,
            receive_obj: this.selectedData.receiveObj,
          })
          .then((res) => {
            if ("code" in res && typeof res.code == "number") {
              this.$message.success("保存成功");
            } else {
              throw "保存失败";
            }
          });
      } catch (e) {
        this.$message.error(e);
      }
    },
    query() {
      if (this.projectNameQuery == "") {
        this.$message.error("请输入项目名称");
        return;
      }
      this.$API
        .reqGetLargeProject({ project_name: this.projectNameQuery })
        .then((res) => {
          if (typeof res.code == 'number' && res.data.length > 0 && "receiver" in res.data[0]) {
            this.selectedData.receiver = res.data[0].receiver;
            this.selectedData.projectName = res.data[0].project_name;
            this.selectedData.address = res.data[0].address;
            this.selectedData.receiveObj = res.data[0].receive_obj;
          }else{
            this.$message.error("找不到该项目")
          }
        });
    },
    drawExcel(sheet) {
      this.$refs.excel.setNewSheets(sheet);
    },
    addForm() {
      try {
        if (this.billNum == "") throw "单号不能为空";
        if (this.setNum <= 0) throw "套数不正确";
        if (this.houseType == "") throw "户型不能为空";
        if (this.boxNum <= 0) throw "箱数不正确";
        this.tableData.push({
          // radio: this.radio == "1" ? "生产单" : "母单",
          billNum: this.billNum,
          setNum: this.setNum,
          houseType: this.houseType,
          boxNum: this.boxNum,
        });
        // this.radio = "1";
        this.billNum = "";
        this.setNum = 1;
        this.houseType = "";
        this.boxNum = 1;
      } catch (e) {
        this.$message.error(e);
      }
    },
    delClick(index) {
      this.tableData.splice(index, 1);
    },
    generateBill() {
      this.$confirm("确认生成大项目签收单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let billNums = [...new Set(this.tableData.map((x) => x.billNum))];
          let res = await this.getReports(billNums);
          let transData = util.cloneDeep(this.selectedData);
          transData.sendDate = this.formatDate(this.selectedData.sendDate);
          let sheet = initSheets.getLargeProject(transData);
          // sheet.celldata = await this.addLines(sheet, res);
        //   let rowNum = Math.max(
        //   ...sheet.celldata.filter((x) => x.c == 0).map((x) => x.r)
        // );
        // this.$refs.excel.insertRow(0,rowNum)
          await this.addLines(sheet, res);
          this.$refs.excel.setNewSheets([sheet]);
        })
        .catch(() => {});
    },

    async addLines(sheet, res) {
      function to2Fraction(num){
        num = parseFloat(num).toFixed(2)
        return num
      }
      let r = 7;
      let totalNum = 0;
      let totalArea = 0.0;
      let totalBox = 0;
      // let sheet.celldata = util.cloneDeep(sheet.celldata);
      for (let i = 0; i < this.tableData.length; i++) {
        let t = this.tableData[i];

        let oneHouseTypeData = res.filter((x) =>
          x.work_num.startsWith(t.billNum)
        );

        oneHouseTypeData.forEach((row) => {
          sheet.celldata.push(
            ...this.getRowData(
              r++,
              "毛细管网",
              row.type,
              row.length,
              row.width,
              row.num,
              to2Fraction(row.order_area),
              row.position,
              t.houseType
            )
          );
        });
        let numSum = this.getNumSum(oneHouseTypeData);
        let areaSum = this.getAreaSum(oneHouseTypeData);
        sheet.celldata.push(
          ...this.getRowData(
            r++,
            "",
            "",
            "",
            "小计",
            numSum,
            to2Fraction(areaSum),
            "",
            "",
            blue
          )
        );
        totalNum += numSum * t.setNum;
        totalArea += areaSum * t.setNum;
        totalBox += parseInt(t.boxNum);
        sheet.celldata.push(
          ...this.getRowData(
            r++,
            "",
            "",
            t.setNum,
            "套合计",
            numSum * t.setNum,
            to2Fraction(areaSum * t.setNum),
            "",
            `共${t.boxNum}箱`,
            blue
          )
        );
      }
      sheet.celldata.push(
        ...this.getRowData(
          r++,
          "",
          "",
          "",
          "总计",
          totalNum,
          to2Fraction(totalArea),
          "",
          `共${totalBox}箱`,
          blue
        )
      );
      // sheet.celldata.push(
      //   ...this.getRowData(r++, "", "", "", "", "", "", "", ""),
      //   ...this.getRowData(r++, "", "", "", "", "", "", "", "")
      // );
      // sheet.celldata.push(
      //   ...this.getRowData(r++, "收货单位", "", "", "", "", "送货单位", "", ""),
      //   ...this.getRowData(
      //     r++,
      //     "及经手人（盖章）:",
      //     "",
      //     "",
      //     "",
      //     "",
      //     "及经手人（盖章）:",
      //     "",
      //     ""
      //   ),
      //   ...this.getRowData(
      //     r++,
      //     "日期：",
      //     "",
      //     "",
      //     "",
      //     "",
      //     "日期：",
      //     this.formatDate(this.selectedData.sendDate,'-'),
      //     ""
      //   )
      // );
    },
    getNumSum(data) {
      let sum = 0;
      data.forEach((r) => {
        sum += parseInt(r.num);
      });
      return sum;
    },
    getAreaSum(data) {
      let sum = 0.0;
      data.forEach((r) => {
        sum += parseFloat(r.order_area);
      });
      return sum
    },

    async getReports(billNums) {
      let promises = billNums.map((billNum) => {
        return this.$API.reqGetReport({ work_num: billNum, form_type: 1 });
      });
      let results = await Promise.all(promises);
      let res = results.reduce((acc, curr) => {
        return [...acc, ...curr.data];
      }, []);

      return res;
    },
    formatDate(date, type = "default") {
      const year = date.getFullYear(); // 获取年份
      const month = date.getMonth() + 1; // 获取月份 (注意：月份从 0 开始，因此要加 1)
      const day = date.getDate(); // 获取日期
      if (type === "default") return `${year}年${month}月${day}日`;
      else return `${year}${type}${month}${type}${day}`;
    },

    getRowData(r, b1, b2, b3, b4, b5, b6, b7, b8, bg = "#FFFFFF") {
      return [
        {
          r: r,
          c: 0,
          v: {
            ct: {
              fa: "@",
              t: "s",
            },
            bg: bg,
            fs: 11,
            fc: "#000000",
            ff: "黑体",
            ht: 0,
            tb: 1,
            v: b1,
            qp: 1,
            m: b1,
          },
        },
        {
          r: r,
          c: 1,
          v: {
            ct: {
              fa: "@",
              t: "s",
            },
            bg: bg,
            fs: 11,
            fc: "#000000",
            ff: "黑体",
            ht: 0,
            tb: 1,
            v: b2,
            qp: 1,
            m: b2,
          },
        },
        {
          r: r,
          c: 2,
          v: {
            ct: {
              fa: "@",
              t: "s",
            },
            bg: bg,
            fs: 11,
            fc: "#000000",
            ff: "黑体",
            ht: 0,
            tb: 1,
            v: b3,
            qp: 1,
            m: b3,
          },
        },
        {
          r: r,
          c: 3,
          v: {
            ct: {
              fa: "@",
              t: "s",
            },
            bg: bg,
            fs: 11,
            fc: "#000000",
            ff: "黑体",
            ht: 0,
            tb: 1,
            v: b4,
            qp: 1,
            m: b4,
          },
        },
        {
          r: r,
          c: 4,
          v: {
            ct: {
              fa: "@",
              t: "s",
            },
            bg: bg,
            fs: 11,
            fc: "#000000",
            ff: "黑体",
            ht: 0,
            tb: 1,
            v: b5,
            qp: 1,
            m: b5,
          },
        },
        {
          r: r,
          c: 5,
          v: {
            ct: {
              fa: "@",
              t: "s",
            },
            bg: bg,
            fs: 11,
            fc: "#000000",
            ff: "黑体",
            ht: 0,
            tb: 1,
            v: b6,
            qp: 1,
            m: b6,
          },
        },
        {
          r: r,
          c: 6,
          v: {
            ct: {
              fa: "@",
              t: "s",
            },
            bg: bg,
            fs: 11,
            fc: "#000000",
            ff: "黑体",
            ht: 0,
            tb: 1,
            v: b7,
            qp: 1,
            m: b7,
          },
        },
        {
          r: r,
          c: 7,
          v: {
            ct: {
              fa: "@",
              t: "s",
            },
            bg: bg,
            fs: 11,
            fc: "#000000",
            ff: "黑体",
            ht: 0,
            tb: 1,
            v: b8,
            qp: 1,
            m: b8,
          },
        },
      ];
    },
  },
};
</script>
  
  <style scoped>
.el-row {
  margin-bottom: 4px;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.input-span {
  display: flex;
  align-items: center;
  font-size: small;
}
</style>
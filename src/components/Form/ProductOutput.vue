<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="生产录入" name="0">
        <PE> </PE>
      </el-tab-pane>
      <el-tab-pane label="生产录入单查询" name="1">
        <PEQ ref="nq" @recvData="drawQueryResult"> </PEQ>
      </el-tab-pane>
      <el-tab-pane label="项目剩余待生产查询" name="2">
        <PRQ @recvData="drawRemainResult"> </PRQ>
      </el-tab-pane>
      <el-tab-pane label="备注查询" name="3">
        <POQ @recvData="drawOtherResult"> </POQ>
      </el-tab-pane>
    </el-tabs>
    <Excel
      @sheetchange="sheetChange"
      @cellupdatebefore="cellUpdateBefore"
      @celleditbefore="isEditing = true"
      :value="this.storage[0]"
      ref="excel"
      height="600"
    >
      <el-row v-if="activeName == '0'">
        <el-col :span="6">
          <el-button @click="add" plain type="primary"> 添加记录 </el-button>
          <el-button @click="save">保存单据</el-button>
        </el-col>
        <el-col :span="10">
          <el-button @click="delEditRecord">删除框选记录</el-button>
        </el-col>
      </el-row>

      <el-row v-if="activeName == '1'">
        <el-col :span="6">
          <el-button @click="deleteRecord">删除记录</el-button>
        </el-col>
        <el-col :span="10">
          <el-button @click="onDealPrint">打印单据</el-button>
        </el-col>
      </el-row>
      <el-row v-if="activeName == '3'">
        <el-col :span="10">
          <el-button @click="delOther">删除框选记录</el-button>
        </el-col>
      </el-row>
    </Excel>
    <el-drawer title="打印明细" :visible.sync="drawer" direction="btt">
      <el-row>
        <el-col :span="12"> 日工作量统计 </el-col>
        <el-col :span="12"> 员工月工作量统计 </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="grid-content">
            <span class="input-span">
              日期
              <el-date-picker
                v-model="report_date"
                type="date"
                size="mini"
                placeholder="选择时间"
                style="width: 140px; margin-left: 10px"
              >
              </el-date-picker>
            </span>
            <el-button @click="report(0)">报表</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <span class="input-span">
              月份
              <el-date-picker
                v-model="report_month"
                type="month"
                size="mini"
                placeholder="选择时间"
                style="width: 140px; margin-left: 10px"
              >
              </el-date-picker>
            </span>
            <el-button @click="report(1)">报表</el-button>
          </div>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>
  
<script>
import PE from "./ProductOutputEnter/ProductEnter.vue";
import PEQ from "./ProductOutputEnter/ProductEntryQuery.vue";
import PRQ from "./ProductOutputEnter/ProjectRemainQuery.vue";
import POQ from "./ProductOutputEnter/ProjectOtherQuery.vue";

import Excel from "@/components/DealExcel.vue";
import { mapState } from "vuex";
// import util from "@/utils/util";
import fomula from "@/utils/fomula";
import util from "@/utils/util";
import initSheets from "@/assets/initSheets";
// import InputExcel from "@/components/InputExcel.vue";
const map = {
  work_num: "单号",
  com_order: "序号",
  plan_date: "日期",
  staff_name: "操作人",
  staff_job: "岗位",
  box: "箱号",
  length: "长度",
  width: "宽度",
  num: "数量",
  spare: "备品",
  full_length: "总长度",
  order_area: "面积",
  product_area: "实际面积",
  id: "id(请勿做任何更改！！)",
  complete: "已生产套数",
  sheet_type: "原始单据",
};
const tags_map = {
  work_num: "单号",
  com_order: "序号",
  plan_date: "日期",
  staff_name: "操作人",
  staff_job: "岗位",
  box: "箱号",
  length: "长度",
  width: "宽度",
  count: "计数",
  num: "数量",
  spare: "备品",
  full_length: "总长度",
  order_area: "面积",
  product_area: "实际面积",
  id: "id(请勿做任何更改！！)",
  set_num: "已生产套数",
  total_set_num: "总套数",
  sheet_type: "原始单据",
};
const tags = [
  "单号",
  "序号",
  "日期",
  "操作人",
  "岗位",
  "箱号",
  "长度",
  "宽度",
  "数量",
  "备品",
  "总长度",
  "面积",
  "实际面积",
  "id(请勿做任何更改！！)",
  "已生产套数",
  "总套数",
  "原始单据",
];
export default {
  name: "Vue-DealProductOutput",
  components: {
    PE,
    PEQ,
    PRQ,
    POQ,
    // InputExcel,
    Excel,
  },
  computed: {
    ...mapState("module_productOutput", ["selectedData", "storage"]),
  },
  data() {
    return {
      drawer: false,
      isEditing: false,
      activeName: "0",
      report_date: new Date(),
      report_month: new Date(),
    };
  },
  watch: {
    activeName(newValue, oldValue) {
      // 当顶部tag切换时，将旧tag对应的excel中的sheet存到storage对应位置，以用在返回此tag时渲染，和报表时递交数据
      try {
        newValue = parseInt(newValue);
        oldValue = parseInt(oldValue);
        this.storage[oldValue] = this.$refs.excel.getAllSheets();
        if (this.storage[newValue] !== null) {
          this.$refs.excel.setNewSheets(this.storage[newValue]);
        }
      } catch (err) {
        this.$message.error(err);
      }
    },
  },
  mounted() {
    /* 创建一个广播通道 */
    const channelObj = new BroadcastChannel("productOutputChannel");

    // 监听消息事件
    channelObj.onmessage = (event) => {
      if (this.activeName !== "0") {
        this.activeName = "0";
        // this.setTimeout(() => {
        //   "wait";
        // }, 2000);
      }
      const newData = event.data;
      this.drawNewData(newData);
    };
  },
  props: {},
  methods: {
    cellUpdateBefore(r, c, value) {
      //当用户编辑单元格，更新前触发
      try {
        if (this.isEditing) {
          if (value == "") return;
          if (this.activeName !== "0") return;
          if (r == 0) {
            // 编辑的是0行，即标签行
            this.$refs.excel.setCellValueNextTick(r, c, tags[c]); // 还原为编辑前数据
            return;
          }

          // 如果编辑不是以上几种情况，将编辑的value写入celldata中，并调用 this.sheetChange以更新统计数据
          let celldata = this.$refs.excel.getSheetCelldata(); //这里得到的celldata是编辑前的celldata，因此必须有底下两步
          let cellEditing = celldata.find((x) => x.r == r && x.c == c);
          if (cellEditing === undefined) {
            celldata.push({
              r: r,
              c: c,
              v: {
                m: value,
                ct: {
                  fa: "General",
                  t: "g",
                },
                v: value,
              },
            });
          } else {
            cellEditing.v.v = value;
            cellEditing.v.m = value;
          }

          this._setComputedRow(r, () => {
            this.sheetChange(celldata);
          });
          this.isEditing = false;
        }
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.isEditing = false;
      }
    },
    sheetChange(celldata) {
      function sum(arr) {
        let sum = 0;
        arr.forEach((e) => {
          if (e.v.v != "") {
            sum += parseFloat(e.v.v);
          }
        });
        return sum;
      }
      celldata = celldata.filter((x) => x.r !== 0);
      let num_c = tags.indexOf("数量");
      let spare_c = tags.indexOf("备品");
      let fl_c = tags.indexOf("总长度");
      let a_c = tags.indexOf("面积");
      let pa_c = tags.indexOf("实际面积");
      // }
      this.selectedData.fullPiece = parseInt(
        sum(celldata.filter((x) => x.c == num_c))
      );
      // this.selectedData.fullPiece = fullPiece;
      this.selectedData.productPiece =
        this.selectedData.fullPiece -
        parseInt(sum(celldata.filter((x) => x.c == spare_c)));

      // this.selectedData.productPiece =
      //   parseInt(sum(celldata.filter((x) => x.c == num_c))) -
      //   parseInt(sum(celldata.filter((x) => x.c == spare_c)));

      this.selectedData.fullLength = parseInt(
        sum(celldata.filter((x) => x.c == fl_c))
      );

      this.selectedData.fullArea = parseFloat(
        sum(celldata.filter((x) => x.c == a_c))
      ).toFixed(6);
      this.selectedData.ProductArea = parseFloat(
        sum(celldata.filter((x) => x.c == pa_c))
      ).toFixed(6);
    },
    add() {
      let routeData = this.$router.resolve({
        path: "/itemEntry",
      });
      window.open(routeData.href, "生产量岗位录入");
    },
    delEditRecord() {
      try {
        let rows = this.$refs.excel.getRangeRowArray();
        if (rows[0] == 0) {
          throw Error("请框选要删除的记录");
        }
        rows.sort((a, b) => b - a);
        rows.forEach((e) => {
          this.$refs.excel.deleteRow(e, e);
        });
      } catch (err) {
        this.$message.error(err);
      }
    },
    delOther() {
      try {
        let rows = this.$refs.excel.getRangeRowArray();
        if (rows[0] == 0) {
          throw Error("请框选要删除的记录");
        }
        if (rows.length > 1) {
          throw Error("每次只能删除一条");
        }
        this.$confirm("是否确认删除框选的记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let row = rows[0];
            this.$API
              .reqDeleteOddjobs({
                date: this.$refs.excel.getCellValue(row, 0),
                stuff_name: this.$refs.excel.getCellValue(row, 1),
              })
              .then((res) => {
                if (res.code) {
                  this.$message.success("删除成功");
                  this.$refs.excel.deleteRow(row, row);
                }
              });
          })
          .catch(() => {});
      } catch (err) {
        this.$message.error(err);
      }
    },
    deleteRecord() {
      try {
        let rows = this.$refs.excel.getRangeRowArray();
        let work_num_c = tags.indexOf("单号");
        let com_order_c = tags.indexOf("序号");
        // let post_c = tags.indexOf("岗位");
        let complete_c = tags.indexOf("已生产套数");
        let sheet_type_c = tags.indexOf("原始单据");
        let id_c = tags.indexOf("id(请勿做任何更改！！)");
        if (rows[0] == 0) {
          throw Error("请框选要从数据库删除的记录");
        }
        if (
          !this.$refs.excel.getCellValue(
            Math.max(...rows),
            tags.indexOf("日期")
          )
        ) {
          throw Error("选区超出界限");
        }
        this.$confirm("是否确认删除框选的记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let wcs = [];
            let ids = [];
            rows.forEach((e) => {
              let work_num = this.$refs.excel.getCellValue(e, work_num_c);
              let com_order = this.$refs.excel.getCellValue(e, com_order_c);
              // let post = this.$refs.excel.getCellValue(e, post_c);
              let complete = parseInt(
                this.$refs.excel.getCellValue(e, complete_c)
              );
              let sheet_type = this.$refs.excel.getCellValue(e, sheet_type_c);
              // let postToNum = {
              //   打压: 2,
              //   整理: 3,
              //   焊接: 4,
              // };
              let sheetToNum = {
                正常: 2,
                降序: 3,
                减半片: 4,
              };
              let id = this.$refs.excel.getCellValue(e, id_c);
              if (work_num != "" && com_order != "") {
                wcs.push({
                  work_num: work_num,
                  com_order: com_order,
                  complete: -complete,
                  form_type: sheetToNum[sheet_type],
                });
                // if (postToNum[post] == 2) {
                //   wcs.push({
                //     work_num: work_num,
                //     com_order: com_order,
                //     complete: 0,
                //     form_type: 2,
                //   });
                // } else {
                //   wcs.push({
                //     work_num: work_num,
                //     com_order: com_order,
                //     complete: 0,
                //     form_type: 3,
                //   });
                //   wcs.push({
                //     work_num: work_num,
                //     com_order: com_order,
                //     complete: 0,
                //     form_type: 4,
                //   });
                // }
              }

              id = parseInt(id);
              if (!isNaN(id)) ids.push(id);
            });

            let promises = [
              this.$API.reqChangeItem(wcs),
              this.$API.reqDeleteOutput(ids),
            ];
            Promise.all(promises).then((res) => {
              if (res[0].code && res[1].code) {
                this.$message.success("删除成功");
                this.$refs.nq.query();
              } else {
                this.$message.error("删除失败");
              }
            });
          })
          .catch(() => {});
      } catch (err) {
        this.$message.error(err);
      }
    },
    _rewriteRows(celldata, max_row) {
      // let res = []
      let min = 1;
      for (let r = 1; r <= max_row; r++) {
        let row = celldata.filter((x) => x.r == r);
        if (row.length > 0) {
          row.forEach((e) => {
            e.r = min;
          });
          // res.push(...row)
          min++;
        }
      }
      return celldata;
    },
    drawExcel(sheet) {
      this.$refs.excel.setNewSheets(sheet);
    },
    drawNewData(newData) {
      try {
        let celldata = this.$refs.excel.getSheetCelldata();
        let row0 = celldata.filter((x) => x.r == 0);
        let datas = celldata.filter((x) => x.r != 0);
        let max_row = Math.max(...celldata.map((obj) => obj.r));
        newData.forEach((e) => {
          let length = parseInt(e.length);
          length = isNaN(length) ? 0 : length;
          e.full_length = fomula.fullLength(length);
          e.staff_name = e.staff_name.join(",");
        });
        let new_cd = this._transCelldata(newData, max_row);
        datas = datas.concat(new_cd);
        celldata = row0.concat(datas);
        this.$refs.excel.replaceContent(celldata);
        this.sheetChange(this.$refs.excel.getSheetCelldata());
      } catch (e) {
        console.error(e);
      }
    },
    _transCelldata(newData, max_row) {
      let celldata = [];
      let r = max_row + 1;
      newData.forEach((row) => {
        Object.keys(tags_map).forEach((key) => {
          let c = tags.indexOf(tags_map[key]);
          celldata.push({
            r: r,
            c: c,
            v: row[key],
          });
        });
        ++r;
      });
      return celldata;
    },
    _setComputedRow(r, callback) {
      //获取当前表单r行的 长度宽度数量备品的数据，计算出总长度下单面积生产面积 并绘制
      let len_c = tags.indexOf("长度");
      let wid_c = tags.indexOf("宽度");
      let num_c = tags.indexOf("数量");
      let spareNum_c = tags.indexOf("备品");
      this.$nextTick(() => {
        let len = parseInt(this.$refs.excel.getCellValue(r, len_c));
        let width = parseInt(this.$refs.excel.getCellValue(r, wid_c));
        let num = parseInt(this.$refs.excel.getCellValue(r, num_c));
        let spareNum = parseInt(this.$refs.excel.getCellValue(r, spareNum_c));
        if (isNaN(len)) len = 0;
        if (isNaN(width)) width = 0;
        if (isNaN(num)) num = 0;
        if (isNaN(spareNum)) spareNum = 0;
        let area = fomula.area(len, width);
        let fullLength = fomula.fullLength(len);
        let orderArea = area * num;
        let sparesArea = area * spareNum;
        let productArea = fomula.productArea(orderArea, sparesArea);
        let fulllen_c = tags.indexOf("总长度");
        let orderArea_c = tags.indexOf("面积");
        let productArea_c = tags.indexOf("实际面积");
        this.$refs.excel.setCellValue(r, fulllen_c, fullLength);
        this.$refs.excel.setCellValue(
          r,
          orderArea_c,
          Math.round(orderArea * 100) / 100
        );
        this.$refs.excel.setCellValue(
          r,
          productArea_c,
          Math.round(productArea * 100) / 100
        );
        callback();
      });
    },

    save() {
      try {
        this.$confirm("请检查是否有记录重复录入，系统不做甄别", "确定保存", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let celldata = this.$refs.excel.getSheetCelldata();
            if (this._sheetIsEmpty(celldata)) {
              this.$message.error("不能保存空表单");
              return;
            }
            celldata = celldata.filter((x) => x.r != 0);
            let max_row = Math.max(...celldata.map((obj) => obj.r));
            let data = this._transSaveData(celldata, max_row);
            let mes = data.map(({ id, ...rest }) => {
              id;
              return rest;
            });
            // let postToNum = {
            //   打压: 2,
            //   整理: 3,
            //   焊接: 4,
            // };
            let sheet_type = {
              正常: 2,
              降序: 3,
              减半片: 4,
            };
            let mes1 = data
              .filter((x) => x.work_num != "" && x.com_order != "")
              .map((x) => {
                return {
                  work_num: x.work_num,
                  com_order: x.com_order,
                  complete: parseInt(x.complete),
                  form_type: sheet_type[x.sheet_type],
                  cmd: "relative",
                };
              });
            this.$API.reqEnterOutput(mes).then((res) => {
              if (res.code == 200) {
                this.$API.reqChangeItem(mes1).then((r) => {
                  if (r.code == 200) {
                    this.$message.success("录入生产量成功");
                    this.$refs.excel.setNewSheets([
                      initSheets.getProductOutputSheet(),
                    ]);
                  } else {
                    this.$message.error("录入失败" + " error:" + r.code);
                  }
                });
              } else {
                this.$message.error("录入失败" + " error:" + res.code);
              }
            });
          })
          .catch(() => {});
      } catch (err) {
        this.$message.error(err);
      }
    },
    _transSaveData(celldata, max_row) {
      //除去标签行 r:0后的celldata
      let data = [];
      for (let r = 1; r <= max_row; r++) {
        let row = celldata.filter((x) => x.r == r);
        let obj = util.cloneDeep(map);
        Object.keys(map).forEach((key) => {
          let c = tags.indexOf(map[key]);
          let value = row.find((x) => x.c == c);
          if (value !== undefined) {
            if (value.v.v !== undefined) {
              if (map[key] == "日期") {
                if(value.v.m == '') obj[key] = util.formatDate(new Date(),'ymd')
                else obj[key] = value.v.m;
              } else {
                if (map[key] == "已生产套数") {
                  obj[key] = parseInt(value.v.v);
                } else {
                  obj[key] = value.v.v.toString();
                }
              }
            } else obj[key] = "";
          } else obj[key] = "";
        });
        data.push(obj);
      }
      return data;
    },
    _sheetIsEmpty(celldata) {
      //celldata是否是没有数据的表单
      if (celldata.filter((x) => x.r != 0).length === 0) {
        return true;
      }
      return false;
    },

    drawQueryResult(data) {
      let init = initSheets.getProductOutputSheet();
      init.row = data.length + 1;
      this.$refs.excel.setNewSheets([init]);

      if (data.length == 0) {
        this.$message.error("未找到数据");
        return;
      }

      // this.$refs.excel.replaceContent(
      //   initSheets.getProductOutputSheet().celldata
      // );
      if (data == null) return;

      // data.forEach((e) => (e.enter_date = util.formatDate(e.enter_date, "all")));
      data.sort((a, b) => {
        return a.plan_date < b.plan_date ? 1 : -1;
      });
      data.forEach((e, i) => {
        this.$refs.excel.setCellValue(i + 1, 0, e.work_num);
        this.$refs.excel.setCellValue(i + 1, 1, e.com_order);
        this.$refs.excel.setCellValue(i + 1, 2, e.plan_date);
        this.$refs.excel.setCellValue(i + 1, 3, e.staff_name);
        this.$refs.excel.setCellValue(i + 1, 4, e.staff_job);
        this.$refs.excel.setCellValue(i + 1, 5, e.box);
        this.$refs.excel.setCellValue(i + 1, 6, e.length);
        this.$refs.excel.setCellValue(i + 1, 7, e.width);
        this.$refs.excel.setCellValue(i + 1, 8, e.num);
        this.$refs.excel.setCellValue(i + 1, 9, e.spare);
        this.$refs.excel.setCellValue(i + 1, 10, e.full_length);
        this.$refs.excel.setCellValue(i + 1, 11, e.order_area);
        this.$refs.excel.setCellValue(i + 1, 12, e.product_area);
        this.$refs.excel.setCellValue(i + 1, 13, e.id);
        this.$refs.excel.setCellValue(i + 1, 14, e.complete);
        // this.$refs.excel.setCellValue(i + 1, 15, e.complete);
        this.$refs.excel.setCellValue(i + 1, 16, e.sheet_type);
      });
    },
    drawRemainResult(data, total_set_num) {
      if (data.length == 0) {
        this.$message.error("未找到数据");
        return;
      }
      let init = initSheets.getPOItemEntrySheet();
      init.row = data.length + 1;
      this.$refs.excel.setNewSheets([init]);

      // this.$refs.excel.replaceContent(
      //   initSheets.getPOItemEntrySheet().celldata
      // );
      if (data == null) return;
      data.sort((a, b) => {
        return a.plan_date < b.plan_date ? 1 : -1;
      });
      data.forEach((e, i) => {
        this.$refs.excel.setCellValue(i + 1, 0, e.work_num);
        this.$refs.excel.setCellValue(i + 1, 1, e.com_order);
        this.$refs.excel.setCellValue(i + 1, 2, e.box);
        this.$refs.excel.setCellValue(i + 1, 3, e.length);
        this.$refs.excel.setCellValue(i + 1, 4, e.width);
        this.$refs.excel.setCellValue(i + 1, 5, e.count);
        this.$refs.excel.setCellValue(i + 1, 6, e.num);
        this.$refs.excel.setCellValue(i + 1, 7, e.spare);
        this.$refs.excel.setCellValue(i + 1, 8, e.full_length);
        this.$refs.excel.setCellValue(i + 1, 9, e.order_area);
        this.$refs.excel.setCellValue(i + 1, 10, e.product_area);
        this.$refs.excel.setCellValue(i + 1, 11, e.id);
        this.$refs.excel.setCellValue(i + 1, 12, e.complete);
        if (e.box.toString() == "0") {
          this.$refs.excel.setCellValue(i + 1, 13, 1);
        } else {
          this.$refs.excel.setCellValue(i + 1, 13, total_set_num);
        }
      });
    },
    drawOtherResult(data) {
      if (data.length == 0) {
        this.$message.error("未找到数据");
        return;
      }
      let init = initSheets.getPOOther();
      init.row = data.length + 1;

      this.$refs.excel.setNewSheets([init]);

      // this.$refs.excel.replaceContent(initSheets.getPOOther().celldata);
      if (data == null) return;
      data.sort((a, b) => {
        return a.date < b.date ? 1 : -1;
      });
      data.forEach((e, i) => {
        this.$refs.excel.setCellValue(i + 1, 0, e.date);
        this.$refs.excel.setCellValue(i + 1, 1, e.stuff_name);
        this.$refs.excel.setCellValue(i + 1, 2, e.other);
      });
    },
    onDealPrint() {
      this.drawer = true;
    },
    report(e) {
      if (e == 1) {
        if (
          this.report_month == null ||
          this.selectedData.staff_name == "" ||
          this.selectedData.staff_name == null
        ) {
          this.$message.error("请选中操作人与月份");
          return;
        }
      } else if (e == 0) {
        if (this.report_date == null) {
          this.$message.error("请选中日期");
          return;
        }
      }
      this.$confirm("选则报表还是修改模板？", "确认报表", {
        distinguishCancelAndClose: true,
        confirmButtonText: "报表",
        cancelButtonText: "修改模板",
      })
        .then(() => {
          this._goToReport(e, "view/");
        })
        .catch((action) => {
          if (action === "cancel") {
            this._goToReport(e, "index/");
          }
        });
    },
    _goToReport(e, cmd) {
      let date = util.formatDate(this.report_date, "ymd");
      let month = util.formatDate(this.report_month, "ym");
      let name = this.selectedData.staff_name;

      let reportedFile = cmd;
      if (e == 0) {
        reportedFile += `967290761238757376?date=${date}`;
      } else if (e == 1) {
        reportedFile += `1019109609390424064?date=${month}&name=${name}`;
      }
      let routeData = this.$router.resolve({
        path: "/report",
        query: {
          reportedFile: reportedFile,
        },
      });
      window.open(routeData.href, "reportPage");
    },
  },
};
</script>
  
<style  scoped>
.input-span {
  display: flex;
  align-items: center;
  font-size: small;
}

.grid-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>



<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="母单录入" name="0">
        <MBEnter v-loading="loading_inputBox" @setnumchange="SetNumChange">
        </MBEnter>
      </el-tab-pane>
      <el-tab-pane label="母单查询" name="1">
        <MBQuery ref="nq" @recvData="drawQueryResult"> </MBQuery>
      </el-tab-pane>
    </el-tabs>
    <Excel
      v-loading="loading_excel"
      :value="storage[parseInt(activeName)]"
      ref="excel"
      height="560"
      @sheetchange="sheetChange"
      @cellupdatebefore="cellUpdateBefore"
      @celleditbefore="isEditing = true"
    >
      <el-row v-if="activeName == '0'">
        <el-col :span="6">
          <InputExcel @drawExcel="drawExcel">导入Excel</InputExcel>
        </el-col>
        <el-col :span="18">
          <!-- <el-button>新增单据</el-button> -->
          <el-button @click="deleteRow">删除行</el-button>
          <el-button @click="divideRow">拆分行</el-button>
          <el-button @click="save">保存单据</el-button>
          <el-button @click="boxSort">整理箱顺序</el-button>
          <el-button @click="divideBox">分箱</el-button>
          <el-button @click="deleteSheet">清空单据</el-button>
        </el-col>
      </el-row>
      <el-row v-if="activeName == '1'">
        <el-col :span="6">
          <InputExcel @drawExcel="drawExcel">导入Excel</InputExcel>
        </el-col>
        <el-col :span="18">
          <!-- <el-button>新增单据</el-button> -->
          <el-button @click="editBill">编辑母单</el-button>
          <el-button @click="deleteBill">删除母单</el-button>
          <!-- <el-button @click="showDetail">查看详情</el-button> -->
        </el-col>
      </el-row>
    </Excel>
    <el-dialog title="拆分行" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="新行的数量(用英文逗号隔开)" label-width="200px">
          <el-input v-model="newRowNums" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDivideRows">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
import MBEnter from "./MotherBill/MotherBillEnter.vue";
import MBQuery from "./MotherBill/MotherBillQuery.vue";
import InputExcel from "@/components/InputExcel.vue";
import Excel from "@/components/DealExcel.vue";

import util from "@/utils/util.js";
import fomula from "@/utils/fomula.js";
import initSheets from "@/assets/initSheets";
import { mapMutations, mapState } from "vuex";
// import { mapMutations, mapState } from "vuex";
export default {
  name: "Vue-DealMotherBill",
  components: {
    MBEnter,
    MBQuery,
    InputExcel,

    Excel,
  },
  data() {
    return {
      activeName: "0",
      loading_excel: false,
      loading_inputBox: false,
      isEditing: false,
      mbDetail: false,
      tags: initSheets.getTags(initSheets.getNoticeEnterSheet()),
      row0_1: initSheets.getTags(initSheets.getMotherBillSheet()),

      dialogFormVisible: false,
      newRowNums: "",
      dividingRow: null,
      boxMarks: [
        { mark: "0", color: "#fd9b9f" },
        { mark: "A", color: "#cdedfe" },
        { mark: "B", color: "#fed3e6" },
        { mark: "C", color: "#eafed3" },
        { mark: "D", color: "#feface" },
        { mark: "E", color: "#fdaeec" },
      ],

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
      storage: [
        [initSheets.getNoticeEnterSheet()],
        [initSheets.getMBQuerySheet()],
      ],
    };
  },
  props: {},
  mounted() {
    this.$API.reqGetAllBox().then((response) => {
      function customSort(a, b) {
        const idA = a.id.toUpperCase();
        const idB = b.id.toUpperCase();

        // 按照id的长度来比较，长度短的在前面
        if (idA.length !== idB.length) {
          return idA.length - idB.length;
        }

        // 长度相同时按照字母顺序比较
        return idA.localeCompare(idB);
      }
      let boxs = JSON.parse(JSON.stringify(response.data));
      if (boxs.length == 0) return;
      boxs.sort(customSort);
      if (boxs.length == 0) return;
      this.boxMarks = boxs.map((x) => {
        return {
          mark: x.id,
          color: x.color,
        };
      });
    });
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
        } else {
          this.$refs.excel.setNewSheets([initSheets.getNoticeEnterSheet()]);
        }
      } catch (err) {
        this.$message.error(err);
      }
    },
  },
  computed: {
    ...mapState("module_motherBillEnter", ["selectedData"]),
  },
  methods: {
    ...mapMutations("module_motherBillEnter", ["initselectedData"]),
    sheetChange(celldata) {
      //当excel中有数据发生变化时的回调
      this.loading_inputBox = true;
      try {
        // 更新统计数据
        let setDatas = util.getProductNoticeStatistics(celldata);
        this.selectedData.fullPieceNum =
          setDatas.fullPieceNum * this.selectedData.setNum;
        this.selectedData.pieceNum = setDatas.pieceNum;
        this.selectedData.fullArea =
          setDatas.fullArea * this.selectedData.setNum;
        this.selectedData.fullLength = setDatas.fullLength;
        this.selectedData.productArea = setDatas.productArea;
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.loading_inputBox = false;
      }
    },
    SetNumChange(mult) {
      let column = this.$refs.excel.getColumn(this.tags.indexOf("数量"), 1);
      let promises = [];
      column.forEach((e) => {
        let val = parseInt(e.v.v);
        if (!isNaN(val)) {
          this.$refs.excel.setCellValue(e.r, e.c, parseInt(val * mult));
          promises.push(this._setComputedRow(e.r));
        }
      });
      Promise.all(promises).then(() => {
        this.sheetChange(this.$refs.excel.getSheetCelldata());
      });
    },
    cellUpdateBefore(r, c, value) {
      try {
        if (this.isEditing) {
          if (r == 0) {
            this.$refs.excel.setCellValueNextTick(r, c, this.tags[c]);
            this.isEditing = false;
            return;
          }
          let celldata = this.$refs.excel.getSheetCelldata();
          let order_c = celldata
            .filter((x) => x.c == 0 && x.r !== 0)
            .map((x) => x.v.v);
          let maxRow = Math.max(...order_c);
          if (r > maxRow) {
            this.$refs.excel.clearCell(r, c);
            throw "编辑超出范围";
          }
          //如果用户编辑的是箱号，进行重新分箱处理
          let box_c = this.tags.indexOf("箱号");
          if (box_c === c && r !== 0) {
            try {
              this.boxMarkEdited(r, c, value);
            } finally {
              this.isEditing = false;
            }
            return;
          } else if (c === this.tags.indexOf("序号")) {
            //如果用户编辑的是序号，将交换两行内容
            if (util.isNumber(value)) {
              value = parseInt(value);
              if (value !== r) {
                this.$nextTick(() => {
                  this.$refs.excel.exchangeRow(
                    r,
                    value,
                    () => (this.isEditing = false)
                  );
                  this.$refs.excel.setCellValueNextTick(r, c, r);
                  this.$message({
                    message: "已交换两行内容",
                    type: "success",
                  });
                });
              }
            } else {
              // this.$message.error("请输入数字");
              this.$refs.excel.setCellValueNextTick(r, c, r);
              throw Error("请输入数字");
            }

            this.isEditing = false;
            return;
          }
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
          this._setComputedRow(r).then(() => {
            this.sheetChange(celldata);
          });
          this.isEditing = false;
        }
      } catch (err) {
        this.$message.error(err);
      }
    },
    async _setComputedRow(r) {
      await new Promise((resolve, reject) => {
        try {
          //获取当前表单r行的 长度宽度数量备品的数据，计算出总长度下单面积生产面积 并绘制
          let tags = this.tags;
          let len_c = tags.indexOf("长度");
          let wid_c = tags.indexOf("宽度");
          let num_c = tags.indexOf("数量");
          let spareNum_c = tags.indexOf("备品");
          this.$nextTick(() => {
            let len = parseInt(this.$refs.excel.getCellValue(r, len_c));
            let width = parseInt(this.$refs.excel.getCellValue(r, wid_c));
            let num = parseInt(this.$refs.excel.getCellValue(r, num_c));
            let spareNum = parseInt(
              this.$refs.excel.getCellValue(r, spareNum_c)
            );
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
            let orderArea_c = tags.indexOf("下单面积");
            let productArea_c = tags.indexOf("生产面积");
            this.$refs.excel.setCellValue(r, fulllen_c, fullLength);
            this.$refs.excel.setCellValue(r, orderArea_c, orderArea.toFixed(6));
            this.$refs.excel.setCellValue(
              r,
              productArea_c,
              productArea.toFixed(6)
            );
            resolve();
          });
        } catch (e) {
          reject(e);
        }
      });
    },
    drawExcel(sheets) {
      if (sheets.length) {
        sheets = [sheets[0]];
      } else {
        return;
      }

      this.loading_excel = true;
      this.loading_inputBox = true;
      try {
        this.storage[0] = [initSheets.getNoticeEnterSheet()];
        let tags = initSheets.getTags(initSheets.getNoticeEnterSheet());
        for (let sheet of sheets) {
          if (sheet.celldata && sheet.celldata.length != 0) {
            this.$refs.excel.setNewSheets(this.storage[0]);
            // this.addSheet();
            let data = {
              celldata: [],
            };
            for (let cell of sheet.celldata) {
              if (cell.v.v == null) {
                data.celldata.push({
                  r: cell.r,
                  c: cell.c,
                  v: {
                    ct: cell.v.ct,
                  },
                });
              } else {
                data.celldata.push({
                  r: cell.r,
                  c: cell.c,
                  v: {
                    m: cell.v.v,
                    ct: {
                      fa: "General",
                      t: "g",
                    },
                    v: cell.v.v,
                  },
                });
              }
            }
            let labels = [
              "序号",
              "型号",
              "长",
              "宽",
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
              "箱号",
            ];
            let regs = util.generateFullRegExp(labels); //获取第0行标签的正则表达式数组
            let row0 = data.celldata.filter((x) => x.r == 0); //导入excel的第一行（tags）
            let cellsToDraw = [];
            row0.forEach((item, index) => {
              let str = JSON.stringify(item);
              try {
                regs.forEach((reg, c) => {
                  if (reg.test(str)) {
                    let col_cells = data.celldata
                      .filter((x) => x.c == index)
                      .sort((a, b) => a.r - b.r);
                    col_cells.splice(0, 1);
                    col_cells.forEach((x) => (x.c = c));
                    cellsToDraw.push(...col_cells);
                    throw Error();
                  }
                });
              } catch (e) {
                e;
              }
            });
            let order_c = this.tags.indexOf("序号");
            let max_num = cellsToDraw.filter((x) => x.c == order_c).length;

            let areas = this._area(max_num, tags, cellsToDraw);

            let nums = util.getColumnDataArray(
              max_num,
              this.tags.indexOf("数量"),
              cellsToDraw
            );
            let sparesNums = util.getColumnDataArray(
              max_num,
              this.tags.indexOf("备品"),
              cellsToDraw
            );
            let orderArea = this._orderArea(nums, areas);
            let sparesArea = this._sparesArea(sparesNums, areas);
            let productArea = orderArea.map((a, i) =>
              fomula.productArea(a, sparesArea[i])
            );
            let col_orderArea = tags.indexOf("下单面积");
            let col_productArea = tags.indexOf("生产面积");
            orderArea.forEach((item, r) => {
              cellsToDraw.push({ r: r + 1, c: col_orderArea, v: item });
            });
            productArea.forEach((item, r) => {
              cellsToDraw.push({ r: r + 1, c: col_productArea, v: item });
            });
            let fullLength = this._fullLength(max_num, tags, cellsToDraw);
            let col_fullLength = tags.indexOf("总长度");
            fullLength.forEach((item, r) => {
              cellsToDraw.push({ r: r + 1, c: col_fullLength, v: item });
            });
            this.$refs.excel.draw(cellsToDraw);
            this.sheetChange(this.$refs.excel.getSheetCelldata());
          }
        }
      } catch (e) {
        this.$message.error("导入失败，请检查文件内容格式");
      } finally {
        this.loading_excel = false;
        this.loading_inputBox = false;
      }
    },
    _area(max_num, tags, cellsToDraw) {
      let lens = new Array(max_num).fill(0);
      let wids = new Array(max_num).fill(0);
      let len_c = tags.indexOf("长度");
      let wid_c = tags.indexOf("宽度");

      cellsToDraw
        .filter((x) => x.c == len_c)
        .forEach((e) => {
          let num = parseFloat(e.v.v);
          if (isNaN(num)) num = 0;
          lens[e.r - 1] = num;
        });
      cellsToDraw
        .filter((x) => x.c == wid_c)
        .forEach((e) => {
          let num = parseFloat(e.v.v);
          if (isNaN(num)) num = 0;
          wids[e.r - 1] = num;
        });

      // let lens = cellsToDraw
      //   .filter((x) => x[0] == len_c)
      //   .map((x) => x[1].map((y) => parseInt(y)))[0];
      // let wids = cellsToDraw
      //   .filter((x) => x[0] == wid_c)
      //   .map((x) => x[1].map((y) => parseInt(y)))[0];

      let areas = lens.map((a, i) => fomula.area(a, wids[i]));
      return areas;
    },
    _orderArea(nums, areas) {
      if (nums == undefined) {
        return areas.map(() => 0);
      }
      let orderArea = areas.map((a, i) => a * nums[i]);
      return orderArea;
    },
    _sparesArea(sparesNums, areas) {
      if (sparesNums == undefined) {
        return areas.map(() => 0);
      }
      let sparesArea = areas.map((a, i) => a * sparesNums[i]);
      return sparesArea;
    },
    _fullLength(max_num, tags, cellsToDraw) {
      let len_c = tags.indexOf("长度");
      let arr = new Array(max_num).fill(0);
      cellsToDraw
        .filter((x) => x.c == len_c)
        .forEach((e) => {
          let num = parseInt(e.v.v);
          if (isNaN(num)) num = 0;
          arr[e.r - 1] = fomula.fullLength(num);
        });
      return arr;
    },
    deleteSheet() {
      this.$confirm("是否删除当前表单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // this.storage = [null, null, null, null, null];
          this.$refs.excel.replaceContent(
            initSheets.getNoticeEnterSheet().celldata
          );
          this.initselectedData();
        })
        .catch(() => {});
    },
    divideBox() {
      try {
        let celldata = this.$refs.excel.getSheetCelldata();
        if (this._sheetIsEmpty(celldata)) {
          throw Error("当前表格为空，请先导入excel数据");
          // this.$message.error("当前表格为空，请先导入excel数据");
          // return;
        }
        this.$confirm("是否分箱处理?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let row0 = this.tags;
            let box_c = row0.indexOf("箱号");
            let dataRows = this._packRow(celldata);
            let boxs = this._divideByNumOrArea(row0, dataRows);

            this.$confirm("是否宽度降序排列?", "提示", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning",
            })
              .then(() => {
                // this._drawDivideBox(boxs, box_c);

                let width_c = row0.indexOf("宽度");
                let length_c = row0.indexOf("长度");
                let zeroBox = {
                  index: 0,
                  numSum: 0,
                  areaSum: 0,
                  rows: [],
                };

                boxs.forEach((box) => {
                  box.rows.forEach((row, index) => {
                    let width = parseInt(row.find((x) => x.c === width_c).v.v);
                    if (width < 1000) {
                      let thisrow = row;
                      zeroBox.rows.push(thisrow);
                      box.rows[index] = null;
                    }
                  });
                  box.rows = box.rows.filter((x) => x !== null);
                });
                zeroBox.rows.sort((a, b) => {
                  let aw = parseInt(a.find((x) => x.c === width_c).v.v);
                  let bw = parseInt(b.find((x) => x.c === width_c).v.v);
                  let al = parseInt(a.find((x) => x.c === length_c).v.v);
                  let bl = parseInt(b.find((x) => x.c === length_c).v.v);

                  if (aw > bw) return -1;
                  if (aw < bw) return 1;
                  if (al < bl) return -1;
                  if (al > bl) return 1;
                  return 0;
                });
                if (zeroBox.rows.length > 0) {
                  boxs.unshift(zeroBox);
                }
                let init = this._setBoxData(boxs, box_c);
                this.$refs.excel.setNewSheets([init]);
              })
              .catch(() => {
                // this._drawDivideBox(boxs, box_c);
                let init = this._setBoxData(boxs, box_c);
                this.$refs.excel.setNewSheets([init]);
              });
          })
          .catch(() => {});
      } catch (err) {
        this.$message.error(err);
      }
    },
    boxMarkEdited(box_r, box_c, value) {
      try {
        if (!util.isBoxMark(value)) {
          this.$refs.excel.clearCell(box_r, box_c);
          throw Error("箱号只能是0或英文字符");
        }
        else {
          value = value.toUpperCase();
          this.$refs.excel.setCellValueNextTick(box_r, box_c, value);
          this.isEditing = false;
          let box = this.boxMarks.find((x) => x.mark == value);
          if (box == undefined) throw "无该箱的颜色信息";
          this.$refs.excel.colorRow(box_r, 0, box_c, box.color);
        }
      } catch (err) {
        this.$message.error(err);
      }

      // try {
      //   if (!util.isBoxMark(value)) {
      //     this.$refs.excel.clearCell(box_r, box_c);
      //     throw Error("箱号只能是0或英文字符");
      //     // this.$message.error("箱号只能是0或英文字符");
      //     // this.$refs.excel.clearCell(box_r, box_c);
      //     // return;
      //   }
      //   // else if (!(this.activeName == "2" || this.activeName == "3")) {
      //   //   // this.$message.error("请勿在此表单编辑箱号");
      //   //   this.$refs.excel.clearCell(box_r, box_c);
      //   //   throw Error("请在分箱表单中编辑箱号");
      //   // }
      //   else {
      //     value = value.toUpperCase();
      //   }
      //   let celldata = this.$refs.excel.getSheetCelldata();
      //   let dataRows = this._packRow(celldata).sort((a, b) => a.r - b.r);
      //   if (dataRows.length < box_r) {
      //     // this.$message.error("请在数据行编辑箱号");
      //     this.$refs.excel.clearCell(box_r, box_c);
      //     throw Error("请在数据行编辑箱号");
      //   }
      //   this.loading_excel = true;

      //   let changingCell = dataRows[box_r - 1].rowdata.find(
      //     (x) => x.c === box_c
      //   );
      //   if (changingCell === undefined) {
      //     dataRows[box_r - 1].rowdata.push({
      //       r: box_r,
      //       c: box_c,
      //       v: {
      //         ct: {
      //           fa: "General",
      //           t: "g",
      //         },
      //         m: value,
      //         v: value,
      //       },
      //     });
      //   } else {
      //     changingCell.v.v = value;
      //     changingCell.v.m = value;
      //   }
      //   let boxs = this._divideByBoxMark(box_c, dataRows, value);
      //   this.$nextTick(() => {
      //     this._drawEditedBox(boxs, box_c);
      //     this.loading_excel = false;
      //   });
      // } catch (err) {
      //   this.$message.error(err);
      // }
    },
    boxSort() {
      try {
        let origin = this.$refs.excel.getSheetCelldata();
        let newCelldatas = origin.filter((x) => x.r == 0);
        newCelldatas.push(...this.getBoxSortCelldata(origin));
        this.$refs.excel.replaceContent(newCelldatas);
        this.$message.success("整理完成");
      } catch (e) {
        this.$message.error(e);
      }
    },
    getBoxSortCelldata(celldata) {
      let rowNum = Math.max(
        ...celldata.filter((x) => x.c == 0).map((x) => x.r)
      );
      let rows = [];
      let box_c = this.tags.indexOf("箱号");
      for (let r = 1; r <= rowNum; ++r) {
        let rowdata = celldata.filter((x) => x.r === r);
        rows.push(rowdata);
      }
      let order = this.boxMarks.map((x) => x.mark);
      const indexMap = new Map(order.map((value, index) => [value, index]));
      const rowsSorted = rows.slice().sort((a, b) => {
        let am = a.find((x) => x.c == box_c);
        let bm = b.find((x) => x.c == box_c);
        if (am == undefined || bm == undefined) throw "有数据未分配箱号";
        if (typeof am.v.v != "string" || typeof bm.v.v != "string")
          throw "有数据未分配箱号";
        const indexA = indexMap.has(am.v.v) ? indexMap.get(am.v.v) : Infinity;
        const indexB = indexMap.has(bm.v.v) ? indexMap.get(bm.v.v) : Infinity;
        return indexA - indexB;
      });
      // let maxRow = rowsSorted.length
      rowsSorted.forEach((row, r) => {
        row.forEach((c) => {
          if (c.c == 0) {
            c.v.v = r + 1;
            c.v.m = (r + 1).toString();
          }
          c.r = r + 1;
        });
      });
      let res = [];
      rowsSorted.forEach((row) => {
        res.push(...row);
      });
      return res;
    },
    _divideByNumOrArea(row0, dataRows) {
      let num_c = row0.indexOf("数量");
      let productArea_c = row0.indexOf("生产面积");
      let boxIndex = 1;
      let boxs = [
        {
          index: boxIndex,
          numSum: 0,
          areaSum: 0,
          rows: [],
        },
      ];
      dataRows = dataRows.sort((a, b) => a.r - b.r);
      for (let i = 0; i < dataRows.length; ++i) {
        let num = parseInt(dataRows[i].rowdata.find((x) => x.c === num_c).v.v);
        let productArea = parseFloat(
          dataRows[i].rowdata.find((x) => x.c === productArea_c).v.v
        );
        let flag = true;
        for (let box of boxs) {
          if (box.numSum + num <= 20 && box.areaSum + productArea <= 50) {
            box.rows.push(dataRows[i].rowdata);
            box.numSum += num;
            box.areaSum += productArea;
            flag = false;
            break;
          }
        }
        if (flag) {
          boxs.push({
            index: ++boxIndex,
            numSum: 0,
            areaSum: 0,
            rows: [],
          });
          let box = boxs[boxs.length - 1];
          if (box.numSum + num <= 20 && box.areaSum + productArea <= 50) {
            box.rows.push(dataRows[i].rowdata);
            box.numSum += num;
            box.areaSum += productArea;
          }
        }
      }
      return boxs;
    },
    _divideByBoxMark(box_c, dataRows) {
      let boxMarks = dataRows
        .map((x) => {
          let m = x.rowdata.find((y) => y.c === box_c);
          if (m !== undefined && m.v.v !== null) return m.v.v.toString();
          else return "";
        })
        .filter((x) => x !== "");

      let marks = Array.from(new Set(boxMarks)).sort();
      let boxs = [];
      marks.forEach((e) => {
        this.boxMarks.forEach((b, j) => {
          if (b.mark === e) {
            boxs.push({
              index: j,
              rows: [],
            });
          }
        });
      });
      let noBox = {
        rows: [],
      };
      dataRows.forEach((e) => {
        let cell = e.rowdata.find((y) => y.c === box_c);
        let mark = cell === undefined ? "" : cell.v.v;
        let flag = true;
        try {
          boxs.forEach((b) => {
            if (this.boxMarks[b.index].mark == mark) {
              b.rows.push(e.rowdata);
              flag = false;
              throw Error();
            }
          });
        } catch (err) {
          err;
        }

        if (flag) noBox.rows.push(e.rowdata);
      });
      if (noBox.rows.length !== 0) boxs.push(noBox);
      return boxs;
    },
    _drawEditedBox(boxs, box_c) {
      let r = 1;
      let order_c = this.tags.indexOf("序号");
      boxs.forEach((box) => {
        box.rows.forEach((row) => {
          this.$refs.excel.setCellValue(r, order_c, {
            ct: {
              fa: "General",
              t: "g",
            },
            m: r,
            v: r,
          });
          row.forEach((e) => {
            this.$refs.excel.setCellValue(r, e.c, e.v);
          });
          if (box.index != undefined) {
            this.$refs.excel.colorRow(
              r,
              order_c,
              box_c,
              this.boxMarks[box.index].color
            );
          } else {
            this.$refs.excel.colorRow(r, order_c, box_c);
          }

          ++r;
        });
      });
    },
    _setBoxData(boxs, box_c) {
      let init = initSheets.getNoticeEnterSheet(
        this.$refs.excel.getSheetName()
      );
      let order_c = this.tags.indexOf("序号");

      let r = 1;
      boxs.forEach((box) => {
        box.rows.forEach((row) => {
          init.celldata.push({
            r: r,
            c: order_c,
            v: {
              ct: {
                fa: "General",
                t: "g",
              },
              m: r,
              v: r,
            },
          });
          row.forEach((e) => {
            init.celldata.push({ r: r, c: e.c, v: e.v });
          });
          init.celldata.push({
            r: r,
            c: box_c,
            v: {
              ct: {
                fa: "General",
                t: "g",
              },
              m: this.boxMarks[box.index].mark.toString(),
              v: this.boxMarks[box.index].mark.toString(),
            },
          });
          for (let c = 0; c <= box_c; ++c) {
            let cell = init.celldata.find((x) => x.r == r && x.c == c);
            if (cell === undefined) {
              init.celldata.push({
                r: r,
                c: c,
                v: {
                  bg: this.boxMarks[box.index].color,
                },
              });
            } else {
              cell.v.bg = this.boxMarks[box.index].color;
            }
          }
          ++r;
        });
      });
      return init;
    },
    _setPulledBoxData(boxs, box_c) {
      //将分好箱后的数据填入this.storage对应位置
      let init = initSheets.getNoticeEnterSheet(
        this.$refs.excel.getSheetName()
      );
      let order_c = this.tags.indexOf("序号");

      let r = 1;
      boxs.forEach((box) => {
        box.rows.forEach((row) => {
          init.celldata.push({
            r: r,
            c: order_c,
            v: {
              ct: {
                fa: "General",
                t: "g",
              },
              m: r,
              v: r,
            },
          });
          row.forEach((e) => {
            init.celldata.push({ r: r, c: e.c, v: e.v });
          });
          if (box.index != undefined) {
            init.celldata.push({
              r: r,
              c: box_c,
              v: {
                ct: {
                  fa: "General",
                  t: "g",
                },
                m: this.boxMarks[box.index].mark.toString(),
                v: this.boxMarks[box.index].mark.toString(),
              },
            });
            for (let c = 0; c <= box_c; ++c) {
              let cell = init.celldata.find((x) => x.r == r && x.c == c);
              if (cell === undefined) {
                init.celldata.push({
                  r: r,
                  c: c,
                  v: {
                    bg: this.boxMarks[box.index].color,
                  },
                });
              } else {
                cell.v.bg = this.boxMarks[box.index].color;
              }
            }
          }

          ++r;
        });
      });
      return init;
    },
    _packRow(celldata) {
      let rowNum = Math.max(...celldata.map((x) => x.r));
      let result = [];
      for (let r = 1; r <= rowNum; ++r) {
        let rowdata = celldata.filter((x) => x.r === r && x.c !== 0); // 除去"序号"这一列
        result.push({ r: r, rowdata: rowdata });
      }
      return result;
    },
    _sheetIsEmpty(celldata) {
      if (celldata.filter((x) => x.r != 0).length === 0) {
        return true;
      } else {
        let order_c = this.tags.indexOf("序号");
        if (celldata.filter((x) => x.r != 0 && x.c == order_c).length === 0) {
          return true;
        }
        return false;
      }
    },
    drawQueryResult(data) {
      if(data.length == 0){
        this.$message.error('未找到数据')
        return
      }
      let init = initSheets.getMBQuerySheet()
      init.row = data.length +1
      this.$refs.excel.setNewSheets([init])

      // this.$refs.excel.replaceContent(initSheets.getMBQuerySheet().celldata);
      data.forEach((e, i) => {
        this.$refs.excel.setCellValue(i + 1, 0, e.mb_num);
        this.$refs.excel.setCellValue(i + 1, 1, e.enter_date);
        this.$refs.excel.setCellValue(i + 1, 2, e.house_type);
        this.$refs.excel.setCellValue(i + 1, 3, e.set_num);
        this.$refs.excel.setCellValue(i + 1, 4, e.project_name);
        this.$refs.excel.setCellValue(i + 1, 5, e.customer_name);
      });
    },
    deleteBill() {
      try {
        let rows = this.$refs.excel.getRangeRowArray();
        let order_c = 0;
        if (rows.length !== 1 || rows[0] == 0) {
          throw Error("请框选一项单据删除");
        }
        if (!this.$refs.excel.getCellValue(Math.max(...rows), order_c)) {
          throw Error("选区超出界限");
        }
        if (rows.filter((x) => x == 0).length !== 0) {
          throw Error("请先框选要删除的项");
        }
        this.$confirm("是否确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let mb_num = this.$refs.excel.getCellValue(rows[0], order_c);
            let promises = [
              this.$API.reqDelMotherBill({ mb_num: mb_num }),
              this.$API.reqDeleteReport({ work_num: mb_num }),
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
    editBill() {
      try {
        let rows = this.$refs.excel.getRangeRowArray();
        let order_c = 0;
        if (rows.length !== 1 || rows[0] == 0) {
          throw Error("请框选一项单据拉取");
        }
        if (!this.$refs.excel.getCellValue(Math.max(...rows), order_c)) {
          throw Error("选区超出界限");
        }
        if (rows.filter((x) => x == 0).length !== 0) {
          throw Error("请先框选要拉取的项");
        }
        this.$confirm("是否确认拉取?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let mb_num = this.$refs.excel.getCellValue(rows[0], order_c);
            this.$API.reqGetMotherBill({ mb_num: mb_num }).then((res) => {
              if (res.data != null) {
                const {
                  mb_num,
                  enter_date,
                  customer_name,
                  house_type,
                  notice_num,
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
                } = res.data[0];
                let selectedData = {
                  MBNum: mb_num,
                  date: new Date(enter_date),
                  customerName: customer_name,
                  houseType: house_type,
                  noticeNum: notice_num,
                  projectName: project_name,
                  setNum: set_num,
                  fullLength: full_length,
                  pieceNum: piece_num,
                  organRequire: organ_require,
                  fullArea: full_area,
                  productArea: product_area,
                  packDemand: pack_demand,
                  orientation: orientation,
                  fullPieceNum: full_piece_num,
                };
                this.$store.state.module_motherBillEnter.selectedData =
                  selectedData;
              }
            });
            let row0 = this.tags;
            let box_c = row0.indexOf("箱号");
            this.$API
              .reqGetReport({ work_num: mb_num, form_type: 1 })
              .then((res) => {
                let sh = initSheets.getNoticeEnterSheet();
                if (res.data.length != 0) {
                  sh.celldata.push(...this._setPulledSheet(res.data));
                  let dataRows = this._packRow(sh.celldata);
                  let boxs = this._divideByBoxMark(box_c, dataRows);
                  let init = this._setPulledBoxData(boxs, box_c);
                  this.storage[0] = [init];
                  this.activeName = "0";
                }
              });
          })
          .catch(() => {});
      } catch (err) {
        this.$message.error(err);
      }
    },
    showDetail() {
      try {
        let rows = this.$refs.excel.getRangeRowArray();
        if (rows.length !== 1) throw Error("请框选1行记录");
        if (rows[0] == 0) throw Error("请选择数据行");
        //根据所选数据行的对应的id从数据库获取相应的零件表
        let sheet = initSheets.getNoticeEnterSheet();
        this.$refs.excel.setSheetAdd({
          sheetObject: sheet,
        });
      } catch (err) {
        this.$message.error(err);
      }
    },

    save() {
      try {
        this.$confirm("确定保存", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let celldata = this.$refs.excel.getSheetCelldata();
            let maxRow = celldata.filter(
              (x) => x.c === 0 && util.isNumber(x.v.v)
            ).length;
            let maxColumn = this.tags.length - 1;
            let normal = [];
            let data = celldata.filter(
              (x) => x.r <= maxRow && x.c <= maxColumn
            );
            if (!this._sheetIsEmpty(data)) {
              let box_c = this.tags.indexOf("箱号");
              let box_col = celldata.filter((x) => x.c == box_c && x.r !== 0);
              if (box_col.length != 0 && typeof box_col[0].v.v == "string"){
                let newCelldatas = celldata.filter((x) => x.r == 0);
                newCelldatas.push(...this.getBoxSortCelldata(celldata));
                normal = this._divideReportBox(newCelldatas, maxRow, 1);
              }else{
                normal = this._divideReportBox(data, maxRow, 1);
              }
              
            }
            if (normal == []) {
              throw Error("请导入excel数据");
            }
            if (
              this.selectedData.MBNum == null ||
              this.selectedData.MBNum == ""
            )
              throw "请输入母单号";

            const {
              MBNum,
              date,
              customerName,
              houseType,
              noticeNum,
              projectName,
              setNum,
              fullLength,
              pieceNum,
              organRequire,
              fullArea,
              productArea,
              packDemand,
              orientation,
              fullPieceNum,
            } = this.selectedData;
            let formHead = {
              mb_num: MBNum,
              enter_date: util.formatDate(date, "ymd"),
              customer_name: customerName,
              house_type: houseType,
              notice_num: noticeNum,
              project_name: projectName,
              set_num: setNum,
              full_length: fullLength,
              piece_num: pieceNum,
              organ_require: organRequire,
              full_area: fullArea,
              product_area: productArea,
              pack_demand: packDemand,
              orientation: orientation,
              full_piece_num: fullPieceNum,
            };
            let p1 = this.$API.reqEnterMotherBill(
              JSON.parse(JSON.stringify(formHead))
            );
            let p2 = this.$API.reqEnterReport(normal);
            // this.setReportExcelData();
            let promises = Promise.all([p1, p2]);
            promises.then(() => {
              this.$message.success("保存成功");
            });
          })
          .catch((err) => {
            this.$message.error(err);
          });
      } catch (err) {
        this.$message.error(err);
      }
    },
    _divideReportBox(celldata, maxRow, type) {
      function cellValue(c, r) {
        let cell = celldata.find((x) => x.c == c && x.r == r);
        if (cell === undefined || !("v" in cell.v)) return "";
        else {
          if (cell.v.v == null) return "";
          else return cell.v.v.toString();
        }
      }
      let rows = [];
      for (let r = 1; r <= maxRow; ++r) {
        let box_cell = celldata.find(
          (x) => x.c == this.tags.indexOf("箱号") && x.r == r
        );
        let mark;
        if (box_cell === undefined) {
          mark = "";
        } else {
          if (box_cell.v.v !== undefined) {
            if (box_cell.v.v == null) mark = "";
            else mark = box_cell.v.v.toString();
          } else {
            mark = "";
          }
        }

        let row = {
          com_order: cellValue(this.tags.indexOf("序号"), r),
          type: cellValue(this.tags.indexOf("型号"), r),
          length: cellValue(this.tags.indexOf("长度"), r),
          width: cellValue(this.tags.indexOf("宽度"), r),
          num: cellValue(this.tags.indexOf("数量"), r),
          cut_length: cellValue(this.tags.indexOf("剪长度"), r),
          cut_width: cellValue(this.tags.indexOf("剪宽度"), r),
          count: cellValue(this.tags.indexOf("计数"), r),
          spare: cellValue(this.tags.indexOf("备品"), r),
          full_length: cellValue(this.tags.indexOf("总长度"), r),
          order_area: cellValue(this.tags.indexOf("下单面积"), r),
          product_area: cellValue(this.tags.indexOf("生产面积"), r),
          house_type: cellValue(this.tags.indexOf("户型"), r),
          position: cellValue(this.tags.indexOf("位置"), r),
          box: mark,
          work_num: this.selectedData.MBNum,
          form_type: type,
          complete: 0,
        };
        rows.push(row);
      }

      return rows;
    },
    _setPulledSheet(rows) {
      let celldata = [];
      let tags = this.tags;
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
        box: "箱号",
      };
      rows.forEach((e) => {
        let r = parseInt(e.com_order);
        Object.keys(map).forEach((key) => {
          if (key in e) {
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
    deleteRow() {
      try {
        let rows = this.$refs.excel.getRangeRowArray();
        let order_c = this.tags.indexOf("序号");
        if (!this.$refs.excel.getCellValue(Math.max(...rows), order_c)) {
          throw Error("选区超出界限");
        }
        if (rows.filter((x) => x == 0).length !== 0) {
          throw Error("选区超出界限");
        }
        this.$confirm("确认删除行？", "", {
          distinguishCancelAndClose: true,
          confirmButtonText: "删除",
          cancelButtonText: "取消",
        })
          .then(() => {
            rows.sort((a, b) => b - a);
            rows.forEach((e) => {
              this.$refs.excel.deleteRow(e, e);
            });
            let orders = this.$refs.excel.getColumn(
              this.tags.indexOf("序号"),
              1
            );
            orders.forEach((e, i) => {
              this.$refs.excel.setCellValue(
                i + 1,
                this.tags.indexOf("序号"),
                e.r
              );
            });
            this.sheetChange(this.$refs.excel.getSheetCelldata());
          })
          .catch(() => {});
      } catch (err) {
        this.$message.error(err);
      }
    },
    divideRow() {
      try {
        let rows = this.$refs.excel.getRangeRowArray();
        let order_c = this.tags.indexOf("序号");
        if (rows.length !== 1) {
          throw Error("请选择一行数据");
        }
        if (!this.$refs.excel.getCellValue(Math.max(...rows), order_c)) {
          throw Error("选区超出界限");
        }
        if (rows.filter((x) => x == 0).length !== 0) {
          throw Error("选区超出界限");
        }
        this.dialogFormVisible = true;
        this.dividingRow = rows[0];
      } catch (err) {
        this.$message.error(err);
      }
    },
    confirmDivideRows() {
      try {
        this.dialogFormVisible = false;
        const parts = this.newRowNums.split(",");
        if (parts.every((part) => /^\d+$/.test(part))) {
          let num_c = this.tags.indexOf("数量");
          let l_c = this.tags.indexOf("长度");
          let w_c = this.tags.indexOf("宽度");
          let s_c = this.tags.indexOf("备品");
          let oa_c = this.tags.indexOf("下单面积");
          let pa_c = this.tags.indexOf("生产面积");
          let nums = parts.map(Number);
          let celldata = this.$refs.excel.getSheetCelldata();
          let old_row = celldata.filter((x) => x.r == this.dividingRow);
          let len = parseInt(old_row.find((x) => x.c == l_c).v.v);
          let width = parseInt(old_row.find((x) => x.c == w_c).v.v);
          let area = fomula.area(len, width);

          let spare = old_row.find((x) => x.c == s_c);
          if (spare !== undefined) {
            let tar = parseInt(spare.v.v);
            if (isNaN(tar)) spare = 0;
            else {
              spare = tar;
            }
          } else {
            spare = 0;
          }

          let former = celldata.filter((x) => x.r < this.dividingRow);
          let new_rows = [];
          let later = celldata.filter((x) => x.r > this.dividingRow);
          later.forEach((e) => {
            e.r += nums.length - 1;
            if (e.c == 0) {
              e.v.v = parseInt(e.v.v) + nums.length - 1;
              e.v.m = parseInt(e.v.m) + nums.length - 1;
            }
          });
          nums.forEach((n, i) => {
            let temp = util.cloneDeep(old_row);
            temp.forEach((e) => {
              e.r += i;
              if (e.c == 0) {
                e.v.v = parseInt(e.v.v) + i;
                e.v.m = parseInt(e.v.m) + i;
              } else if (e.c == num_c) {
                e.v.v = n.toString();
                e.v.m = n.toString();
              } else if (e.c == oa_c) {
                let orderArea = (area * n).toFixed(6);
                e.v.v = orderArea.toString();
                e.v.m = orderArea.toString();
              } else if (e.c == pa_c) {
                let orderArea = area * n;
                let sparesArea = area * spare;
                let productArea = (orderArea - sparesArea).toFixed(6);

                e.v.v = productArea.toString();
                e.v.m = productArea.toString();
              }
            });
            new_rows.push(...temp);
          });
          let newCelldata = [...former, ...new_rows, ...later];
          this.$refs.excel.replaceContent(newCelldata);
          this.sheetChange(newCelldata);
        } else {
          throw "输入格式有误";
        }
      } catch (err) {
        this.$message.error(err);
      }
    },
  },
};
</script>
  
<style></style>
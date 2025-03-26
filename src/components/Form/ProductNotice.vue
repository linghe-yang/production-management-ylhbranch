<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="通知单录入" name="0">
        <NoticeEnter v-loading="loading_inputBox" @setnumchange="SetNumChange">
        </NoticeEnter>
      </el-tab-pane>
      <el-tab-pane label="生产单查询" name="1">
        <NoticeQuery ref="nq" @recvData="drawQueryResult"></NoticeQuery>
      </el-tab-pane>
      <el-tab-pane label="正常分箱结果" name="2"></el-tab-pane>
      <el-tab-pane label="宽度降序结果" name="3"></el-tab-pane>
      <el-tab-pane label="减半片结果" name="4"></el-tab-pane>
    </el-tabs>
    <Excel
        v-loading="loading_excel"
        :value="storage[parseInt(activeName)]"
        ref="excel"
        @sheetchange="sheetChange"
        @cellupdatebefore="cellUpdateBefore"
        @celleditbefore="isEditing = true"
    >
      <el-row v-if="activeName === '0'">
        <el-col :span="4">
          <InputExcel @drawExcel="drawExcel">导入Excel</InputExcel>
        </el-col>
        <el-col :span="4">
          <el-button @click="save">保存单据</el-button>
        </el-col>
        <el-col :span="12">
          <!-- <el-button @click="addSheet">新增单据</el-button> -->
          <el-button @click="deleteRow">删除行</el-button>
          <el-button @click="divideRow">拆分行</el-button>
          <el-button @click="boxSort">整理箱顺序</el-button>
          <el-button @click="divideBox">分箱处理</el-button>
          <el-button @click="cleanSheet">清空单据</el-button>
          <!-- <el-button disabled>生成标签</el-button> -->
          <!-- <el-button @click="report">报表</el-button> -->
          <!-- <router-link  tag="a" target="_blank" to="/report">打印预览</router-link> -->
          <!-- <el-button disabled>装箱单</el-button>
          <el-button disabled>保存列宽</el-button> -->
        </el-col>
      </el-row>
      <el-row v-if="activeName === '1'">
        <el-col :span="18">
          <el-button type="danger" @click="deleteSheet">删除选中单据</el-button>
          <el-button @click="pullSheet">拉取单据</el-button>
          <el-button @click="reportNotice">报表</el-button>
          <el-button @click="cleanSheet">清空列表</el-button>
        </el-col>
      </el-row>
      <el-row v-if="activeName === '2'">
        <el-col :span="18">
          <el-button @click="boxSort">整理箱顺序</el-button>
          <el-button @click="widthDesc">宽度降序处理</el-button>
          <el-button @click="cleanSheet">清空列表</el-button>
        </el-col>
      </el-row>
      <el-row v-if="activeName !== '0'">
        <!-- <el-col :span="6"><el-button @click="exportExcel">导出excel</el-button>
        </el-col> -->

        <el-col :span="18" v-if="activeName === '3' || activeName === '4'">
          <el-button @click="boxSort">整理箱顺序</el-button>
          <el-button @click="cutHalfPiece">减半片</el-button>
          <el-button @click="cleanSheet">清空列表</el-button>
        </el-col>
      </el-row>
    </Excel>
    <el-drawer :title="drawTitle" :visible.sync="showDrawer" direction="btt">
      <CutHalf
          v-if="drawTitle == '剪半片处理'"
          :rows="selectedRows"
          ref="cuthalf"
          @confirmcutting="confirmCutting"
      ></CutHalf>
      <div v-if="drawTitle == '报表'">
        <el-row>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="confirmReport(0)">未分箱生产单</el-button>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="confirmReport(1)">正常分箱生产单</el-button>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="confirmReport(2)">降序排列生产单</el-button>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="confirmReport(3)">剪半片生产单</el-button>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="confirmReport(4)">货物明细</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="confirmReport(5)">生产单装箱单</el-button>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="confirmReport(6)">打压检测</el-button>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="confirmReport(7)">签回单</el-button>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="confirmReport(8)">最终检测记录</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="confirmReport(9)">标签(不含位置)</el-button>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="confirmReport(10)">标签(含位置)</el-button>
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="confirmReport(11)"
              >标签2列(不含位置)
              </el-button
              >
            </div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content">
              <el-button @click="confirmReport(12)">标签2列(含位置)</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
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
import NoticeEnter from "./ProductionNotice/NoticeEnter.vue";
import NoticeQuery from "./ProductionNotice/NoticeQuery.vue";
import Excel from "@/components/DealExcel.vue";
import InputExcel from "@/components/InputExcel.vue";
import CutHalf from "@/components/Form/ProductionNotice/CutHalf.vue";

import util from "@/utils/util.js";
import fomula from "@/utils/fomula.js";
import initSheets from "@/assets/initSheets";
import {mapMutations, mapState} from "vuex";

export default {
  name: "Vue-DealProductNotice",
  components: {
    NoticeEnter,
    NoticeQuery,

    Excel,
    InputExcel,
    CutHalf,
  },
  data() {
    return {
      loading_excel: false,
      loading_inputBox: false,
      activeName: "0",

      showDrawer: false,
      drawTitle: null,

      selectedRows: null,
      cutHalfColor: "#fbf927",

      isEditing: false,
      tags: initSheets.getTags(initSheets.getNoticeEnterSheet()),
      dialogFormVisible: false,
      newRowNums: "",
      dividingRow: null,
      boxMarks: [],
    };
  },

  watch: {
    $route: "getParams",
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
  props: {},
  computed: {
    ...mapState("module_noticeEnter", ["selectedData", "storage"]),
  },
  mounted() {
    this._setBoxMarksData().then(() => {
      const channelObj = new BroadcastChannel("motherBillArrange");
      channelObj.postMessage("OK");
      channelObj.onmessage = (event) => {
        const newData = event.data;
        if (newData == "OK") return;
        if (newData && newData.isArrange != null && newData.isArrange) {
          // if (this.boxMarks == []) {
          //   this._setBoxMarksData();
          // }
          this.setSelectedData(newData.selectedData);

          let box_c = this.tags.indexOf("箱号");
          let celldata = util.cloneDeep(newData.itemList[0].celldata);
          let boxMarksCol = celldata.filter((x) => x.r != 0 && x.c == box_c);
          if (boxMarksCol.length != 0) {
            let flag = true;
            try {
              boxMarksCol.forEach((e) => {
                if (e.v.v == "") {
                  flag = false;
                  throw "endLoop";
                }
              });
            } catch (e) {
              e;
            }
            if (flag) {
              // let row0 = this.tags;
              let dataRows = this._packRow(celldata);
              let boxs = this._divideByBoxMark(box_c, dataRows);
              let init = this._setBoxData(boxs, box_c);
              this.setStorage({index: 0, data: [init]});
              this.setStorage({index: 2, data: [init]});
            } else {
              this.setStorage({index: 0, data: newData.itemList});
            }
          } else {
            this.setStorage({index: 0, data: newData.itemList});
          }
          // newData.itemList[0].celldata = newData.itemList[0].celldata.filter(
          //   (x) => !(x.r !== 0 && x.c == box_c)
          // );
          // this.setStorage({ index: 0, data: newData.itemList });
          this.$refs.excel.replaceContent(this.storage[0][0].celldata);
        }
      };
    });
  },
  methods: {
    ...mapMutations("module_noticeEnter", [
      "setStatistics",
      "setSelectedData",
      "setStorage",
      "initselectedData",
    ]),
    async _setBoxMarksData() {
      await new Promise((resolve, reject) => {
        try {
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
            this.boxMarks = boxs.map((x) => {
              return {
                mark: x.id,
                color: x.color,
              };
            });
            resolve();
          });
        } catch (err) {
          reject(err);
        }
      });
    },
    SetNumChange(mult) {
      let tags = this.tags;
      let len_c = tags.indexOf("长度");
      let wid_c = tags.indexOf("宽度");
      let num_c = tags.indexOf("数量");
      let spareNum_c = tags.indexOf("备品");
      let orderArea_c = tags.indexOf("下单面积");
      let productArea_c = tags.indexOf("生产面积");

      this.sheetChange(this.$refs.excel.getSheetCelldata());

      function getExactInt(obj) {
        if (obj == null || obj == undefined) return 0;
        if (obj?.v?.v == undefined) return 0;
        let res = parseInt(obj.v.v);
        if (isNaN(res)) return 0;
        return res;
      }

      function getExactFloat(obj) {
        if (obj == null || obj == undefined) return 0;
        if (obj?.v?.v == undefined) return 0;
        return parseFloat(obj.v.v).toFixed(6);
      }

      function multSetNum(celldata) {
        let rowNum = Math.max(
            ...celldata.filter((x) => x.c == 0).map((x) => x.r)
        );
        let rows = [];
        for (let r = 1; r <= rowNum; ++r) {
          let rowdata = celldata.filter((x) => x.r === r);
          rows.push(rowdata);
        }
        rows.forEach((row) => {
          let num = getExactInt(row.find((x) => x.c == num_c));
          let len = getExactInt(row.find((x) => x.c == len_c));
          let width = getExactInt(row.find((x) => x.c == wid_c));
          let spareNum = getExactInt(row.find((x) => x.c == spareNum_c));
          let area = fomula.area(len, width);
          let orderArea = (area * num).toFixed(6);
          let sparesArea = (area * spareNum).toFixed(6);
          let productArea = fomula
              .productArea(orderArea, sparesArea)
              .toFixed(6);
          let temp = row.find((x) => x.c == orderArea_c);
          if (getExactFloat(temp) != 0) {
            temp.v.v = orderArea;
            temp.v.m = orderArea.toString();
          }
          temp = row.find((x) => x.c == productArea_c);
          if (getExactFloat(temp) != 0) {
            temp.v.v = productArea;
            temp.v.m = productArea.toString();
          }
        });
        let res = [];
        rows.forEach((row) => {
          res.push(...row);
        });
        return res;
      }

      if (this.storage[2] != null) {
        let cd2 = this.storage[2][0].celldata;
        if (!this._sheetIsEmpty(cd2)) {
          cd2.forEach((c) => {
            if (c.r != 0 && c.c == num_c) {
              let newNum = getExactInt(c) * mult;
              if (newNum != 0) {
                c.v.v = newNum;
                c.v.m = newNum.toString();
              }
            }
          });
          this.storage[2][0].celldata = multSetNum(cd2);
        }
      }
      if (this.storage[3] != null) {
        let cd2 = this.storage[3][0].celldata;
        if (!this._sheetIsEmpty(cd2)) {
          cd2.forEach((c) => {
            if (c.r != 0 && c.c == num_c) {
              let newNum = getExactInt(c) * mult;
              if (newNum != 0) {
                c.v.v = newNum;
                c.v.m = newNum.toString();
              }
            }
          });
          this.storage[3][0].celldata = multSetNum(cd2);
        }
      }
      this.storage[4] = null;
    },
    cleanSheet() {
      this.$confirm("确定清空列表", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            let init;
            if (this.activeName !== "1") {
              init = initSheets.getNoticeEnterSheet();
            } else {
              init = initSheets.getNoticeQuerySheet();
            }
            this.$refs.excel.setNewSheets([init]);
            this.storage[parseInt(this.activeName)] = null;
            if (this.activeName == "0") {
              this.sheetChange(this.$refs.excel.getSheetCelldata());
              this.initselectedData();
            }
          })
          .catch(() => {
          });
    },
    sheetChange(celldata) {
      //当excel中有数据发生变化时的回调
      this.loading_inputBox = true;
      try {
        // 更新统计数据
        let setDatas = util.getProductNoticeStatistics(
            celldata,
            this.selectedData.setNum
        );
        this.setStatistics(setDatas);
      } catch (err) {
        this.$message.error(err);
      }
      this.loading_inputBox = false;
    },
    cellUpdateBefore(r, c, value) {
      //当用户编辑单元格，更新前触发
      try {
        if (this.isEditing) {
          //是用户在编辑而不是api的自动操作
          if (r == 0) {
            // 编辑的是0行，即标签行
            this.$refs.excel.setCellValueNextTick(r, c, this.tags[c]); // 还原为编辑前数据
            this.isEditing = false;
            return;
          }
          if (this.activeName == "1") return;

          let celldata = this.$refs.excel.getSheetCelldata();
          let order_c = celldata
              .filter((x) => x.c == 0 && x.r !== 0)
              .map((x) => x.v.v);
          let maxRow = Math.max(...order_c);
          if (r > maxRow) {
            this.$refs.excel.clearCell(r, c);
            throw "编辑超出范围";
          }
          let box_c = this.tags.indexOf("箱号"); //如果用户编辑的是箱号，进行重新分箱处理
          if (box_c === c && r !== 0) {
            this.boxMarkEdited(r, c, value);
            this.isEditing = false;
            return;
          } else if (c === this.tags.indexOf("序号")) {
            //如果用户编辑的是序号，将交换两行内容
            if (util.isNumber(value)) {
              // 输入的必须是数字
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
              this.$refs.excel.setCellValueNextTick(r, c, r);
              throw Error("请输入数字");
            }

            this.isEditing = false;
            return;
          }
          // 如果编辑不是以上几种情况，将编辑的value写入celldata中，并调用 this.sheetChange以更新统计数据

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
            this.sheetChange(this.$refs.excel.getSheetCelldata());
          });
          this.isEditing = false;
        }
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.isEditing = false;
      }
    },
    drawExcel(sheets) {
      //导入excel后将数据写在表格上（只写入数据，不写入表格样式等config）
      if (sheets.length) {
        //测试代码，只写入导入excel文件的第一张sheet
        sheets = [sheets[0]];
      } else {
        return;
      }
      this.loading_excel = true;
      this.loading_inputBox = true;
      try {
        this.setStorage({index: 0, data: [initSheets.getNoticeEnterSheet()]});
        this.setStorage({index: 2, data: null});
        this.setStorage({index: 3, data: null});
        this.setStorage({index: 4, data: null});
        // this.storage[0] = [initSheets.getNoticeEnterSheet()];
        // this.storage[2] = null;
        // this.storage[3] = null;
        // this.storage[4] = null;
        for (let sheet of sheets) {
          if (sheet.celldata && sheet.celldata.length != 0) {
            this.$refs.excel.replaceContent(
                //清空表格并初始化
                initSheets.getNoticeEnterSheet().celldata
            );
            // this.addSheet();
            let data = {
              //设这个data是为了在原sheet的celldata中仅将数据拷贝进来，剔除样式
              celldata: [],
            };
            for (let cell of sheet.celldata) {
              if (cell.v.v == null) {
                if (cell?.v?.ct?.s !== undefined) {
                  let str = cell.v.ct.s[0].v;
                  let newStr = str.replace(/\r\n/g, "");
                  data.celldata.push({
                    r: cell.r,
                    c: cell.c,
                    v: {
                      m: newStr,
                      ct: {
                        fa: "General",
                        t: "g",
                      },
                      v: newStr,
                    },
                  });
                } else {
                  data.celldata.push({
                    r: cell.r,
                    c: cell.c,
                    v: {
                      ct: cell.v.ct,
                    },
                  });
                }
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
            let cellsToDraw = []; //要写入的cells
            row0.forEach((item, index) => {
              let str = JSON.stringify(item);
              try {
                regs.forEach((reg, c) => {
                  if (reg.test(str)) {
                    let col_cells = data.celldata
                        .filter((x) => x.c == index)
                        .sort((a, b) => a.r - b.r);
                    col_cells.splice(0, 1); //去掉第一行的标签，仅留下数据
                    col_cells.forEach((x) => (x.c = c)); //将列标换为this.tags对应的
                    cellsToDraw.push(...col_cells); //将正则匹配成功的列中的数据写入
                    throw Error(); //匹配成功则跳出循环
                  }
                });
              } catch (e) {
                e;
              }
            });

            let order_c = this.tags.indexOf("序号");
            let max_row = cellsToDraw.filter((x) => x.c == order_c).length;

            let areas = this._area(max_row, this.tags, cellsToDraw);

            let num_arr = util.getColumnDataArray(
                //“数量”列的数据数组（空白单元格对应位置为0）
                max_row,
                this.tags.indexOf("数量"),
                cellsToDraw
            );
            let sparesNum_arr = util.getColumnDataArray(
                //“备品”列的数据数组（空白单元格对应位置为0）
                max_row,
                this.tags.indexOf("备品"),
                cellsToDraw
            );
            let orderArea_arr = this._orderArea(num_arr, areas); //“下单面积”列的数据数组
            let sparesArea_arr = this._sparesArea(sparesNum_arr, areas); //备品面积数据数组
            let productArea_arr = orderArea_arr.map((a, i) =>
                fomula.productArea(a, sparesArea_arr[i])
            ); //“生产面积”列的数据数组
            //将计算好的数据加入cellsToDraw
            let col_orderArea = this.tags.indexOf("下单面积");
            let col_productArea = this.tags.indexOf("生产面积");
            orderArea_arr.forEach((item, r) => {
              cellsToDraw.push({r: r + 1, c: col_orderArea, v: item});
            });
            productArea_arr.forEach((item, r) => {
              cellsToDraw.push({r: r + 1, c: col_productArea, v: item});
            });
            let fullLength = this._fullLength(max_row, this.tags, cellsToDraw);
            let col_fullLength = this.tags.indexOf("总长度");
            fullLength.forEach((item, r) => {
              cellsToDraw.push({r: r + 1, c: col_fullLength, v: item});
            });
            this.$refs.excel.draw(cellsToDraw); //绘制
          }
        }
        this.sheetChange(this.$refs.excel.getSheetCelldata());
      } catch (e) {
        this.$message.error("导入失败，请检查文件内容格式");
      } finally {
        this.loading_excel = false;
        this.loading_inputBox = false;
      }
    },
    drawQueryResult(data) {
      if (data.length == 0) {
        this.$message.error("未找到数据");
        return;
      }
      let init = initSheets.getNoticeQuerySheet();
      init.row = data.length + 1;
      this.$refs.excel.setNewSheets([init]);
      // this.$refs.excel.replaceContent(
      //   initSheets.getNoticeQuerySheet().celldata
      // );
      data.sort((a, b) => {
        return a.enter_date < b.enter_date ? 1 : -1;
      });
      data.forEach((e, i) => {
        this.$refs.excel.setCellValue(i + 1, 0, e.work_num);
        this.$refs.excel.setCellValue(i + 1, 1, e.enter_date);
        this.$refs.excel.setCellValue(i + 1, 2, e.item_name);
        this.$refs.excel.setCellValue(i + 1, 3, e.set_num);
        this.$refs.excel.setCellValue(i + 1, 4, e.project_name);
        this.$refs.excel.setCellValue(i + 1, 5, e.customer_name);
        this.$refs.excel.setCellValue(i + 1, 6, e.organ_require);
        this.$refs.excel.setCellValue(i + 1, 7, e.orientation);
        this.$refs.excel.setCellValue(i + 1, 8, e.pack_demand);
        this.$refs.excel.setCellValue(i + 1, 9, e.total_num);
        this.$refs.excel.setCellValue(i + 1, 10, e.total_length);
        this.$refs.excel.setCellValue(i + 1, 11, e.total_area);
        this.$refs.excel.setCellValue(i + 1, 12, e.total_product_num);
        this.$refs.excel.setCellValue(i + 1, 13, e.total_product_area);
        this.$refs.excel.setCellValue(i + 1, 14, e.order_date);
        this.$refs.excel.setCellValue(i + 1, 15, e.enter_staff);
        this.$refs.excel.setCellValue(i + 1, 16, e.check_report_num);
        this.$refs.excel.setCellValue(i + 1, 17, e.credential_num);
        this.$refs.excel.setCellValue(i + 1, 18, e.receipt_num);
        this.$refs.excel.setCellValue(i + 1, 19, e.other);
        this.$refs.excel.setCellValue(i + 1, 20, e.express_company);
        this.$refs.excel.setCellValue(i + 1, 21, e.express_num);
      });
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
            resolve();
          });
        } catch (e) {
          reject();
        }

        // //获取当前表单r行的 长度宽度数量备品的数据，计算出总长度下单面积生产面积 并绘制
        // let tags = this.tags;
        // let len_c = tags.indexOf("长度");
        // let wid_c = tags.indexOf("宽度");
        // let num_c = tags.indexOf("数量");
        // let spareNum_c = tags.indexOf("备品");
        // this.$nextTick(() => {
        //   let len = parseInt(this.$refs.excel.getCellValue(r, len_c));
        //   let width = parseInt(this.$refs.excel.getCellValue(r, wid_c));
        //   let num = parseInt(this.$refs.excel.getCellValue(r, num_c));
        //   let spareNum = parseInt(this.$refs.excel.getCellValue(r, spareNum_c));
        //   if (isNaN(len)) len = 0;
        //   if (isNaN(width)) width = 0;
        //   if (isNaN(num)) num = 0;
        //   if (isNaN(spareNum)) spareNum = 0;
        //   let area = fomula.area(len, width);
        //   let fullLength = fomula.fullLength(len);
        //   let orderArea = area * num;
        //   let sparesArea = area * spareNum;
        //   let productArea = fomula.productArea(orderArea, sparesArea);
        //   let fulllen_c = tags.indexOf("总长度");
        //   let orderArea_c = tags.indexOf("下单面积");
        //   let productArea_c = tags.indexOf("生产面积");
        //   this.$refs.excel.setCellValue(r, fulllen_c, fullLength);
        //   this.$refs.excel.setCellValue(
        //     r,
        //     orderArea_c,
        //     Math.round(orderArea * 100) / 100
        //   );
        //   this.$refs.excel.setCellValue(
        //     r,
        //     productArea_c,
        //     Math.round(productArea * 100) / 100
        //   );
        //   callback();
      });
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
      let orderArea = areas.map((a, i) => (a * nums[i]).toFixed(6));
      return orderArea;
    },
    _sparesArea(sparesNums, areas) {
      if (sparesNums == undefined) {
        return areas.map(() => 0);
      }
      let sparesArea = areas.map((a, i) => (a * sparesNums[i]).toFixed(6));
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
    addSheet(name = "sheet1") {
      this.$refs.excel.setSheetAdd({
        sheetObject: initSheets.getNoticeEnterSheet(name),
      });
    },
    save() {
      try {
        if (
            this.selectedData.workNum == "" ||
            this.selectedData.workNum == null
        )
          throw "请输入单号";
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
              let normalDivided = [];
              let descDivided = [];
              let cutHalf = [];

              let data = celldata.filter(
                  (x) => x.r <= maxRow && x.c <= maxColumn
              );

              if (!this._sheetIsEmpty(data)) {
                normal = this._divideReportBox(data, maxRow, 1);
              } else {
                this.$message.error("请导入excel数据");
                return;
              }
              let row0 = this.tags;
              let box_c = row0.indexOf("箱号");
              let box_col = celldata.filter((x) => x.c == box_c && x.r !== 0);
              if (
                  box_col.length != 0 &&
                  typeof box_col[0].v.v == "string" &&
                  box_col[0].v.v != ""
              ) {
                let newCelldatas = celldata.filter((x) => x.r == 0);
                newCelldatas.push(...this.getBoxSortCelldata(celldata));
                normalDivided = this._divideReportBox(
                    newCelldatas,
                    newCelldatas.filter((x) => x.c == 0 && util.isNumber(x.v.v))
                        .length,
                    2,
                    false
                );
              } else {
                if (
                    this.storage[2] !== null &&
                    !this._sheetIsEmpty(this.storage[2][0].celldata)
                ) {
                  normalDivided = this._divideReportBox(
                      this.storage[2][0].celldata,
                      this.storage[2][0].celldata.filter(
                          (x) => x.c == 0 && util.isNumber(x.v.v)
                      ).length,
                      2
                  );
                } else {
                  let dataRows = this._packRow(
                      celldata.filter((e) => e.c !== box_c)
                  );
                  let boxs = this._divideByNumOrArea(row0, dataRows);
                  let init = this._setBoxData(boxs, box_c);
                  normalDivided = this._divideReportBox(
                      init.celldata,
                      init.celldata.filter(
                          (x) => x.c == 0 && !isNaN(parseInt(x.v.v))
                      ).length,
                      2,
                      false
                  );
                }
              }
              normalDivided = util.sortNormalDivideReportData(normalDivided);
              if (
                  this.storage[3] !== null &&
                  !this._sheetIsEmpty(this.storage[3][0].celldata)
              ) {
                descDivided = this._divideReportBox(
                    this.storage[3][0].celldata,
                    this.storage[3][0].celldata.filter(
                        (x) => x.c == 0 && util.isNumber(x.v.v)
                    ).length,
                    3
                );
              }
              if (
                  this.storage[4] !== null &&
                  !this._sheetIsEmpty(this.storage[4][0].celldata)
              ) {
                cutHalf = this._divideReportBox(
                    this.storage[4][0].celldata,
                    this.storage[4][0].celldata.filter(
                        (x) => x.c == 0 && util.isNumber(x.v.v)
                    ).length,
                    4
                );
              }

              const {
                contractNum,
                date,
                projectName,
                workNum,
                itemName,
                orderDate,
                setNum,
                organRequire,
                checkReportNum,
                credentialNum,
                receiptNum,
                other,
                packDemand,
                orientation,
                orderTime,
                customerName,
                expressCompany,
                expressNum,
                fullPieceNum,
                pieceNum,
                fullLength,
                fullArea,
                productArea,
              } = this.selectedData;
              if (!workNum.startsWith("R")) {
                this.$message.error("合同号必须以R开头");
                return;
              }
              let formHead = {
                contract_num: contractNum,
                enter_date: util.formatDate(date, "ymd"),
                project_name: projectName,
                work_num: workNum,
                item_name: itemName,
                order_date: util.formatDate(orderDate, "ymd"),
                set_num: setNum,
                organ_require: organRequire,
                check_report_num: checkReportNum,
                credential_num: credentialNum,
                receipt_num: receiptNum,
                other: other,
                pack_demand: packDemand,
                orientation: orientation,
                order_time: orderTime,
                customer_name: customerName,
                express_company: expressCompany,
                express_num: expressNum,
                enter_staff: localStorage.myName,
                total_num: fullPieceNum,
                total_product_num: pieceNum,
                total_length: fullLength,
                total_area: fullArea,
                total_product_area: productArea,
              };
              let itemList = [];
              itemList.push(...normal);
              itemList.push(...normalDivided);
              itemList.push(...descDivided);
              itemList.push(...cutHalf);
              let p1 = this.$API.reqEnterProductNotice(
                  JSON.parse(JSON.stringify(formHead))
              );
              let p2 = this.$API.reqEnterReport(itemList);
              // this.setReportExcelData();
              let promises = Promise.all([p1, p2]);
              promises.then(() => {
                this.$message.success("保存成功");
              });
            })
            .catch((e) => {
              this.$message.error(e);
            });
      } catch (err) {
        this.$message.error(err);
      }
    },
    deleteSheet() {
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
              let work_num = this.$refs.excel.getCellValue(rows[0], order_c);
              let promises = [
                this.$API.reqDelProductNotice({work_num: work_num}),
                this.$API.reqDeleteReport({work_num: work_num}),
              ];
              Promise.all(promises).then((res) => {
                if (res[0].code && res[1].code) {
                  this.$message.success("删除成功");
                  this.$refs.excel.deleteRow(rows[0], rows[0]);
                } else {
                  this.$message.error("删除失败");
                }
              });
            })
            .catch(() => {
            });
      } catch (err) {
        this.$message.error(err);
      }
    },
    pullSheet() {
      try {
        const rows = this.$refs.excel.getRangeRowArray();
        const order_c = 0;

        // 验证逻辑提取
        if (rows.length !== 1 || rows[0] == 0) throw Error("请框选一项单据拉取");
        if (!this.$refs.excel.getCellValue(Math.max(...rows), order_c)) throw Error("选区超出界限");
        if (rows.some(x => x == 0)) throw Error("请先框选要拉取的项");

        this.$confirm("是否确认拉取?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {
          const work_num = this.$refs.excel.getCellValue(rows[0], order_c);
          const {data} = await this.$API.reqGetProductNotice({work_num});
          if (!data) return;

          // 数据解构优化
          const selectedData = this.createSelectedData(data);
          this.$store.state.module_noticeEnter.selectedData = selectedData;

          // 调用 reqGetReport，form_type 为 0，获取所有 form_type 的数据
          const reportResponse = await this.$API.reqGetReport({work_num, form_type: 0});
          if (!reportResponse.data) throw "拉取单据失败";

          // 创建预计算映射表
          const boxMarkMap = this.boxMarks.reduce((map, box) => {
            map[box.mark] = box.color;
            return map;
          }, {});

          // 按 form_type 分组
          const groupedData = reportResponse.data.reduce((acc, item) => {
            const formType = item.form_type;
            if (!acc[formType]) {
              acc[formType] = [];
            }
            acc[formType].push(item);
            return acc;
          }, {});

          // 处理各表单数据
          if (groupedData[1]) {
            this.handleFormType1(groupedData[1], data.set_num, boxMarkMap);
          }
          await Promise.all([
            groupedData[2] ? this.handleFormType(2, groupedData[2], data.set_num) : Promise.resolve(),
            groupedData[3] ? this.handleFormType(3, groupedData[3], data.set_num) : Promise.resolve(),
            groupedData[4] ? this.handleFormType(4, groupedData[4], data.set_num, true) : Promise.resolve(),
          ]);
        }).catch(() => {
        });
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    createSelectedData(data) {
      return {
        contractNum: data.contract_num,
        date: new Date(data.enter_date),
        projectName: data.project_name,
        workNum: data.work_num,
        itemName: data.item_name,
        orderDate: new Date(data.order_date),
        setNum: data.set_num,
        organRequire: data.organ_require,
        checkReportNum: data.check_report_num,
        credentialNum: data.credential_num,
        receiptNum: data.receipt_num,
        other: data.other,
        packDemand: data.pack_demand,
        orientation: data.orientation,
        orderTime: data.order_time,
        customerName: data.customer_name,
        expressCompany: data.express_company,
        expressNum: data.express_num,
        fullLength: 0,
        pieceNum: 0,
        fullArea: 0,
        productArea: 0,
        fullPieceNum: 0,
      };
    },

    handleFormType1(data, set_num, boxMarkMap) {
      if (!data?.length) return;

      const sh = initSheets.getNoticeEnterSheet();
      const datas = this._setPulledSheet(data, set_num, 1);
      const box_c = this.tags.indexOf("箱号");

      // 优化数据分组算法
      const packRows = Array.from({length: data.length}, (_, i) =>
          datas.filter(x => x.r === i + 1)
      );

      packRows.forEach(row => {
        const markCell = row.find(x => x.c === box_c);
        const markValue = markCell?.v?.v?.toString();
        if (markValue && boxMarkMap[markValue]) {
          const color = boxMarkMap[markValue];
          row.forEach(cell => (cell.v.bg = color));
        }
      });

      sh.celldata.push(...packRows.flat());
      this.$store.state.module_noticeEnter.storage[0] = [sh];
      this.activeName = "0";
      this.sheetChange(sh.celldata);
    },

    async handleFormType(formType, data, set_num, isType4 = false) {
      const sh = initSheets.getNoticeEnterSheet();
      if (!data?.length) {
        this.$store.state.module_noticeEnter.storage[formType] = [sh];
        return;
      }

      sh.celldata.push(...this._setPulledSheet(data, set_num, formType));
      const box_c = this.tags.indexOf("箱号");
      const dataRows = this._packRow(sh.celldata);
      const boxs = this._divideByBoxMark(box_c, dataRows);
      let processedSheet = this._setBoxData(boxs, box_c);

      if (isType4) {
        processedSheet = this.processType4Sheet(processedSheet);
      }

      this.$store.state.module_noticeEnter.storage[formType] = [processedSheet];
    },

    processType4Sheet(sh) {
      const order_c = 0;
      const packedRows = this._packRowAndSortByColor(sh.celldata);
      const initSheet = initSheets.getNoticeEnterSheet(this.$refs.excel.getSheetName());

      initSheet.config.columnlen[7] = 178;
      packedRows.forEach((row, i) => {
        row.rowdata.forEach(cell => {
          cell.r = i + 1;
          if (cell.c === order_c) {
            cell.v = {...cell.v, v: i + 1, m: i + 1};
          }
        });
        initSheet.celldata.push(...row.rowdata);
      });

      const countCol = this.tags.indexOf("计数");
      initSheet.celldata
          .filter(x => x.r !== 0 && x.c === countCol)
          .forEach(cell => {
            if (typeof cell.v.v === 'string' && cell.v.v.includes("剪")) {
              this.updateRowColor(cell.r, this.cutHalfColor, initSheet);
            }
          });
      return initSheet;
    },

    updateRowColor(row, color, sheet) {
      sheet.celldata
          .filter(x => x.r === row)
          .forEach(cell => (cell.v.bg = color));
    },
    divideBox() {
      function hasBoxMark(celldata, box_c) {
        let box_col = celldata.filter((x) => x.c == box_c && x.r != 0);
        if (box_col.length == 0) return false;
        let res = box_col.find((c) => c.v.v == "" || c?.v?.v == undefined);
        return res == undefined;
      }

      //分箱点击事件
      try {
        let celldata = this.$refs.excel.getSheetCelldata();
        if (this._sheetIsEmpty(celldata)) {
          throw Error("当前表格为空，请先导入excel数据");
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
              let boxs = [];
              if (hasBoxMark(celldata, box_c)) {
                boxs = this._divideByBoxMark(box_c, dataRows);
              } else {
                boxs = this._divideByNumOrArea(row0, dataRows); //将当前表单数据分箱
              }
              this.$confirm("是否宽度降序排列?", "提示", {
                confirmButtonText: "是",
                cancelButtonText: "否",
                type: "warning",
              })
                  .then(() => {
                    //宽度降序（将boxs中宽度不足1000的挑出来分到第0箱）
                    let width_c = row0.indexOf("宽度");
                    let length_c = row0.indexOf("长度");
                    let zeroBox = {
                      //初始化第0箱
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
                      //宽度降序排列，相同宽度中长度升序排列
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
                      boxs.unshift(zeroBox); //将第0箱放在所有箱子最前面
                    }
                    let init = this._setBoxData(boxs, box_c);
                    this.storage[3] = [init];
                    this.$alert("跳转到宽度降序数据查询", "分箱完成", {
                      confirmButtonText: "确定",
                      callback: () => {
                        this.activeName = "3";
                      },
                    });
                  })
                  .catch(() => {
                    //正常分箱处理
                    let init = this._setBoxData(boxs, box_c);
                    this.storage[2] = [init];
                    this.$alert("跳转到正常分箱数据查询", "分箱完成", {
                      confirmButtonText: "确定",
                      callback: () => {
                        this.activeName = "2";
                      },
                    });
                  });
            })
            .catch(() => {
            });
      } catch (err) {
        this.$message.error(err);
      }
    },
    widthDesc() {
      try {
        let celldata = this.$refs.excel.getSheetCelldata();
        if (this._sheetIsEmpty(celldata)) {
          throw Error("当前表格为空，请先分箱");
        }
        this.$confirm("是否在此基础上按宽度降序分箱?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
            .then(() => {
              let row0 = this.tags;
              let box_c = row0.indexOf("箱号");
              let dataRows = this._packRow(celldata);
              let boxs = this._divideByBoxMark(box_c, dataRows); //将当前表单数据分箱
              //宽度降序（将boxs中宽度不足1000的挑出来分到第0箱）
              let width_c = row0.indexOf("宽度");
              let length_c = row0.indexOf("长度");
              let zeroBox = {
                //初始化第0箱
                index: 0,
                numSum: 0,
                areaSum: 0,
                rows: [],
              };
              let l_order = this.tags.indexOf("长度");
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
                box.rows.sort((a, b) => {
                  let alc = a.find((x) => x.c == l_order);
                  let blc = b.find((x) => x.c == l_order);
                  if (alc == undefined || blc == undefined) return 0;
                  let al = parseInt(alc.v.v);
                  let bl = parseInt(blc.v.v);
                  if (isNaN(al) || isNaN(bl)) return 0;
                  return bl - al;
                });
              });

              zeroBox.rows.sort((a, b) => {
                //宽度降序排列，相同宽度中长度升序排列
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
                boxs.unshift(zeroBox); //将第0箱放在所有箱子最前面
              }
              let init = this._setBoxData(boxs, box_c);
              this.storage[3] = [init];
              this.$alert("跳转到宽度降序数据查询", "分箱完成", {
                confirmButtonText: "确定",
                callback: () => {
                  this.activeName = "3";
                },
              });
            })
            .catch(() => {
            });
      } catch (err) {
        this.$message.error(err);
      }
    },
    boxMarkEdited(box_r, box_c, value) {
      //用户编辑箱号，重新分箱
      try {
        if (!util.checkProductNoticeBoxMark(value)) {
          this.$refs.excel.clearCell(box_r, box_c);
          throw Error("箱号只能是0或英文字符");
        }
            // else if (!(this.activeName == "2" || this.activeName == "3")) {
            //   this.$refs.excel.clearCell(box_r, box_c);
            //   throw Error("请在分箱表单中编辑箱号");
        // }
        else {
          value = value.toUpperCase();
          this.$refs.excel.setCellValueNextTick(box_r, box_c, value);
          this.isEditing = false;
          let box = this.boxMarks.find((x) => x.mark == value);
          if (box == undefined) throw "无该箱的颜色信息";
          this.$refs.excel.colorRow(box_r, 0, box_c, box.color);
        }

        // let celldata = this.$refs.excel.getSheetCelldata();
        // let dataRows = this._packRow(celldata).sort((a, b) => a.r - b.r);
        // if (dataRows.length < box_r) {
        //   // this.$message.error("请在数据行编辑箱号");
        //   this.$refs.excel.clearCell(box_r, box_c);
        //   throw Error("请在数据行编辑箱号");
        // }
        // this.loading_excel = true;

        // let changingCell = dataRows[box_r - 1].rowdata.find(
        //   (x) => x.c === box_c
        // );
        // if (changingCell === undefined) {
        //   dataRows[box_r - 1].rowdata.push({
        //     r: box_r,
        //     c: box_c,
        //     v: {
        //       ct: {
        //         fa: "General",
        //         t: "g",
        //       },
        //       m: value,
        //       v: value,
        //     },
        //   });
        // } else {
        //   changingCell.v.v = value;
        //   changingCell.v.m = value;
        // }
        // let boxs = this._divideByBoxMark(box_c, dataRows, value);
        // this.$nextTick(() => {
        //   this._drawEditedBox(boxs, box_c);
        //   this.loading_excel = false;
        // });
      } catch (err) {
        this.$message.error(err);
      }
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
      let length_c = this.tags.indexOf("长度");  // 假设“长度”列的索引
      let width_c = this.tags.indexOf("宽度");   // 假设“宽度”列的索引
      for (let r = 1; r <= rowNum; ++r) {
        let rowdata = celldata.filter((x) => x.r === r);
        rows.push(rowdata);
      }
      let order = this.boxMarks.map((x) => x.mark);
      const indexMap = new Map(order.map((value, index) => [value, index]));
      const rowsSorted = rows.slice().sort((a, b) => {
        // 按箱号排序
        let am = a.find((x) => x.c == box_c);
        let bm = b.find((x) => x.c == box_c);
        if (am == undefined || bm == undefined) throw "有数据未分配箱号";
        if (am?.v?.v == undefined || bm?.v?.v == undefined)
          throw "有数据未分配箱号";
        let target1 = am.v.v.toString();
        let target2 = bm.v.v.toString();
        const indexA = indexMap.has(target1) ? indexMap.get(target1) : Infinity;
        const indexB = indexMap.has(target2) ? indexMap.get(target2) : Infinity;
        if (indexA !== indexB) return indexA - indexB;

        // 如果箱号相同，则按长度排序
        let alc = a.find((x) => x.c == length_c);
        let blc = b.find((x) => x.c == length_c);
        if (alc == undefined || blc == undefined) return 0;
        let al = parseInt(alc.v.v);
        let bl = parseInt(blc.v.v);
        if (isNaN(al) || isNaN(bl)) return 0;
        if (al !== bl) return bl - al;  // 按长度降序

        // 如果长度相同，则按宽度排序
        let aw = a.find((x) => x.c == width_c);
        let bw = b.find((x) => x.c == width_c);
        if (aw == undefined || bw == undefined) return 0;
        let awidth = parseInt(aw.v.v);
        let bwidth = parseInt(bw.v.v);
        if (isNaN(awidth) || isNaN(bwidth)) return 0;
        return bwidth - awidth;  // 按宽度降序
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
      //按数量与生产面积分箱，第一次分箱时调用
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
            //数量达到20或面积达到50自动分出一箱
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
      let l_order = this.tags.indexOf("长度");
      let w_order = this.tags.indexOf("宽度");

      boxs.forEach((b) => {
        b.rows.sort((a, b) => {
          // 按长度排序
          let alc = a.find((x) => x.c == l_order);
          let blc = b.find((x) => x.c == l_order);
          if (alc == undefined || blc == undefined) return 0;
          let al = parseInt(alc.v.v);
          let bl = parseInt(blc.v.v);
          if (isNaN(al) || isNaN(bl)) return 0;

          // 如果长度相同，则按宽度排序
          if (al === bl) {
            let aw = a.find((x) => x.c == w_order);
            let bw = b.find((x) => x.c == w_order);
            if (aw == undefined || bw == undefined) return 0;
            let awidth = parseInt(aw.v.v);
            let bwidth = parseInt(bw.v.v);
            if (isNaN(awidth) || isNaN(bwidth)) return 0;
            return bwidth - awidth;  // 按宽度降序
          }

          // 默认按长度降序
          return bl - al;
        });
      });
      return boxs;
    },
    _divideByBoxMark(box_c, dataRows) {
      //按箱号整理出新的分箱，在用户编辑箱号重新分箱时调用
      let boxMarks = dataRows
          .map((x) => {
            let m = x.rowdata.find((y) => y.c === box_c);
            if (m !== undefined) return m.v.v.toString();
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
      //编辑箱号时重新分好箱之后，将新分箱写入excel表单
      let r = 1; //从第一行开始逐行写入
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
                //上色
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
      //将分好箱后的数据填入this.storage对应位置
      if (!this.$refs.excel) return [];

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
            if (e.v != "") init.celldata.push({r: r, c: e.c, v: e.v});
          });
          if (typeof box.index == "number") {
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
      // if (sheetname == "降序分箱") this.storage[3] = [init];
      // if (sheetname == "正常分箱") this.storage[2] = [init];
      // callback();
    },
    _packRow(celldata) {
      let rowNum = Math.max(...celldata.map((x) => x.r));
      let result = [];
      for (let r = 1; r <= rowNum; ++r) {
        let rowdata = celldata.filter((x) => x.r === r && x.c !== 0); // 除去"序号"这一列
        result.push({r: r, rowdata: rowdata});
      }
      return result;
    },
    _sheetIsEmpty(celldata) {
      //celldata是否是没有数据的表单
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
            .catch(() => {
            });
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
    cutHalfPiece() {
      //剪半片点击事件
      //机制是 获取当前表单的celldata->根据tableData中要剪半片的条目，对celldata进行处理->将处理完成的celldata设置在this.storage对应于剪半片页的位置->跳转到剪半片页并渲染
      try {
        let rows = this.$refs.excel.getRangeRowArray();
        // let rows = [];
        // ranges.forEach((range) => {
        //   for (let i = range.row[0]; i <= range.row[1]; i++) {
        //     rows.push(i);
        //   }
        // });
        let order_c = this.tags.indexOf("序号");
        if (!this.$refs.excel.getCellValue(Math.max(...rows), order_c)) {
          throw Error("选区超出界限");
        }
        if (rows.filter((x) => x == 0).length !== 0) {
          throw Error("请先框选要减半片的表项");
        }
        // this.cuttingData.rows = rows;
        this.drawTitle = "剪半片处理";
        this.selectedRows = rows; //选取对应的行标数组
        this.showDrawer = true; //弹出抽屉
      } catch (err) {
        this.$message.error(err);
      }
    },
    confirmCutting(tableData) {
      //剪半片确定，进行剪半片操作
      try {
        let celldata = this.$refs.excel.getSheetCelldata();
        let order_c = this.tags.indexOf("序号");
        celldata = this._transFormCutData(celldata, tableData);
        let packedRows = this._packRowAndSortByColor(celldata);
        let init = initSheets.getNoticeEnterSheet(
            this.$refs.excel.getSheetName()
        );
        init.config.columnlen[7] = 178; //将计数一栏的宽度加大
        for (let i = 0; i < packedRows.length; ++i) {
          packedRows[i].rowdata.forEach((e) => {
            //这里是为了重排rowdata中每个cell的r属性，不这么做渲染时会按旧r进行渲染，顺序就错了
            e.r = i + 1;
            if (e.c == order_c) {
              e.v.v = i + 1;
              e.v.m = i + 1;
            }
          });
          init.celldata.push(...packedRows[i].rowdata);
        }

        this.storage[4] = [init]; //设置表单数据
        if (this.activeName == "4") {
          //如果当前页面就是剪半片页面，则直接设置表单数据
          this.$refs.excel.setNewSheets(this.storage[4]);
          this.showDrawer = false;
          this.$refs.cuthalf.clearTableData();
        } else {
          this.$alert("跳转到减半片数据查询？", "完成", {
            confirmButtonText: "确定",
            callback: () => {
              this.activeName = "4";
              this.showDrawer = false;
              this.$refs.cuthalf.clearTableData();
            },
          });
        }
      } catch (err) {
        this.$message.error(err);
      }
    },
    _transFormCutData(celldata, tableData) {
      //将对应tableData中要剪半片的条目在celldata中找到进行处理，将处理完成的数据重新写入celldata并返回
      let length_c = this.tags.indexOf("长度");
      let width_c = this.tags.indexOf("宽度");
      let num_c = this.tags.indexOf("数量");
      let count_c = this.tags.indexOf("计数");
      let spare_c = this.tags.indexOf("备品");
      let box_c = this.tags.indexOf("箱号");
      let orderArea_c = this.tags.indexOf("下单面积");
      let productArea_c = this.tags.indexOf("生产面积");
      tableData.forEach((item) => {
        let cuttings = celldata.filter((x) => {
          return item.order.indexOf(x.r) != -1;
        });
        //剪半片操作的数据需要是长度相同并且在同一箱
        if (
            !util.areAllElementsEqual(
                cuttings.filter((x) => x.c === length_c).map((x) => x.v.v)
            )
        ) {
          throw Error("请选择长度相同的数据");
        }
        if (
            !util.areAllElementsEqual(
                cuttings.filter((x) => x.c === box_c).map((x) => x.v.v)
            )
        ) {
          throw Error("请选择箱号相同的数据");
        }
        let cutting = cuttings.filter((x) => {
          return item.order[0] == x.r; // 以所选区中的第一行为基准填入减半片相关数据
        });
        let length = parseInt(cutting.find((x) => x.c == length_c).v.v);
        let orderArea = fomula.area(length, item.width) * item.num;
        let productArea = 0;

        let count = "";
        let widths = cuttings.filter((x) => x.c == width_c);
        let nums = cuttings.filter((x) => x.c == num_c);
        let areas = cuttings.filter((x) => x.c == productArea_c);
        areas.forEach((e) => {
          productArea += parseFloat(e.v.v);
        });
        widths.forEach((e) => {
          let temp = nums.find((x) => x.r == e.r);
          if (temp !== undefined) {
            count += "剪" + e.v.v + "*" + temp.v.v + " ";
            // productArea +=
            //   fomula.area(length, parseInt(e.v.v)) * parseInt(temp.v.v);
          }
        });

        // let productArea =
        //   fomula.area(length, item.width) * (item.num - item.sparesNum);

        cutting.forEach((e) => {
          e.v.bg = this.cutHalfColor;
          if (e.c == width_c) {
            e.v.v = item.width;
            e.v.m = item.width;
          }
          if (e.c == num_c) {
            e.v.v = item.num;
            e.v.m = item.num;
          }
          if (e.c == count_c) {
            e.v.ct = {
              fa: "General",
              t: "g",
            };
            e.v.v = count;
            e.v.m = count;
          }
          if (e.c == spare_c) {
            e.v.ct = {
              fa: "General",
              t: "g",
            };
            e.v.v = item.sparesNum;
            e.v.m = item.sparesNum;
          }
          if (e.c == orderArea_c) {
            e.v.v = orderArea.toFixed(6);
            e.v.m = orderArea.toFixed(6);
          }
          if (e.c == productArea_c) {
            e.v.v = productArea.toFixed(6);
            e.v.m = productArea.toFixed(6);
          }
        });

        celldata = celldata.filter((x) => {
          return item.order.indexOf(x.r) == -1;
        });
        celldata.push(...cutting);
      });
      return celldata;
    },
    _packRowAndSortByColor(celldata) {
      //将相同行的celldata中元素打包成数组，并按照颜色进行排序，顺序是 0箱颜色，剪半片颜色（this.cutHalfColor），A箱颜色，B箱颜色......
      let order_c = this.tags.indexOf("序号");
      let box_c = this.tags.indexOf("箱号");
      let rowNum = Math.max(
          ...celldata.filter((x) => x.c == order_c).map((x) => x.r)
      );
      let packedRows = [];
      for (let r = 1; r <= rowNum; ++r) {
        let rowdata = celldata.filter((x) => x.r === r);
        if (rowdata.length !== 0)
          packedRows.push({
            mark: rowdata.find((x) => x.c == box_c).v.v.toString(),
            rowdata: rowdata,
          });
      }
      let w_order = this.tags.indexOf("宽度");
      let l_order = this.tags.indexOf("长度");
      packedRows.sort((a, b) => {
        if (a.mark < b.mark) return -1;
        if (a.mark > b.mark) return 1;
        let aw = parseInt(a.rowdata[w_order].v.v);
        let bw = parseInt(b.rowdata[w_order].v.v);
        if (isNaN(aw) || isNaN(bw)) return 0;
        if (aw - bw != 0) return aw - bw;
        let al = parseInt(a.rowdata[l_order].v.v);
        let bl = parseInt(b.rowdata[l_order].v.v);
        if (isNaN(al) || isNaN(bl)) return 0;
        return bl - al;
      });

      // let colorCut = this.cutHalfColor;
      // packedRows.sort((a, b) => {
      //   if (a.mark < b.mark) return -1;
      //   if (a.mark > b.mark) return 1;
      //   if (a.rowdata[0].v.bg != colorCut && b.rowdata[0].v.bg == colorCut)
      //     return -1;
      //   if (a.rowdata[0].v.bg == colorCut && b.rowdata[0].v.bg != colorCut)
      //     return 1;
      //   return 0;
      // });
      return packedRows;
    },
    report() {
      //报表点击事件
      try {
        this.$store.state.module_globalData.reported = true;
      } catch (err) {
        this.$message.error(err);
      }
    },
    reportNotice() {
      try {
        let rows = this.$refs.excel.getRangeRowArray();
        let order_c = 0;
        if (rows.length !== 1 || rows[0] == 0) {
          throw Error("请框选一项单据报表");
        }
        if (!this.$refs.excel.getCellValue(Math.max(...rows), order_c)) {
          throw Error("选区超出界限");
        }
        if (rows.filter((x) => x == 0).length !== 0) {
          throw Error("请先框选要报表的项");
        }
        this.drawTitle = "报表";
        this.selectedRows = rows[0];
        this.showDrawer = true;

        // this.$store.state.module_globalData.reported = true;
      } catch (err) {
        this.$message.error(err);
      }
    },
    confirmReport(e) {
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
      this.storage[1] = this.$refs.excel.getAllSheets();
      let workNum = this.$refs.excel.getCellValue(this.selectedRows, 0);
      let reportedFile = cmd;
      if (e == 0) {
        reportedFile += `956393739229020160?workNum=${workNum}&formType=${
            e + 1
        }`; //四种通知单
      } else if (e == 1) {
        reportedFile += `956388502149742592?workNum=${workNum}&formType=${
            e + 1
        }`;
      } else if (e == 2) {
        reportedFile += `956394182470483968?workNum=${workNum}&formType=${
            e + 1
        }`;
      } else if (e == 3) {
        reportedFile += `956394570489741312?workNum=${workNum}&formType=${
            e + 1
        }`;
      } else if (e == 4) {
        reportedFile += `911907033566363648?workNum=${workNum}`; //货物明细
      } else if (e == 5) {
        //装箱单
        if (cmd == "view/") {
          let routeData = this.$router.resolve({
            path: "/packingreport",
            query: {
              workNum: workNum,
            },
          });
          window.open(routeData.href, "reportPage");
          return;
        } else if (cmd == "index/") {
          reportedFile += `911906887336148992?workNum=${workNum}`;
        }
      } else if (e == 6) {
        reportedFile += `911907072816660480?workNum=${workNum}`; //打压检测
      } else if (e == 7) {
        reportedFile += `911907051014668288?workNum=${workNum}`; // 签回单
      } else if (e == 8) {
        reportedFile += `911906875646623744?workNum=${workNum}`; // 最终检测记录
      } else if (e == 9) {
        reportedFile += `951417882752270336?workNum=${workNum}`; // 标签 不含位置
      } else if (e == 10) {
        reportedFile += `950935874271920128?workNum=${workNum}`; // 标签 含位置
      } else if (e == 11) {
        reportedFile += `1010751164899606528?workNum=${workNum}`; // 标签2 不含位置
      } else if (e == 12) {
        reportedFile += `1010743483279294464?workNum=${workNum}`; // 标签2 含位置
      }

      let routeData = this.$router.resolve({
        path: "/report",
        query: {
          reportedFile: reportedFile,
        },
      });
      window.open(routeData.href, "reportPage");
    },
    _divideReportBox(celldata, maxRow, type, div = true) {
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
        let row = {};
        if (mark == "0") {
          row = {
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
            work_num: this.selectedData.workNum,
            form_type: type,
            complete: 0,
          };
        } else {
          let num = parseInt(cellValue(this.tags.indexOf("数量"), r));
          if (isNaN(num)) throw "数量数据错误";
          if (div) {
            if (type != 1) num = num / this.selectedData.setNum;
          }

          let length = parseInt(cellValue(this.tags.indexOf("长度"), r));
          let width = parseInt(cellValue(this.tags.indexOf("宽度"), r));
          let spare = parseInt(cellValue(this.tags.indexOf("备品"), r));
          if (isNaN(spare)) spare = 0;
          let area = fomula.area(length, width).toFixed(6);
          let orderArea = area * num;
          let sparesArea = area * spare;
          let product_area = fomula.productArea(orderArea, sparesArea);
          row = {
            com_order: cellValue(this.tags.indexOf("序号"), r),
            type: cellValue(this.tags.indexOf("型号"), r),
            length: cellValue(this.tags.indexOf("长度"), r),
            width: cellValue(this.tags.indexOf("宽度"), r),
            num: num.toString(),
            cut_length: cellValue(this.tags.indexOf("剪长度"), r),
            cut_width: cellValue(this.tags.indexOf("剪宽度"), r),
            count: cellValue(this.tags.indexOf("计数"), r),
            spare: cellValue(this.tags.indexOf("备品"), r),
            full_length: cellValue(this.tags.indexOf("总长度"), r),
            order_area: orderArea.toString(),
            product_area: product_area.toString(),
            house_type: cellValue(this.tags.indexOf("户型"), r),
            position: cellValue(this.tags.indexOf("位置"), r),
            box: mark,
            work_num: this.selectedData.workNum,
            form_type: type,
            complete: 0,
          };
        }

        rows.push(row);
      }

      return rows;
    },
    _setPulledSheet(rows, set_num, type) {
      let celldata = [];

      let tags = this.tags;
      let len_c = tags.indexOf("长度");
      let wid_c = tags.indexOf("宽度");
      let num_c = tags.indexOf("数量");
      // let count_c = tags.indexOf("计数");
      let box_c = tags.indexOf("箱号");
      let spareNum_c = tags.indexOf("备品");
      let orderArea_c = tags.indexOf("下单面积");
      let productArea_c = tags.indexOf("生产面积");

      function getExactInt(obj) {
        if (obj == null || obj == undefined) return 0;
        if (obj?.v?.v == undefined) return 0;
        let res = parseInt(obj.v.v);
        if (isNaN(res)) return 0;
        return res;
      }

      function getExactFloat(obj) {
        if (obj == null || obj == undefined) return 0;
        if (obj?.v?.v == undefined) return 0;
        return parseFloat(obj.v.v).toFixed(6);
      }

      function getExactString(obj) {
        if (obj == null || obj == undefined) return "";
        if (obj?.v?.v == undefined) return "";
        let res = obj.v.v.toString();
        return res;
      }

      function multSetNum(celldata) {
        let rowNum = Math.max(
            ...celldata.filter((x) => x.c == 0).map((x) => x.r)
        );
        let rows = [];
        for (let r = 1; r <= rowNum; ++r) {
          let rowdata = celldata.filter((x) => x.r === r);
          rows.push(rowdata);
        }
        rows.forEach((row) => {
          if (getExactString(row.find((x) => x.c == box_c)) != "0") {
            let num = getExactInt(row.find((x) => x.c == num_c));
            if (type != 1) num = num * set_num;
            let len = getExactInt(row.find((x) => x.c == len_c));
            let width = getExactInt(row.find((x) => x.c == wid_c));
            let spareNum = getExactInt(row.find((x) => x.c == spareNum_c));
            let area = fomula.area(len, width);
            let orderArea = (area * num).toFixed(6);
            let sparesArea = (area * spareNum).toFixed(6);
            let productArea = fomula
                .productArea(orderArea, sparesArea)
                .toFixed(6);
            let temp = row.find((x) => x.c == num_c);
            if (getExactInt(temp) != 0) {
              temp.v.v = num;
              temp.v.m = num.toString();
            }
            temp = row.find((x) => x.c == orderArea_c);
            if (getExactFloat(temp) != 0) {
              temp.v.v = orderArea;
              temp.v.m = orderArea.toString();
            }
            temp = row.find((x) => x.c == productArea_c);
            if (getExactFloat(temp) != 0) {
              temp.v.v = productArea;
              temp.v.m = productArea.toString();
            }
          }
        });
        let res = [];
        rows.forEach((row) => {
          res.push(...row);
        });
        return res;
      }

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
              c: this.tags.indexOf(map[key]),
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

      return multSetNum(celldata);
      // this.$refs.excel.draw(celldata);
      // this.sheetChange(this.$refs.excel.getSheetCelldata());
    },
  },
};
</script>

<style>
.grid-content {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
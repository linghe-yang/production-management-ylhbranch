<template>
  <div>
    <el-container>
      <el-header style="height: max-content">
        <span>
          生产单号
          <el-input
            size="mini"
            v-model="selectedData.work_num"
            placeholder="请输入"
            style="width: 150px; margin-left: 10px"
          ></el-input>
        </span>
        <span>
          日期
          <el-date-picker
            v-model="selectedData.date"
            type="date"
            size="mini"
            placeholder="选择日期"
            style="width: 150px; margin-left: 20px"
          >
          </el-date-picker>
        </span>
        <span>
          工人
          <el-select
            multiple
            v-model="selectedData.staff_name"
            placeholder="请选择"
            size="mini"
            @visible-change="getStaff"
          >
            <el-option
              v-for="item in staffList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </span>
        <span>
          岗位
          <el-select
            style="width: 120px; margin-left: 20px"
            v-model="selectedData.post"
            placeholder="请选择"
            size="mini"
            @visible-change="getPost"
          >
            <el-option
              v-for="item in postList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </span>
        <span>
          <el-button @click="query" :disabled="activeName != '0'">
            查询
          </el-button>
          <el-button
            @click="confirmAdd"
            plain
            type="primary"
            :disabled="activeName == '3'"
          >
            加入
          </el-button>
        </span>
      </el-header>
      <el-container>
        <div style="width: 200px; background-color: rgb(198, 206, 217)">
          <div
            style="
              margin: 10px;
              background-color: white;
              padding-left: 30px;
              min-height: 300px;
              border-radius: 5px;
            "
            v-if="activeName == '0'"
          >
            <el-row>按箱号选中</el-row>
            <div style="margin: 10px 0"></div>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <div style="margin: 15px 0"></div>
            <el-checkbox-group
              size="mini"
              v-model="selectedBoxs"
              @change="handleCheckedBoxsChange"
            >
              <el-checkbox v-for="item in boxs" :label="item" :key="item">{{
                item
              }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <el-main>
          <div style="height: 100px">
            <el-tabs v-model="activeName">
              <el-tab-pane label="岗位数据录入" name="0">
                <span>
                  变更录入的套数(共{{ total_set_num }}套)
                  <el-input
                    size="mini"
                    v-model="set_num"
                    type="number"
                    placeholder="请输入"
                    style="width: 100px; margin-left: 10px"
                  ></el-input>
                </span>
              </el-tab-pane>
              <el-tab-pane label="备品数据录入" name="1"></el-tab-pane>
              <el-tab-pane label="增补数据录入" name="2">
                <div style="height: 100px">
                  <el-row>
                    <el-col :span="4">
                      <span>
                        长度
                        <el-input
                          size="mini"
                          v-model="supple.length"
                          placeholder="请输入"
                          style="width: 100px; margin-left: 10px"
                        ></el-input>
                      </span>
                    </el-col>
                    <el-col :span="4">
                      <span>
                        宽度
                        <el-input
                          size="mini"
                          v-model="supple.width"
                          placeholder="请输入"
                          style="width: 100px; margin-left: 10px"
                        ></el-input>
                      </span>
                    </el-col>
                    <el-col :span="3">
                      <span>
                        数量
                        <el-input
                          size="mini"
                          v-model="supple.num"
                          placeholder="请输入"
                          style="width: 100px; margin-left: 10px"
                        ></el-input>
                      </span>
                    </el-col>
                    <el-col :span="3">
                      <span>
                        <el-button @click="addSupple"> 添加 </el-button>
                      </span>
                    </el-col>
                  </el-row>
                </div>
              </el-tab-pane>
              <el-tab-pane label="其他工作录入" name="3">
                <div style="height: 100px">
                  <el-row>
                    <el-col :span="10">
                      <span>
                        备注
                        <el-input
                          size="mini"
                          v-model="other"
                          placeholder="请输入"
                          style="width: 300px; margin-left: 10px"
                        ></el-input>
                      </span>
                    </el-col>
                    <el-col :span="3">
                      <span>
                        <el-button @click="addOther" plain type="primary">
                          添加
                        </el-button>
                      </span>
                    </el-col>
                  </el-row>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>

          <Excel
            v-show="activeName != '3'"
            @cellupdatebefore="cellUpdateBefore"
            @celleditbefore="isEditing = true"
            :value="storage[parseInt(activeName)]"
            ref="excel"
            height="650"
          ></Excel>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
    
<script>
import Excel from "@/components/DealExcel.vue";
import initSheets from "@/assets/initSheets";
import fomula from "@/utils/fomula";
import util from "@/utils/util";
const tags = [
  "单号",
  "序号",
  "箱号",
  "长度",
  "宽度",
  "计数",
  "数量",
  "备品",
  "总长度",
  "下单面积",
  "生产面积",
  "id(请勿做任何更改！！)",
  "已生产套数",
  "总套数",
  "原始单据"
];
const spareTags = ["长度", "宽度", "数量", "面积"];
var locker = false;
export default {
  name: "Vue-ItemEnter",
  components: {
    Excel,
  },
  props: {},
  watch: {
    activeName(newValue, oldValue) {
      // 当顶部tag切换时，将旧tag对应的excel中的sheet存到storage对应位置，以用在返回此tag时渲染，和报表时递交数据
      try {
        newValue = parseInt(newValue);
        oldValue = parseInt(oldValue);
        this.storage[oldValue] = this.$refs.excel.getAllSheets();
        if (this.storage[newValue] !== null) {
          this.$refs.excel.setNewSheets(this.storage[newValue]);
          if (newValue == 1) this._setSpareData();
        }
      } catch (err) {
        this.$message.error(err);
      }
    },
  },
  data() {
    return {
      isEditing: false,
      storage: [
        [initSheets.getPOItemEntrySheet()],
        [initSheets.getPOItemEntrySpare()],
        [initSheets.getPOItemEntrySpare()],
      ],
      activeName: "0",
      checkList: ["0"],
      selectedData: {
        work_num: "",
        date: new Date(),
        staff_name: [],
        post: "",
      },
      supple: {
        length: "",
        width: "",
        num: "",
      },
      other: "",
      set_num: 1,
      total_set_num: 0,
      boxs: [],
      selectedBoxs: [],
      checkAll: false,
      isIndeterminate: true,
      staffList: [],
      postList: [],
    };
  },
  mounted() {
    window.document.title = "工作量录入";
  },

  methods: {
    cellUpdateBefore(r, c, v) {
      //当用户编辑单元格，更新前触发
      try {
        if (this.isEditing) {
          if (r == 0) {
            // 编辑的是0行，即标签行// 还原为编辑前数据
            if (this.activeName == "0") {
              this.$refs.excel.setCellValueNextTick(r, c, tags[c]);
            } else {
              this.$refs.excel.setCellValueNextTick(r, c, spareTags[c]);
            }

            return;
          } else {
            if (this.activeName == "1" || this.activeName == "2") {
              let num_c = spareTags.indexOf("数量");
              if (c == num_c) {
                if (isNaN(parseInt(v))) {
                  let origin_num = this.$refs.excel.getCellValue(r, num_c);
                  this.$refs.excel.setCellValueNextTick(r, c, origin_num);
                } else {
                  let length_c = spareTags.indexOf("长度");
                  let width_c = spareTags.indexOf("宽度");
                  let area_c = spareTags.indexOf("面积");
                  let length = this.$refs.excel.getCellValue(r, length_c);
                  let width = this.$refs.excel.getCellValue(r, width_c);
                  let area = (fomula.area(parseInt(length),parseInt(width)) * parseInt(v)).toFixed(6)
                  this.$refs.excel.setCellValue(r, area_c, area);

                }
              }

            }
          }
        }
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.isEditing = false;
      }
    },
    handleCheckAllChange(val) {
      if (val) {
        //全选
        this._setSelectRange(this.boxs);
      } else {
        //全不选
        this._setSelectRange([]);
      }
      this.selectedBoxs = val ? this.boxs : [];
      this.isIndeterminate = false;
    },
    handleCheckedBoxsChange(value) {
      this._setSelectRange(value, () => {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.boxs.length;
        this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.boxs.length;
      });
    },
    getStaff() {
      this.$API.reqGetAllStaff().then((response) => {
        if (response.data != undefined) {
          let staffList = response.data.map((x) => {
            return { label: x.name, value: x.name };
          });
          this.staffList = staffList;
        }
      });
    },
    getPost() {
      this.$API.reqGetAllJob().then((response) => {
        if (response.data != undefined) {
          let postList = response.data.map((x) => {
            return { label: x.name, value: x.name };
          });
          this.postList = postList;
        }
      });
    },
    query() {
      if (this.selectedData.work_num == "") {
        this.$message.error("请输入生产单号");
        return;
      } else if (this.selectedData.post == "") {
        this.$message.error("请选择岗位");
        return;
      }
      let form_type = 2;
      if (this.selectedData.post == "焊接") form_type = 4;
      else if (this.selectedData.post == "整理") form_type = 3;
      this.$API
        .reqGetProductNotice({ work_num: this.selectedData.work_num })
        .then((res) => {
          if (res != undefined && res.data != null) {
            this.total_set_num = parseInt(res.data.set_num);
            if (form_type == 2) {
              this.$API
                .reqGetReport({
                  work_num: this.selectedData.work_num,
                  form_type: 2
                })
                .then((res) => {
                  if (res != undefined && res.data.length != 0) {
                    let sh = initSheets.getPOItemEntrySheet();
                    sh.celldata.push(...this._setPulledSheet(res.data,2));
                    this.storage[0] = [sh];
                    this.$refs.excel.setNewSheets(this.storage[0]);
                    this._boxMarkStatistic();
                  } else {
                    this.$message.error("未找到单据");
                    return;
                  }
                });
            } else {
              this.$API
                .reqGetReport({
                  work_num: this.selectedData.work_num,
                  form_type: 4,
                })
                .then((res) => {
                  if (res != undefined && res.data.length != 0) {
                    
                    let sh = initSheets.getPOItemEntrySheet();
                    sh.celldata.push(...this._setPulledSheet(res.data,4));
                    this.storage[0] = [sh];
                    this.$refs.excel.setNewSheets(this.storage[0]);
                    this._boxMarkStatistic();
                  } else {
                    this.$API
                      .reqGetReport({
                        work_num: this.selectedData.work_num,
                        form_type: 3
                      })
                      .then((res) => {
                        if (res != undefined && res.data.length != 0) {
                          let sh = initSheets.getPOItemEntrySheet();
                          sh.celldata.push(...this._setPulledSheet(res.data,3));
                          this.storage[0] = [sh];
                          this.$refs.excel.setNewSheets(this.storage[0]);
                          this._boxMarkStatistic();
                        } else {
                          this.$message.error("未找到单据");
                          return;
                        }
                      });
                  }
                });
            }
          } else {
            this.$message.error("未找到单据");
            return;
          }
        });
    },
    addSupple() {
      if (
        this.supple.length == "" ||
        this.supple.width == "" ||
        this.supple.num == ""
      ) {
        this.$message.error("增补的数据不全");
        return;
      }
      let celldata = this.$refs.excel.getSheetCelldata();
      let max_r = Math.max(...celldata.map((obj) => obj.r));
      var map = {
        length: "长度",
        width: "宽度",
        num: "数量",
        area: "面积",
      };
      let e = {};
      e.length = this.supple.length;
      e.width = this.supple.width;
      e.num = this.supple.num;
      e.area = (fomula.area(e.length, e.width) * e.num).toFixed(6);

      Object.keys(map).forEach((key) => {
        celldata.push({
          r: max_r + 1,
          c: spareTags.indexOf(map[key]),
          v: e[key],
        });
      });
      this.$refs.excel.draw(celldata);
    },
    addOther() {
      if (this.selectedData.staff_name.length == 0) {
        this.$message.error("请选择工人");
        return;
      } else if (this.other == "") {
        this.$message.error("请输入备注");
        return;
      } else if (this.selectedData.date == null) {
        this.$message.error("请输入日期");
        return;
      }
      this.$confirm("是否确认加入?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (locker) {
            this.$message.error("操作过于频繁");
            return;
          }
          locker = true;

          this.$API
            .reqEnterOddJobs({
              date: util.formatDate(this.selectedData.date, "ymd"),
              stuff_name: this.selectedData.staff_name.join(","),
              other: this.other,
            })
            .then((res) => {
              if (res.code) {
                this.$message.success("录入备注成功");
              }
            })
            .finally(() => {
              locker = false;
            });
        })
        .catch(() => {
          locker = false;
        });
    },
    confirmAdd() {
      try {
        let rows = this.$refs.excel.getRangeRowArray();
        let order_c = 0;
        if (!this.$refs.excel.getCellValue(Math.max(...rows), order_c)) {
          throw Error("选区超出界限");
        }
        if (rows.filter((x) => x == 0).length !== 0) {
          throw Error("请先框选要加入的项");
        }
        if (this.selectedData.staff_name.length == 0) {
          throw Error("请输入工人");
        }
        if (this.selectedData.post == "") {
          throw Error("请输入岗位");
        }
        this.$confirm("是否确认加入?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            if (locker) {
              this.$message.error("操作过于频繁");
              return;
            }
            locker = true;
            let celldata = this.$refs.excel.getSheetCelldata();
            let max_row = Math.max(...celldata.map((obj) => obj.r));
            let row0 = celldata.filter((x) => x.r == 0);
            let rowNot0 = celldata.filter((x) => {
              return rows.indexOf(x.r) !== -1;
            });
            let map = null;
            if (this.activeName == "0") {
              map = {
                work_num: "单号",
                com_order: "序号",
                box: "箱号",
                length: "长度",
                width: "宽度",
                count: "计数",
                num: "数量",
                spare: "备品",
                full_length: "总长度",
                order_area: "下单面积",
                product_area: "生产面积",
                id: "id(请勿做任何更改！！)",
                set_num: "已生产套数",
                total_set_num: "总套数",
                sheet_type: "原始单据"
              };
            } else {
              map = {
                length: "长度",
                width: "宽度",
                num: "数量",
                order_area: "面积",
                product_area: "面积",
              };
            }
            let res = this._packRow(rowNot0, row0, rows, map);

            let template = {
              work_num: "",
              com_order: "",
              plan_date: util.formatDate(this.selectedData.date, "ymd"),
              staff_name: this.selectedData.staff_name,
              staff_job: this.selectedData.post,
              box: "",
              length: "",
              width: "",
              num: "",
              spare: "",
              full_length: "",
              order_area: "",
              product_area: "",
              id: "",
              set_num: "",
              total_set_num: "",
              sheet_type:""
            };
            let message = [];
            try {
              res.forEach((row) => {
                if (
                  row?.set_num == undefined &&
                  row?.total_set_num == undefined
                ) {
                  row.set_num = 1;
                  row.total_set_num = 1;
                } else {
                  // if (
                  //   parseInt(row.set_num) + parseInt(this.set_num) >
                  //   parseInt(row.total_set_num)
                  // )
                  //   throw "录入失败：录入套数超过总套数";
                  // row.set_num = parseInt(row.set_num) + parseInt(this.set_num);
                  row.set_num = parseInt(this.set_num);
                }

                let obj = util.cloneDeep(template);
                Object.keys(obj).forEach((key) => {
                  if (key in row) {
                    obj[key] = row[key];
                  }
                });
                if (
                  row?.set_num != undefined &&
                  row?.box != undefined &&
                  toString(row.box) != "0"
                ) {
                  obj.num = parseInt(obj.set_num) * parseInt(obj.num);
                  obj.product_area =
                    parseInt(obj.set_num) * parseFloat(obj.product_area);
                  if (!isNaN(parseFloat(obj.order_area))) {
                    obj.order_area =
                      parseInt(obj.set_num) * parseFloat(obj.order_area);
                  }
                }
                message.push(obj);
              });
            } catch (e) {
              this.$message.error(e);
              locker = false;
              return;
            }

            /* 创建一个广播通道 */
            const channelObj = new BroadcastChannel("productOutputChannel");
            // 发送消息
            channelObj.postMessage(message);
            if (this.activeName == "0") {
              let unchanged = celldata.filter((x) => {
                return rows.indexOf(x.r) == -1;
              });

              let dataToSet = this._rewriteRows(unchanged, max_row);
              // dataToSet = dataToSet.concat(row0)
              this.$refs.excel.replaceContent(dataToSet);
              // this._setSelectRange([]);
              // this.selectedBoxs = [];
            }
            this.$message.success("加入成功，请在生产单录入页面查看");

            locker = false;
          })
          .catch(() => {
            locker = false;
          });
      } catch (err) {
        this.$message.error(err);
      }
    },
    _packRow(celldata, row0, rows, map) {
      let res = [];
      rows.forEach((r) => {
        let row = celldata.filter((x) => x.r == r);
        let obj = util.cloneDeep(map);
        Object.keys(obj).forEach((key) => {
          let s = row0.find((x) => x.v.v == obj[key]);
          if (s != undefined) {
            let toSet = row.find((x) => x.c == s.c);
            if (toSet != undefined) {
              obj[key] = toSet.v.v;
            } else {
              obj[key] = "";
            }
          }
        });
        res.push(obj);
      });
      return res;
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
    _boxMarkStatistic() {
      let box_c = tags.indexOf("箱号");
      let col = this.$refs.excel.getColumn(box_c, 1);
      let uniqueSet = new Set();
      col.forEach((e) => {
        let res = e.v.v.toString();
        if (res.trim() !== "") uniqueSet.add(res);
      });
      let boxs = Array.from(uniqueSet);
      const order = "0ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      boxs.sort((a, b) => order.indexOf(a) - order.indexOf(b));
      this.boxs = boxs;
      this.selectedBoxs = []
    },
    _setSelectRange(arr, func = () => {}) {
      // 箱号数组
      let box_c = tags.indexOf("箱号");
      let col = this.$refs.excel.getColumn(box_c, 1);
      let rows = [];
      col.forEach((e) => {
        if (arr.indexOf(e.v.v.toString()) !== -1) {
          rows.push(e.r);
        }
      });
      if (rows.length == 0) {
        this.$refs.excel.setRangeShow("A1:A1", func);
        return;
      }
      let range = [];
      rows.forEach((e) => {
        range.push({
          row: [e, e],
          column: [0, tags.length - 1],
        });
      });
      this.$refs.excel.setRangeShow(range, func);
    },
    _setPulledSheet(rows,form_type) {
      let celldata = [];
      var map = {
        work_num: "单号",
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
        id: "id(请勿做任何更改！！)",
        complete: "已生产套数",
      };
      let r = 1;
      rows.forEach((e) => {
        Object.keys(map).forEach((key) => {
          if (key in e) {
            if (key == "box") {
              e[key] = e[key].toString();
            }
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
        let tsn = this.total_set_num;
        if (e["box"].toString() == "0") {
          tsn = 1;
        }
        celldata.push({
          r: r,
          c: tags.indexOf("总套数"),
          v: {
            ct: {
              fa: "General",
              t: "g",
            },
            m: tsn,
            v: tsn,
          },
        });
        let sheet_type = ""
        if(form_type == 2) sheet_type = "正常"
        else if(form_type == 3) sheet_type = "降序"
        else if(form_type == 4) sheet_type = "减半片"
        celldata.push({
          r: r,
          c: tags.indexOf("原始单据"),
          v: {
            ct: {
              fa: "General",
              t: "g",
            },
            m: sheet_type,
            v: sheet_type,
          },
        });

        ++r;
      });

      return celldata;
      // this.$refs.excel.draw(celldata);
      // this.sheetChange(this.$refs.excel.getSheetCelldata());
    },
    _setSpareData() {
      this.$API.reqGetAllSpareSpecs().then((res) => {
        if (res.data.length != 0) {
          let celldata = [];
          var map = {
            length: "长度",
            width: "宽度",
            num: "数量",
            area: "面积",
          };
          res.data.forEach((e, i) => {
            e.area = fomula.area(e.length, e.width).toFixed(6);
            e.num = "";
            Object.keys(map).forEach((key) => {
              celldata.push({
                r: i + 1,
                c: spareTags.indexOf(map[key]),
                v: e[key],
              });
            });
          });

          let sh = initSheets.getPOItemEntrySpare();
          sh.celldata.push(...celldata);
          this.storage[1] = [sh];
          this.$refs.excel.setNewSheets(this.storage[1]);
          // this._boxMarkStatistic()
          // this.activeName = "0";
          // this.sheetChange(sh.celldata);
        } else {
          this.$message.error("未找到备品数据");
        }
      });
    },
  },
};
</script>
    
<style scoped>
.el-checkbox-group {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
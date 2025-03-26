<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            合同号(生产单号)
            <el-input
              size="mini"
              v-model="selectedData.workNum"
              placeholder="请输入"
              style="width: 240px; margin-left: 30px"
            ></el-input>
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <span class="input-span">
            日期
            <el-date-picker
              v-model="selectedData.date"
              type="date"
              size="mini"
              placeholder="选择日期"
              style="width: 150px; margin-left: 30px"
            >
            </el-date-picker>
          </span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            项目名称
            <el-select
              v-model="selectedData.projectName"
              placeholder="请选择"
              size="mini"
              filterable
              :filter-method="projectFilter"
              style="margin-left: 30px"
              @visible-change="getProjects"
            >
              <el-option
                v-for="item in projectNameList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
            <el-button @click="onClick('project')" size="small">项目</el-button>
          </span>
        </div>
      </el-col>
      <!-- <el-col :span="6"
        ><div class="grid-content bg-purple">
          <span class="input-span">
            工作号
            <el-input
              size="mini"
              v-model="selectedData.workNum"
              placeholder="0000"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span></div
      ></el-col> -->
    </el-row>
    <el-row>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <span class="input-span">
            品名
            <el-input
              size="mini"
              v-model="selectedData.itemName"
              placeholder="请输入"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            下达日期
            <el-date-picker
              v-model="selectedData.orderDate"
              type="date"
              size="mini"
              placeholder="选择日期"
              style="width: 150px; margin-left: 30px"
            >
            </el-date-picker>
          </span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span class="input-span">
            套数
            <el-input
              size="mini"
              v-model="temp_setnum"
              placeholder="请输入"
              style="width: 150px; margin-left: 30px"
              @blur="setNumBlur"
            ></el-input>
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            总长度
            <el-input
              size="mini"
              v-model="selectedData.fullLength"
              placeholder="请输入"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <span class="input-span">
            生产片数
            <el-input
              size="mini"
              v-model="selectedData.pieceNum"
              placeholder="请输入"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <span class="input-span">
            整理要求
            <el-select
              v-model="selectedData.organRequire"
              placeholder="请选择"
              size="mini"
              style="margin-left: 30px; width: 400px"
            >
              <el-option
                v-for="item in organRequireList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span class="input-span">
            总片数
            <el-input
              size="mini"
              v-model="selectedData.fullPieceNum"
              placeholder="请输入"
              style="width: 150px; margin-left: 10px"
            ></el-input>
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            总面积
            <el-input
              size="mini"
              v-model="selectedData.fullArea"
              placeholder="请输入"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <span class="input-span">
            生产面积
            <el-input
              size="mini"
              v-model="selectedData.productArea"
              placeholder="请输入"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            检测报告份数
            <el-input
              size="mini"
              v-model="selectedData.checkReportNum"
              placeholder="请输入"
              style="width: 150px; margin-left: 5px"
            ></el-input>
          </span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span class="input-span">
            合格证个数
            <el-input
              size="mini"
              v-model="selectedData.credentialNum"
              placeholder="请输入"
              style="width: 120px; margin-left: 10px"
            ></el-input>
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            签回单份数
            <el-input
              size="mini"
              v-model="selectedData.receiptNum"
              placeholder="请输入"
              style="width: 120px; margin-left: 10px"
            ></el-input>
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <span class="input-span">
            其他
            <el-input
              size="mini"
              v-model="selectedData.other"
              placeholder="请输入"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <span class="input-span">
            包装要求
            <el-select
              v-model="selectedData.packDemand"
              placeholder="请选择"
              size="mini"
              style="margin-left: 10px"
            >
              <el-option
                v-for="item in packDemandList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            整理方向
            <el-select
              v-model="selectedData.orientation"
              placeholder="请选择"
              size="mini"
              style="margin-left: 10px"
            >
              <el-option
                v-for="item in orientationList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <span class="input-span">
            下单时间
            <el-input
              size="mini"
              v-model="selectedData.orderTime"
              placeholder="请输入"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            客户名称
            <el-select
              v-model="selectedData.customerName"
              placeholder="请选择"
              size="mini"
              style="width: 300px; margin-left: 10px"
              @change="onSelectCustomer"
              @visible-change="getCustomers"
            >
              <el-option
                v-for="item in customerNameList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
            <el-button @click="onClick('customer')" size="small"
              >客户</el-button
            >
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">
        <div class="grid-content bg-purple-light">
          <span class="input-span">
            快递公司
            <el-input
              size="mini"
              v-model="selectedData.expressCompany"
              placeholder="请输入"
              style="width: 150px; margin-left: 30px"
            ></el-input>
            <!-- <el-select
              v-model="selectedData.expressCompany"
              placeholder="请选择"
              size="mini"
              style="margin-left: 10px"
            >
              <el-option
                v-for="item in expressCompanyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
          </span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <span class="input-span">
            单号
            <el-input
              size="mini"
              v-model="selectedData.expressNum"
              placeholder="请输入"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
  
<script>
import { mapState } from "vuex";

export default {
  name: "Vue-NoticeEnter",
  components: {
    // Excel,
  },
  props: {},
  watch:{
    "selectedData.setNum":{
      handler(n){
        this.temp_setnum = parseInt(n)
      }
    }
  },
  data() {
    return {
      drawer: false,
      drawerTitle: null,
      temp_setnum: 1,
      // selectedData: {
      //   contractNum: null,
      //   date: new Date(),
      //   projectName: null,
      //   workNum: null,
      //   itemName: null,
      //   orderDate: new Date(),
      //   setNum: null,
      //   fullLength: null,
      //   pieceNum: null,
      //   organRequire: null,
      //   fullPieceNum: null,
      //   fullArea: null,
      //   productArea: null,
      //   checkReportNum: null,
      //   credentialNum: null,
      //   receiptNum: null,
      //   other: null,
      //   packDemand: null,
      //   orientation: null,
      //   orderTime: null,
      //   customerName: null,
      //   expressCompany: null,
      //   expressNum: null,
      // },
      projectNameList: [],
      organRequireList: [],
      packDemandList: [],
      orientationList: [],
      customerNameList: [],
      expressCompanyList: [
        {
          value: "选项1",
          label: "公司1",
        },
        {
          value: "选项2",
          label: "公司2",
        },
        {
          value: "选项3",
          label: "公司3",
        },
      ],
    };
  },
  computed: {
    ...mapState("module_noticeEnter", ["selectedData","storage"]),
  },
  mounted() {
    let date = new Date();
    this.selectedData.orderTime =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    // this.temp_setnum = parseInt(this.selectedData.setNum);
    // this.$API.reqGetProject().then((response) => {
    //   let res = JSON.parse(JSON.stringify(response.data));
    //   console.log(res)
    // });
    // this.$API.reqGetCustomer().then((response) => {
    //   let res = JSON.parse(JSON.stringify(response.data));
    //   console.log(res)
    // });
  },

  methods: {
    setNumBlur() {
      let res = parseInt(this.temp_setnum);
      let orin = parseInt(this.selectedData.setNum);
      if (isNaN(res) || res < 0) {
        this.temp_setnum = orin;
        return;
      }
      let mult = res / orin;
      // this.selectedData.fullPieceNum *= mult;
      // this.selectedData.fullArea *= mult;
      this.selectedData.setNum = res;
      
      if(mult !== 1){
        this.$emit("setnumchange",mult)
      }

    },
    onClick(e) {
      let path;
      if (e === "customer") path = "/Detail/base/1-4";
      if (e === "project") path = "/Detail/base/1-5";
      let routeData = this.$router.resolve({
        path: path,
      });
      window.open(routeData.href, "newPage");
    },
    handleClose() {
      this.drawer = false;
    },
    onSelectCustomer(e) {
      e = this.customerNameList.find((x) => x.label == e).value;
      this.$API.reqGetCustPacReq({ id: e }).then((response) => {
        let res = JSON.parse(JSON.stringify(response.data));
        this.packDemandList = res.map((x) => {
          return {
            value: x.num,
            label: x.demand,
          };
        });
      });
      this.$API.reqGetCustOrderReq({ id: e }).then((response) => {
        let res = JSON.parse(JSON.stringify(response.data));
        this.organRequireList = res.map((x) => {
          return {
            value: x.num,
            label: x.demand,
          };
        });
      });
      this.$API.reqGetCustDire({ id: e }).then((response) => {
        let res = JSON.parse(JSON.stringify(response.data));
        this.orientationList = res.map((x) => {
          return {
            value: x.num,
            label: x.demand,
          };
        });
      });
    },
    getCustomers() {
      this.$API.reqGetAllCustomer().then((response) => {
        let res = JSON.parse(JSON.stringify(response.data));
        this.customerNameList = res.map((x) => {
          return {
            value: x.id,
            label: x.name,
          };
        });
      });
    },
    getProjects() {
      this.$API.reqGetAllProject().then((response) => {
        let res = JSON.parse(JSON.stringify(response.data));
        this.projectNameList = res.map((x) => {
          return {
            value: x.id,
            label: x.name,
          };
        });
      });
    },
    projectFilter(e) {
      this.selectedData.projectName = e;
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
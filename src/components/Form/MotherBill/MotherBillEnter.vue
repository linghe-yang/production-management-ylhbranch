<template>
  <div>
    <el-row>
      <el-col :span="4"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            母单号
            <el-input
              size="mini"
              v-model="selectedData.MBNum"
              placeholder="请输入"
              style="width: 150px; margin-left: 10px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple">
          <span class="input-span">
            日期
            <el-date-picker
              v-model="selectedData.date"
              type="date"
              size="mini"
              placeholder="选择日期"
              style="width: 160px; margin-left: 20px"
            >
            </el-date-picker>
          </span></div
      ></el-col>
      <el-col :span="8"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            客户名称
            <el-select
              v-model="selectedData.customerName"
              placeholder="请选择"
              size="mini"
              style="margin-left: 30px"
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
            <el-button @click="onClick('customer')" size="small">客户</el-button>
          </span>
        </div></el-col
      >
      <el-col :span="4"
        ><div class="grid-content bg-purple">
          <span class="input-span">
            户型
            <el-input
              size="mini"
              v-model="selectedData.houseType"
              placeholder="请输入"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span></div
      ></el-col>
      <!-- <el-col :span="4"
        ><div class="grid-content bg-purple">
          <span class="input-span">
            单号
            <el-input
              size="mini"
              v-model="selectedData.noticeNum"
              placeholder="请输入"
              style="width: 150px; margin-left: 30px"
            ></el-input>
          </span></div
      ></el-col> -->
    </el-row>
    <el-row>
      <el-col :span="10"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            项目名称
            <el-select
              v-model="selectedData.projectName"
              placeholder="请选择"
              size="mini"
              filterable 
              :filter-method="projectFilter"
              style="margin-left: 10px; width: 320px"
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
          </span></div
      ></el-col>
      <el-col :span="6"
        ><div class="grid-content bg-purple">
          <span class="input-span">
            套数
            <el-input
              size="mini"
              v-model="temp_setnum"
              placeholder="请输入"
              style="width: 150px; margin-left: 30px"
              @blur="setNumBlur"
            ></el-input>
            <el-button disabled size="small">倍增明细</el-button>
          </span></div
      ></el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            总长度
            <el-input
              size="mini"
              v-model="selectedData.fullLength"
              placeholder="请输入"
              style="width: 120px; margin-left: 10px"
            ></el-input>
            
          </span>
        </div></el-col
      >
      <el-col :span="4"
        ><div class="grid-content bg-purple">
          <span class="input-span">
            生产片数
            <el-input
              size="mini"
              v-model="selectedData.pieceNum"
              placeholder="请输入"
              style="width: 120px; margin-left: 10px"
            ></el-input>
          </span></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="16"
        ><div class="grid-content bg-purple">
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
          </span></div
      ></el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            总面积
            <el-input
              size="mini"
              v-model="selectedData.fullArea"
              placeholder="请输入"
              style="width: 120px; margin-left: 10px"
            ></el-input>
          </span></div
      ></el-col>
      <el-col :span="4"
        ><div class="grid-content bg-purple">
          <span class="input-span">
            生产面积
            <el-input
              size="mini"
              v-model="selectedData.productArea"
              placeholder="请输入"
              style="width: 120px; margin-left: 10px"
            ></el-input>
          </span></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="6"
        ><div class="grid-content bg-purple">
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
          </span></div
      ></el-col>
      <el-col :span="10"
        ><div class="grid-content bg-purple-light">
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
          </span></div
      ></el-col>

      <el-col :span="8"
        ><div class="grid-content bg-purple-light">
          <span class="input-span">
            总片数
            <el-input
              size="mini"
              v-model="selectedData.fullPieceNum"
              placeholder="请输入"
              style="width: 120px; margin-left: 10px"
            ></el-input>
          </span>
        </div></el-col
      >
    </el-row>
    <!-- <Excel :height="'200px'"></Excel> -->
    <!-- <slot></slot>
    <el-row>
      <el-col :span="6"><el-button>读取excel数据</el-button></el-col>
      <el-col :span="18"
        ><el-button>新增单据</el-button>
        <el-button>保存单据</el-button>
        <el-button>修改单据</el-button>
        <el-button>删除单据</el-button>
        <el-button>分箱</el-button>
        <el-button>保存列宽</el-button></el-col
      >
    </el-row> -->
  </div>
</template>
  
  <script>
import { mapState } from 'vuex';
// import Excel from "@/components/Form/DealExcel.vue";
export default {
  name: "Vue-MotherBillEnter",
  components: {
    // Excel,
  },
  props: {},
  data() {
    return {
      drawer: false,
      drawerTitle: null,
      temp_setnum: 1,
      customerNameList: [
      ],
      projectNameList: [
      ],
      organRequireList:[
      ],
      packDemandList: [
      ],
      orientationList: [
      ],
    };
  },
  watch:{
    "selectedData.setNum":{
      handler(n){
        this.temp_setnum = parseInt(n)
      }
    }
  },
  computed:{
    ...mapState('module_motherBillEnter',['selectedData'])
  
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

    handleClose() {
      this.drawer = false;
    },
    onClick(e) {
      let path;
      if (e === "customer") path = "/Detail/base/1-4"
      if (e === "project") path = "/Detail/base/1-5"
      let routeData = this.$router.resolve({
        path: path
      });
      window.open(routeData.href, "newPage");
    },

    projectFilter(e){
      this.selectedData.projectName = e
    },
    onSelectCustomer(e) {
      e = this.customerNameList.find(x=>x.label == e).value
      this.$API.reqGetCustPacReq({id:e}).then((response) => {
        let res = JSON.parse(JSON.stringify(response.data));
        this.packDemandList = res.map((x) => {
          return {
            value: x.num,
            label: x.demand,
          };
        });
      });
      this.$API.reqGetCustOrderReq({id:e}).then((response) => {
        let res = JSON.parse(JSON.stringify(response.data));
        this.organRequireList = res.map((x) => {
          return {
            value: x.num,
            label: x.demand,
          };
        });
      });
      this.$API.reqGetCustDire({id:e}).then((response) => {
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
    getProjects(){
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
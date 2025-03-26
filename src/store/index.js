import Vue from "vue";
import Vuex from "vuex";
import initSheets from "@/assets/initSheets";

//通知单录入模块
const module_noticeEnter = {
  namespaced: true,
  state: {
    selectedData: {
      contractNum: null, //合同号
      date: new Date(), //日期
      projectName: null, //项目名称
      workNum: null, //工作号
      itemName: "毛细管网", //品名
      orderDate: new Date(), //下达日期
      setNum: 1, //套数
      fullLength: null, //总长度 *不同类型表单不同，这里仅为normal的
      pieceNum: null, //生产片数 *不同类型表单不同，这里仅为normal的
      organRequire: null, //整理要求
      fullPieceNum: null, //总片数 *不同类型表单不同，这里仅为normal的
      fullArea: null, //总面积 *不同类型表单不同，这里仅为normal的
      productArea: null, //生产面积 *不同类型表单不同，这里仅为normal的
      checkReportNum: null, //检测报告份数
      credentialNum: null, //合格证个数
      receiptNum: null, //签回单份数
      other: null, //其他
      packDemand: null, //包装要求
      orientation: null, //整理方向
      orderTime: null, //下单时间
      customerName: null, //客户名称
      expressCompany: null, //快递公司
      expressNum: null, //单号
    },
    storage: [
      [initSheets.getNoticeEnterSheet()],
      [initSheets.getNoticeQuerySheet()],
      null,
      null,
      null,
    ], //分别存储五个顶部选项栏中的表单数据
  },
  mutations: {
    setStatistics(state, obj) {
      // state.selectedData.fullPieceNum = obj.fullPieceNum*state.selectedData.setNum;
      // state.selectedData.pieceNum = obj.pieceNum;
      // state.selectedData.fullArea = obj.fullArea*state.selectedData.setNum;
      // state.selectedData.fullLength = obj.fullLength;
      // state.selectedData.productArea = obj.productArea;
      state.selectedData.fullPieceNum = obj.fullPieceNum;
      state.selectedData.pieceNum = obj.pieceNum;
      state.selectedData.fullArea = obj.fullArea;
      state.selectedData.fullLength = obj.fullLength;
      state.selectedData.productArea = obj.productArea;
    },
    setSelectedData(state,selectedData){
      state.selectedData = selectedData
    },
    setStorage(state,newStorage){
      state.storage[newStorage.index] = newStorage.data
    },
    initselectedData(state){
      state.selectedData = {
        contractNum: null, //合同号
        date: new Date(), //日期
        projectName: null, //项目名称
        workNum: null, //工作号
        itemName: "毛细管网", //品名
        orderDate: new Date(), //下达日期
        setNum: 1, //套数
        fullLength: null, //总长度 *不同类型表单不同，这里仅为normal的
        pieceNum: null, //生产片数 *不同类型表单不同，这里仅为normal的
        organRequire: null, //整理要求
        fullPieceNum: null, //总片数 *不同类型表单不同，这里仅为normal的
        fullArea: null, //总面积 *不同类型表单不同，这里仅为normal的
        productArea: null, //生产面积 *不同类型表单不同，这里仅为normal的
        checkReportNum: null, //检测报告份数
        credentialNum: null, //合格证个数
        receiptNum: null, //签回单份数
        other: null, //其他
        packDemand: null, //包装要求
        orientation: null, //整理方向
        orderTime: null, //下单时间
        customerName: null, //客户名称
        expressCompany: null, //快递公司
        expressNum: null, //单号
      }
    }
  },
  actions: {},
  getters: {},
};
//母单录入模块
const module_motherBillEnter = {
  namespaced: true,
  state: {
    selectedData: {
      MBNum: null,
      date: new Date(),
      customerName: null,
      houseType: null,
      noticeNum: null,
      projectName: null,
      setNum: 1,
      fullLength: null,
      pieceNum: null,
      organRequire: null,
      fullArea: null,
      productArea: null,
      packDemand: null,
      orientation: null,
      fullPieceNum: null,
    },
  },
  mutations: {
    initselectedData(state){
      state.selectedData = {
        MBNum: null,
        date: new Date(),
        customerName: null,
        houseType: null,
        noticeNum: null,
        projectName: null,
        setNum: 1,
        fullLength: null,
        pieceNum: null,
        organRequire: null,
        fullArea: null,
        productArea: null,
        packDemand: null,
        orientation: null,
        fullPieceNum: null,
      }
    }
  },
  actions: {},
  getters: {},
};
//生产量录入模块
const module_productOutput = {
  namespaced: true,
  state: {
    selectedData: {
      fullLength: "",
      productPiece: "",
      fullPiece: "",
      fullArea: "",
      ProductArea: "",
      begin_date: null,
      end_date: new Date(),
      staff_name: "",
      staff_job: "",
      work_num: ""
    },
    storage: [
      [initSheets.getProductOutputSheet()],
      [initSheets.getProductOutputSheet()],
      [initSheets.getPOItemEntrySheet()],
      [initSheets.getPOOther()]
    ],
  },
  mutations: {},
  actions: {},
  getters: {},
};

//全局数据，常量
const module_globalData = {
  namespaced: true,
  state: {
    reported: false,
    reportedFile: "",
  },
  mutations: {},
  actions: {},
};
const module_Base = {
  state: {
    updated: false,
  },
  mutations: {
    updated(state, val) {
      state.updated = val;
    },
  },
  actions: {},
  getters: {},
};

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    module_noticeEnter,
    module_motherBillEnter,
    module_productOutput,
    module_globalData,
    module_Base,
  },
});

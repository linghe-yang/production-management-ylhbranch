//统一管理api
import requests from "@/utils/proxy";
import util from "@/utils/util";

//请求配置参考： https://www.axios-http.cn/docs/req_config

//用例
/*可以通过 this.$API 访问到所有在此的api，按需调用。
    fetchData() {
            this.$API.reqGetSpareSpecs()
            .then( (response) => {
                    this.$data.tableData = JSON.parse(JSON.stringify(response.data));
                });
        },
*/
//登录
export const reqUserLogin = (data) =>
  requests({ url: "/login", data, method: "post" });
//退出登录
export const reqLogout = () =>
  requests({
    url: "/logout",
    method: "get",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

//员工录入
export const reqGetAllStaff = () =>
  requests({
    url: "/reqGetAllStaff",
    method: "get",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqGetStaff = (data) =>
  requests({
    url: "/reqGetStaff",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqAddStaff = (data) =>
  requests({ url: "/reqAddStaff", data, method: "post" });
export const reqDelStaff = (data) =>
  requests({
    url: "/reqDelStaff",
    data,
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqSetStaff = (data) =>
  requests({ url: "/reqSetStaff", data, method: "put" });

//产品录入

export const reqGetAllProduct = () =>
  requests({
    url: "/reqGetAllProduct",
    method: "get",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqGetProduct = (data) =>
  requests({
    url: "/reqGetProduct",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqAddProduct = (data) =>
  requests({ url: "/reqAddProduct", data, method: "post" });
export const reqDelProduct = (data) =>
  requests({
    url: "/reqDelProduct",
    data,
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqSetProduct = (data) =>
  requests({ url: "/reqSetProduct", data, method: "put" });
//分箱颜色
export const reqGetAllBox = () =>
  requests({
    url: "/reqGetAllBox",
    method: "get",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqGetBox = (data) =>
  requests({
    url: "/reqGetBox",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqAddBox = (data) =>
  requests({ url: "/reqAddBox", data, method: "post" });
export const reqDelBox = (data) =>
  requests({
    url: "/reqDelBox",
    data: util.getFormData(data),
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqSetBox = (data) =>
  requests({ url: "/reqSetBox", data, method: "put" });

//客户录入
export const reqGetAllCustomer = () =>
  requests({
    url: "/reqGetAllCustomer",
    method: "get",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqGetCustomer = (data) =>
  requests({
    url: "/reqGetCustomer",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqAddCustomer = (data) =>
  requests({ url: "/reqAddCustomer", data, method: "post" });
export const reqDelCustomer = (data) =>
  requests({
    url: "/reqDelCustomer",
    data,
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqSetCustomer = (data) =>
  requests({ url: "/reqSetCustomer", data, method: "put" });

export const reqGetAllCustPacReq = () =>
  requests({
    url: "/reqGetAllCustPacReq",
    method: "get",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqGetCustPacReq = (data) =>
  requests({
    url: "/reqGetCustPacReq",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqAddCustPacReq = (data) =>
  requests({ url: "/reqAddCustPacReq", data, method: "post" });
export const reqDelCustPacReq = (data) =>
  requests({
    url: "/reqDelCustPacReq",
    data,
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqSetCustPacReq = (data) =>
  requests({ url: "/reqSetCustPacReq", data, method: "put" });

export const reqGetAllCustOrderReq = () =>
  requests({
    url: "/reqGetAllCustOrderReq",
    method: "get",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqGetCustOrderReq = (data) =>
  requests({
    url: "/reqGetCustOrderReq",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqAddCustOrderReq = (data) =>
  requests({ url: "/reqAddCustOrderReq", data, method: "post" });
export const reqDelCustOrderReq = (data) =>
  requests({
    url: "/reqDelCustOrderReq",
    data,
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqSetCustOrderReq = (data) =>
  requests({ url: "/reqSetCustOrderReq", data, method: "put" });

export const reqGetAllCustDire = () =>
  requests({
    url: "/reqGetAllCustDire",
    method: "get",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqGetCustDire = (data) =>
  requests({
    url: "/reqGetCustDire",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqAddCustDire = (data) =>
  requests({ url: "/reqAddCustDire", data, method: "post" });
export const reqDelCustDire = (data) =>
  requests({
    url: "/reqDelCustDire",
    data,
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqSetCustDire = (data) =>
  requests({ url: "/reqSetCustDire", data, method: "put" });

//项目管理
export const reqGetAllProject = () =>
  requests({
    url: "/reqGetAllProject",
    method: "get",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqGetProject = (data) =>
  requests({
    url: "/reqGetProject",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqAddProject = (data) =>
  requests({ url: "/reqAddProject", data, method: "post" });
export const reqDelProject = (data) =>
  requests({
    url: "/reqDelProject",
    data,
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqSetProject = (data) =>
  requests({ url: "/reqSetProject", data, method: "put" });
export const reqFinishProject = (data) =>
  requests({ url: "/reqFinishProject", data, method: "put" });

//岗位
export const reqGetAllJob = () =>
  requests({
    url: "/reqGetAllJob",
    method: "get",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqGetJob = (data) =>
  requests({
    url: "/reqGetJob",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqAddJob = (data) =>
  requests({ url: "/reqAddJob", data, method: "post" });
export const reqDelJob = (data) =>
  requests({
    url: "/reqDelJob",
    data,
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqSetJob = (data) =>
  requests({ url: "/reqSetJob", data, method: "put" });

//备品规格录入 post
export const reqGetAllSpareSpecs = () =>
  requests({
    url: "/reqGetAllSpareSpecs",
    method: "get",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqGetSpareSpecs = (data) =>
  requests({
    url: "/reqGetSpareSpecs",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqAddSpareSpecs = (data) =>
  requests({ url: "/reqAddSpareSpecs", data, method: "post" });
export const reqDelSpareSpecs = (data) =>
  requests({
    url: "/reqDelSpareSpecs",
    data,
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqSetSpareSpecs = (data) =>
  requests({ url: "/reqSetSpareSpecs", data, method: "put" });

//单据录入，这里基本都需要发送多个请求，建议使用axios.all, 和axios.spread处理
export const reqEnterProductNotice = (data) =>
  requests({ url: "/productNotice", data, method: "post" });
export const reqGetProductNoticeList = (data) => {
  return requests({
    url: "/productNotice/getList",
    data,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }); //获取生产通知单的一个摘要列表
};

export const reqGetProductNotice = (data) =>
  requests({
    url: "/productNotice/getById",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }); //获取某个单号对应生产通知单的全部信息
export const reqDelProductNotice = (data) =>
  requests({
    url: "/productNotice/deleteById",
    data: util.getFormData(data),
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }); //删除某个单号的生产通知单
export const reqGetReport = (data) => {
  return requests({
    url: "/reqStaffGetCpf",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const reqDeleteReport = (data) =>
  requests({
    url: "/reqStaffDeleteCpf",
    data: util.getFormData(data),
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqEnterReport = (data) =>
  requests({
    url: "/reqStaffPostCpf",
    data,
    method: "post",
  });

export const reqChangeItem = (data) =>
  requests({
    url: "/reqChangeItem",
    data,
    method: "post"
  });
//Logo
export const reqUploadLogo = (file) =>
  requests({
    url: "/uploadLogo",
    data: file,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
// export const reqReport = (data) => requests({url:'/reqStaffGetCpf',data:JSON.parse(JSON.stringify(data)),method:'get'}); //报表

//母单
export const reqEnterMotherBill = (data) =>
  requests({ url: "/motherBill/enter", data, method: "post" });
export const reqGetMotherBillList = (data) => {
  return requests({
    url: "/motherBill/getList",
    data,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const reqGetMotherBill = (data) =>
  requests({
    url: "/motherBill/getById",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqDelMotherBill = (data) =>
  requests({
    url: "/motherBill/deleteById",
    data: util.getFormData(data),
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const reqEnterOutput = (data) =>
  requests({
    url: "/output/enter",
    data,
    method: "post",
  });

export const reqDeleteOutput = (data) =>
  requests({
    url: "/output/delete",
    data,
    method: "delete"
  });
export const reqGetOutput = (data) =>
  requests({
    url: "/output/get",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });


export const reqGetPacking = (data) =>
  requests({
    url: "/reqGetPacking",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const reqEnterOddJobs = (data) =>
  requests({
    url: "/output/enteroddjobs",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
export const reqDeleteOddjobs = (data) =>
  requests({
    url: "/output/deleteoddjobs",
    data: util.getFormData(data),
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
export const reqGetOddJobs = (data) =>
  requests({
    url: "/output/getoddjobs",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
export const reqEnterLargeProject = (data) =>
  requests({
    url: "/enterLargeProject",
    data,
    method: "post"
  });
export const reqDeleteLargeProject = (data) =>
  requests({
    url: "/deleteLargeProject",
    data: util.getFormData(data),
    method: "delete",
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
export const reqGetLargeProject = (data) =>
  requests({
    url: "/getLargeProject",
    data: util.getFormData(data),
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });

//库存单据
//入库 post
//领料 get，post
//整理出库 get，post



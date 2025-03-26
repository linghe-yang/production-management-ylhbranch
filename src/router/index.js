//用于创建整个应用的路由器
import VueRouter from "vue-router";

//About、home两个组件目前均为占位使用
const routes = [
  {
    path: "/",
    redirect: "/Detail",
    meta:{
      title:"企业生产管理系统"
    }
  },
  {
    path: "/Detail",
    name: "Detail",
    component: () => import("@/pages/Detail"),
    children: [
      {
        path: "base",
        name: "Base",
        component: () => import("@/pages/Base"),
        children: [
          {
            path: "1-1",
            name: "Stuff enter",
            component: () => import("@/pages/Base/StuffEnter"),
            meta: {
              title: "员工录入",
            },
          },
          {
            path: "1-2",
            name: "Product enter",
            component: () => import("@/pages/Base/ProductEnter"),
            meta: {
              title: "产品录入",
            },
          },
          {
            path: "1-3",
            name: "Box color",
            component: () => import("@/pages/Base/BoxColor"),
            meta: {
              title: "分箱颜色",
            },
          },
          {
            path: "1-4",
            name: "Customer enter",
            component: () => import("@/pages/Base/CustomerEnter"),
            meta: {
              title: "客户录入",
            },
          },
          {
            path: "1-5",
            name: "Project management",
            component: () => import("@/pages/Base/ProjectManagement"),
            meta: {
              title: "项目管理",
            },
          },
          {
            path: "1-6",
            name: "Job",
            component: () => import("@/pages/Base/Job"),
            meta: {
              title: "岗位",
            },
          },
          {
            path: "1-7",
            name: "Spare specs entry",
            component: () => import("@/pages/Base/SparesSpecsEnter"),
            meta: {
              title: "备品规格录入",
            },
          },
        ],
      },
      {
        path: "form",
        name: "Form",
        component: () => import("@/pages/Form"),
        children: [
          {
            path: "2-1",
            name: "Production notes",
            component: () => import("@/pages/Form/ProductionNotice"),
            meta: {
              title: "生产通知单",
            },
          },
          {
            path: "2-2",
            name: "Parent list entry",
            component: () => import("@/pages/Form/MotherBill"),
            meta: {
              title: "母单录入",
            },
          },
          {
            path: "2-3",
            name: "Parent list arrange",
            component: () => import("@/pages/Form/MotherBillProductArrange"),
            meta: {
              title: "母单安排生产计划",
            },
          },
          {
            path: "2-4",
            name: "Production quantity entry",
            component: () => import("@/pages/Form/ProductOutputEnter"),
            meta: {
              title: "生产量录入",
            },
          },
          {
            path: "2-5",
            name: "Large project",
            component: () => import("@/pages/Form/LargeProject"),
            meta: {
              title: "大项目签收单",
            },
          }
        ],
      },
      // {
      //   path: "inventory",
      //   name: "Inventory",
      //   component: () => import("@/pages/Inventory"),
      //   children: [
      //     {
      //       path: "3-1",
      //       name: "Into storage directly",
      //       component: () => import("@/pages/Inventory/IntoStorageDirectly"),
      //       meta: {
      //         title: "直接入库",
      //       },
      //     },
      //     {
      //       path: "3-2",
      //       name: "Material requisition",
      //       component: () => import("@/pages/Inventory/MaterialRequisition"),
      //       meta: {
      //         title: "领料",
      //       },
      //     },
      //     {
      //       path: "3-3",
      //       name: "Out of storage",
      //       component: () => import("@/pages/Inventory/OutOfStorage"),
      //       meta: {
      //         title: "整理出库",
      //       },
      //     },
      //   ],
      // },
      // {
      //   path: "noticeQuery",
      //   name: "NoticeQuery",
      //   component: () => import("@/pages/NoticeQuery"),
      //   children: [
      //     {
      //       path: "4-1",
      //       name: "Workload Statistics",
      //       component: () => import("@/pages/NoticeQuery/WorkloadStatistics"),
      //       meta: {
      //         title: "工作量统计",
      //       },
      //     }
      //   ],
      // },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/Login"),
  },
  {
    path:"/report",
    name:"Report",
    component:()=>import("@/components/Form/ExcelReport")
  },
  {
    path:"/packingreport",
    name:"PackingReport",
    component:()=>import("@/components/Form/PackingReport")
  },
  {
    path:"/itemEntry",
    name:"ItemEntry",
    component:()=>import("@/components/Form/ProductOutputEnter/ItemEntry"),
    meta:{
      title:"工作量录入"
    }
  }

  // {
  //   path: "/report",
  //   name: "Report Excel",
  //   component: () => import("@/pages/Form/ExcelReport"),
  // },

  // {
  //     path: '/home',
  //     name: '个人中心',
  //     component: () => import('@/pages/Home'),
  //     meta: {
  //         title: '个人中心'
  //     }
  // },
  // {
  //     path: '/manage',
  //     name: '工作管理',
  //     component: () => import('@/pages/About'),
  //     meta: {
  //         title: '工作管理'
  //     }
  // }
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {

  // localStorage.removeItem('isLoggedIn');
  if (to.path != "/Login") {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (isLoggedIn == "false" || !isLoggedIn) {
      next("/Login"); // 如果用户未登录，则跳转到登录页面
    } else {
      next(); // 否则继续导航到主页
    }
  } else next();
});

export default router;

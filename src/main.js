import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import ElementUI from "element-ui";
import axios from "axios";
import "element-ui/lib/theme-chalk/index.css";
import Print from "vue-print-nb";

Vue.use(Print);
const messages = ["success", "warning", "info", "error"];
messages.forEach((type) => {
  ElementUI.Message[type] = (options) => {
    options = {
      message: options,
    };
    // 默认配置
    options.duration = 1000;
    options.showClose = true;
    options.type = type;
    return ElementUI.Message(options);
  };
});

Vue.use(ElementUI);

Vue.prototype.$axios = axios;

import router from "./router";
import store from "./store";
//统一接口api文件夹里面全部请求函数
//统一引入
import * as API from "@/api";
Vue.config.productionTip = false;

Vue.use(VueRouter);
new Vue({
  render: (h) => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;
  },
  router,
  store,
}).$mount("#app");

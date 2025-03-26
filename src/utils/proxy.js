import axios from "axios";
import nprogress from "nprogress";
import { Message } from 'element-ui'
// //在当前模块中引入store
// import store from '@/store';

import "nprogress/nprogress.css";
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'


//创建axios实例
let requests = axios.create({
  //基础路径
  baseURL: "/api",
  //请求不能超过10S
  timeout: 10000,
});

//请求拦截器----在项目中发请求（请求没有发出去）可以做一些事情
requests.interceptors.request.use(config => {
  nprogress.start();

	return config;
}, error => {
	return error;
})

//响应拦截器----当服务器手动请求之后，做出响应（相应成功）会执行的
requests.interceptors.response.use(success => {
  nprogress.done();
	//此处的success是成功请求到后端接口,并不是请求数据成功了
	if (success.status && success.status == 200) {
		// 成功调用到后台 500是业务逻辑错误,401是资源找不到,403是权限不足,还有很多状态码,此处省略...
		if (success.data.code == 500 || success.data.code == 401 || success.data.code == 403) {
			//success.data.message是后台返回的错误信息
			Message.error({ message: success.data.message });
			return;
		}
		// 不包含500,401,403...错误信息,则认为成功,有数据就进入下一个判断
		if (success.data) {
			// 判断是否存在提示信息,存在则弹出提示,否则不弹出提示
			if (success.data.message) {
				Message.success({ message: success.data.message });
			}
			return success.data;
		}
		// 判断后端返回的数据及状态码，后端所有自定义错误状态码均为‘E’开头
		let cde = success.data.code + "";
		// 若状态码为‘E’开头，则直接返回错误信息，不再继续执行
		if (cde.startsWith("E")) {
			return Message.error({ message: success.data.msg });
		}
		// 后端默认自定义的响应成功状态码为'00000'，
		if (success.data.code == "00000") {
			// 响应成功，判断是否有后端返回的提示信息，有则弹出提示，并返回数据
			if (success.data.msg) {
				Message.success({ message: success.data.msg });
			}
			return success.data;
		}
		// 如果状态码不为‘E’或者‘00000’，可能为其他状态码，并且返回的有数据，则返回数据
		if (success.data) {
			// 判断是否有后端返回的提示信息
			if(success.data.msg){
				Message.success({ message: success.data.msg });
			}
			return success.data;
		}
	}
	// 返回后台响应的数据
	return success.data;

}, () => {
	// // error错误信息是没有访问到后端接口,在发送请求时报错
	// if (error.response.code == 504 || error.response.code == 404) {
	// 	return Message.success({
	// 		message: '服务器出错,请联系管理员!'
	// 	});
	// } else if (error.response.code == 403) {
	// 	return Message.success({
	// 		message: '权限不足,请联系管理员!'
	// 	});
	// } else if (error.response.code == 401) {
	// 	return Message.success({
	// 		message: '尚未登录,请先登录!'
    //   // router.replace('/'); // eg: /login-->登录页面
	// 	});
	// 	// // 此处的'/'是根路径,replace是将路径直接替换为新定义的路径

	// } else {
	// 	// 如果响应的有提示信息  则弹出提示信息
	// 	if (error.response.data.message) {
	// 		return Message.success({
	// 			message: error.response.data.message
	// 		});
	// 	} else {
	// 		// 没有响应提示信息  则弹出自定义信息
	// 		return Message.success({
	// 			message: '未知错误!'
	// 		});
	// 	}
	// }
});

export default requests;
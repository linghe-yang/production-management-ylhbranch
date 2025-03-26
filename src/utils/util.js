/**
 * @author yanglinghe
 * @description 用于将一个字符串数组每项插入空字符后转换为一个正则表达式数组
 */
const generateFullRegExp = function (arr) {
  let regs = [];
  arr.forEach((item) => {
    let reg = ".*";
    for (let c of item) {
      reg += c + "[\n\r]*";
    }
    reg += ".*";
    regs.push(reg);
  });
  regs = regs.map((x) => {
    return new RegExp(x);
  });
  return regs;
};
/**
 * @author yanglinghe
 * @description 求一个数组各元素之和
 */
const sumOfArray = function (arr) {
  let sum = 0;
  arr.forEach((e) => {
    sum += e == undefined ? 0 : e;
  });
  return sum;
};

/**
 * @author yanglinghe
 * @description 判断一个数组所有元素是否相同
 */
const areAllElementsEqual = function (arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[0]) {
      return false;
    }
  }
  return true;
};

const lodash = require("lodash");
/**
 * @author yanglinghe
 * @description 深拷贝一个对象
 */
const cloneDeep = function (obj) {
  return lodash.cloneDeep(obj);
};

const isNumber = function (obj) {
  return /^[0-9]+$/.test(obj);
};
/**
 * @author yanglinghe
 * @description 对象是否为箱号
 */
const isBoxMark = function (obj) {
  return /^[a-zA-Z0]+$/.test(obj) || obj == '';
};

const checkProductNoticeBoxMark = function (obj) {
  return /^[a-zA-Z0]+$/.test(obj);
};

import fomula from "./fomula";
/**
 * @author yanglinghe
 * @description 统计一个生产通知单表格的几项数据
 */
const getProductNoticeStatistics = function (celldata,setNum) {
  if (celldata == null) return null
  let row0 = celldata
    .filter((x) => x.r == 0)
    .sort((a, b) => a.c - b.c)
    .map((x) => x.v.v);
  let order_c = row0.indexOf("序号");
  let max_num = celldata.filter((x) => x.c == order_c).length - 1;
  let fullLengths = getColumnDataArray(
    max_num,
    row0.indexOf("总长度"),
    celldata
  );
  let nums = getColumnDataArray(max_num, row0.indexOf("数量"), celldata);
  let sparesNums = getColumnDataArray(max_num, row0.indexOf("备品"), celldata);
  let orderArea = getColumnDataFloatArray(
    max_num,
    row0.indexOf("下单面积"),
    celldata
  );
  let productAreas = getColumnDataFloatArray(
    max_num,
    row0.indexOf("生产面积"),
    celldata
  );
  let fullPieceNum = sumOfArray(nums)*setNum;
  let pieceNum = sumOfArray(fomula.mapProductNum(nums, sparesNums,setNum));
  let fullArea = sumOfArray(orderArea)*setNum;
  let fullLength = sumOfArray(fullLengths);
  let productArea = sumOfArray(productAreas)*setNum;
  // let res = {
  //   fullPieceNum: fullPieceNum,
  //   pieceNum: pieceNum,
  //   fullArea: Math.round(fullArea * 100) / 100,
  //   fullLength: fullLength,
  //   productArea: Math.round(productArea * 100) / 100,
  // };
  let res = {
    fullPieceNum: fullPieceNum,
    pieceNum: pieceNum,
    fullArea: fullArea.toFixed(2),
    fullLength: fullLength,
    productArea: productArea.toFixed(2)
  };
  return res
};
/**
 * @author yanglinghe
 * @description 将cal列的celldata数据转换为数组
 */
const getColumnDataArray = function (max_num, col, celldata) {
  let arr = new Array(max_num).fill(0);
  celldata
    .filter((x) => x.r != 0 && x.c == col)
    .forEach((e) => {
      let num = parseInt(e.v.v);
      if (isNaN(num)) num = 0;
      arr[e.r - 1] = num;
    });
  return arr;
};
const getColumnDataFloatArray = function (max_num, col, celldata) {
  let arr = new Array(max_num).fill(0);
  celldata
    .filter((x) => x.r != 0 && x.c == col)
    .forEach((e) => {
      let num = parseFloat(e.v.v);
      if (isNaN(num)) num = 0;
      arr[e.r - 1] = num;
    });
  return arr;
};


const formatDate = function (date, command) {
  if (date == null) date = new Date()
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  if (command == 'ymd') {
    return `${year}-${month}-${day}`
  } else if (command == 'all') {
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  } else if (command == 'ym') {
    return `${year}-${month}`
  }
}

const getFormData = (obj) => {
  if (!obj) return undefined
  let formData = new FormData()
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    if (Array.isArray(value)) {
      value.forEach((subValue, i) => {
        formData.append(key + `[${i}]`, subValue)
      })
    } else {
      formData.append(key, obj[key])
    }
  })

  return formData
}
const sortNormalDivideReportData = (data) => {
  function boxToNumber(box) {
    if (box === '0') return -1;
    let num = 0;
    for (let i = 0; i < box.length; i++) {
      num = num * 26 + (box.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
    }
    return num;
  }

  // 排序函数，先按box排序，再按length排序
  data.sort((a, b) => {
    let boxA = boxToNumber(a.box);
    let boxB = boxToNumber(b.box);

    if (boxA !== boxB) {
      return boxA - boxB;
    } else {
      return Number(a.length) - Number(b.length);
    }
  });

  // 重新分配com_order
  data.forEach((item, index) => {
    item.com_order = (index + 1).toString();
  });
  return data
}

export default {
  generateFullRegExp,
  sumOfArray,
  cloneDeep,
  isNumber,
  isBoxMark,
  checkProductNoticeBoxMark,
  areAllElementsEqual,
  getProductNoticeStatistics,
  getColumnDataArray,
  formatDate,
  getFormData,
  sortNormalDivideReportData
};

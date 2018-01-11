//日期格式化，fmt为格式化类型，例如：'yyyy-MM-dd','yyyy-MM-dd hh:mm:ss'都行，date为需要格式化的时间，返回值为格式化后的日期
// toNextDay表示是否计算到下一天
export function DateFtt (fmt, date, toNextDay, toBeforeDay) {
  if (!date) return '%'
  date = new Date(date)
  if (toNextDay) date = new Date(date.valueOf() + 24 * 3600 * 1000)
  if (toBeforeDay) date = new Date(date.valueOf() - 24 * 3600 * 1000)
  let o = {
    'M+': date.getMonth() + 1,                    //月份
    'd+': date.getDate(),                         //日
    'h+': date.getHours(),                        //小时
    'm+': date.getMinutes(),                      //分
    's+': date.getSeconds(),                      //秒
    'q+': Math.floor((date.getMonth() + 3) / 3),  //季度
    'S': date.getMilliseconds()                   //毫秒
  }
  // 如果传入的toNextDay为true则计算到下一天
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

// 取一月之前的日期
export function prevMonth (date) {
  if (!date) return new Date()
  return new Date(new Date().valueOf() - 30 * 24 * 3600 * 1000)
}

// 根据起始时间、时间间隔天数、以及时间点数求出该时间区间内所有的时间点的字符串组成的数组
export function getDateSection (startDate, interval, num) {
  if (typeof startDate === 'string') startDate = new Date(startDate)
  interval = interval || 1
  num = num || 7
  let startTime = startDate.valueOf() // 起始时间戳
  let timeSmap = interval * 24 * 3600 * 1000 // 间隔毫秒数
  let dateStrs = []
  for (let i = 0; i < num; i++) {
    let nowTime = startTime + i * timeSmap
    dateStrs.push(DateFtt('yyyy-MM-dd', new Date(nowTime)))
  }
  console.log(dateStrs)
  return dateStrs
}

// 浮点数加法（精度改善）
export function floatAdd (arg1, arg2) {
  let r1, r2, m, c
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  c = Math.abs(r1 - r2)
  m = Math.pow(10, Math.max(r1, r2))
  if (c > 0) {
    var cm = Math.pow(10, c)
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', '')) * cm
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm
      arg2 = Number(arg2.toString().replace('.', ''))
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''))
    arg2 = Number(arg2.toString().replace('.', ''))
  }
  return (arg1 + arg2) / m
}

// 浅拷贝
export function copy (obj) {
  let temp = {}
  for (var i in obj) {
    temp[i] = obj[i]
  }
  return temp
}

// 循环壳子,支持传入多个callback处理函数，callback列表依次执行，直到某个callback返回值为false，则跳出所有循环
export function loop (arr) {
  if (!arr || !(arr instanceof Array) || arr.length <= 0) return
  let isBreak = false
  let rel = true
  for (var i = 0; i < arr.length; i++) {
    for (var m = 1; m < arguments.length; m++) {
      if (!arguments[i](arr[i], i, arr)) {
        isBreak = true
        rel = false
        break
      }
      if (isBreak) break
    }
  }
  return rel
}

export function isEmpty (obj) {
  if (typeof obj !== 'object') return false
  return JSON.stringify(obj) === '{}'
}

// 判断两个数组是否有重合部分
export function hasSameItem (arr1, arr2) {
  return arr1.some(item => arr2.indexOf(item) !== -1)
}

// 获取某一主键对应的项目在集合中的索引位置(从开始处开始检索)
// arg1: 主键名   string
// arg2: 主键值   string
// arr:  集合     array
export function getIndexOfCollection (key, value, arr) {
  let temp = arr.map(item => item[key])
  return temp.indexOf(value)
}

// 获取某一主键对应的项目在集合中的索引位置(从结尾处开始检索)
// arg1: 主键名   string
// arg2: 主键值   string
// arr:  集合     array
export function getLastIndexOfCollection (key, value, arr) {
  let temp = arr.map(item => item[key])
  return temp.lastIndexOf(value)
}

// 集合中是否有某几个主键值一样的项
// arr:     集合       array
// callback: 比较函数   function
export function someMeta (arr, callback) {
  callback = callback || function () {}
  for (let i = 0; i < arr.length - 1; i++) {
    let compaer = arr[i]
    let others = arr.slice(i + 1)
    let rel = others.some((item) => {
      return callback(compaer, item)
    })
    if (rel) return true
  }
  return false
}

// 创建以一个以n个m值组成的数组
export function createReapteArray (m, n) {
  let temp = []
  for (var i = 0; i < n; i++) {
    temp.push(m)
  }
  return temp
}

// 根据某一字段对集合进行分组
export function groupBy (arr, key) {
  let keys = []
  let rel = {}
  arr.forEach((item, index) => {
    let pos = keys.indexOf(item[key])
    let obj = {}
    if (pos === -1) {
      let temp = []
      temp.push(item)
      rel[item[key]] = temp
      keys.push(item[key])
    } else {
      rel[item[key]].push(item)
    }
  })
  return rel
}

// 判断集合中某一个或多个字段的值是否全部相同
// arr  集合
// arg  要判断的字段组成的数组
export function everySame (arr, ...arg) {
  if (!arg || arg.length === 0) return false
  let compareItem = arr[0]
  return arr.every(item => {
    let rel = true
    for (let i in arg) {
      let key = arg[i]
      if (compareItem[key] !== item[key]) {
        rel = false
        break
      }
    }
    return rel
  })
}

// 取某两个子串中间的字符串
// str  母字符串
// left 左边子串
// right 右边子串
export function subSection (str, left, right) {
  if (!str || !left) return ''
  let len = str.length
  let lPos = str.indexOf(left) + left.length
  let rPos = right ? str.indexOf(right) : len
  return str.substring(lPos, rPos)
}

// 从某一集合中提取指定字段组成的新集合
// data   原集合
// fields 指定字段名数组
export function formatJson (data, fields) {
  return data.map(row => fields.map(key => row[key]))
}

// 创建32位小写的GUID
export function Created32Guid (len, radix) {
  let chars = '0123456789abcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = []
  let i
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}
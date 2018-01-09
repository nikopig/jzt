var xhr = new XMLHttpRequest()
xhr.timeout = 30000
function ajax (method, url, data, callback) {
  xhr.open(method, url)
  // 在POST和PUT请求需要设置该信息
  if (method === 'POST') xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        callback(xhr.responseText)
      } else {
        return false
      }
    } else {
      return false
    }
  }
  xhr.send(data)
}

function dealJson (obj) {
  var str = ''
  for (var i in obj) {
    var tempStr = encodeURIComponent(obj[i])
    str += i + '=' + tempStr + '&'
  }
  return str.substring(0, str.length - 1)
}

export function $get (url, callback, params) {
  if (!params) params = {}
  url = url + '?' + dealJson(params)
  ajax('GET', url, null, callback)
}

export function $post (url, callback, params) {
  if (!params) params = {}
  params = dealJson(params)
  ajax('POST', url, params, callback)
}

export default {$get, $post}

import {ajax} from 'jquery'
import config from './config'
let isProd = config.Environment !== 'dev'
let apiUrl = !isProd ? '/api/DataSource/doPostApi' : '/DataSource/doPostApi'
function AjaxSimple (url, parm, callback, async, complete) {
  if (!async) { async = false }
  ajax({
    type: 'post',
    dataType: 'json',
    url: url,
    data: parm,
    cache: false,
    async: async,
    success: callback,
    complete: complete,
    error: function () {
      return false
    }
  })
  if (complete) {
    complete()
  }
}
function AjaxInterfaceService (operate, callback, paras, rtype) {
  var param = {}
  if (paras) {
    param = JSON.stringify({requestType: rtype, jsonParas: JSON.stringify(paras)})
  }
  var inparas = {
    url: '/Jlp.Data.InterfaceService/api/inCall/' + operate,
    paras: param
  }
  ajax({
    type: rtype,
    url: apiUrl,
    data: inparas,
    dataType: 'json',
    async: false,
    success: function (data) {
      if (callback) callback(data)
    },
    error: function (e) {
      alert('请求发生错误')
    }
  })
}
export default {
  getSessionSso () {
    var userInfo = this.getSession()
    var ines = { 'Staff_No': userInfo.USERCODE }
    AjaxInterfaceService('INF_STAFF_SSO', function (obj) {
      if (obj.Flag) {
        if (obj.MsgInfo.length > 0) {
          Object.assign(userInfo, obj.MsgInfo[0])
          userInfo.USERID = userInfo.userId = userInfo.Staff_Id
        }
      } else {
        return false
      }
    }, ines, 'get')
    return userInfo
  },
  getSession () {
    var userInfo = {}
    if (isProd) {
      AjaxSimple('/Account/GetSession', {}, function (data) {
        if (data != null) {
          userInfo = data
        }
      }, false)
      return userInfo
    }
    // return {
    //   'AppId': '4',
    //   'USERID': '831323494964461',
    //   'USERCODE': 'dgj',
    //   'USERNAME': 'è‘£è´µå¨Ÿ',
    //   'Staff_Id': '831323494964461',
    //   'Staff_No': 'dgj',
    //   'Staff_Name': 'è‘£è´µå¨Ÿ',
    //   'Mnemonic_Code': null,
    //   'Staff_Pwd': null,
    //   'Is_Active': null,
    //   'Mobilephone': null,
    //   'Qq': null,
    //   'Wechat': null,
    //   'Remark': null,
    //   'Creator': null,
    //   'Created_Time': '0001-01-01 12:00:00',
    //   'Updated_Time': '0001-01-01 12:00:00',
    //   'Status': null,
    //   'Operator_Id': '684571324568415',
    //   'Ldc_Id': '%',
    //   'Con_Id': '%',
    //   'Carrier_Id': '%',
    //   'Ssa_Id': '%'
    // }
    // return {
    //   'AppId': '4',
    //   'USERID': '340691351218519',
    //   'USERCODE': 'Z',
    //   'USERNAME': '系统管理员',
    //   'Staff_Id': '340691351218519',
    //   'Staff_No': 'Z',
    //   'Staff_Name': '系统管理员',
    //   'Mnemonic_Code': null,
    //   'Staff_Pwd': null,
    //   'Is_Active': null,
    //   'Mobilephone': null,
    //   'Qq': null,
    //   'Wechat': null,
    //   'Remark': null,
    //   'Creator': null,
    //   'Created_Time': '0001-01-01 12:00:00',
    //   'Updated_Time': '0001-01-01 12:00:00',
    //   'Status': null,
    //   'Operator_Id': '174660684877367,301748054417813,684571324568415',
    //   'Ldc_Id': '199647602156719',
    //   'Con_Id': '108629488320861,120328502098797,126673097001488,157773250137464,15965bb16ed9e711b0d31866dafb5571,163684786449824,165967270139440,170319290144159,174675281323618,188354161292254,1a87d02d6bb5e711b639000c29d6c8f4,1c74d9645c9be711b0d31866dafb5571,219507807363046,23469952600337,2472f573489be71180bc008cfaedcb32,2472f573489be71180bc008cfaedcb35,262913576387156,289446625073181,300687248143598,305828464622808,316169817841083,317619bde0dbe71196061866dafb6f91,377146517435006,403721132838306,445110750799170,449867271305869,487386326759482,4b75a9f15b9be71196061866dafb6f91,538689410124380,569894068473851,58537a9a8dc2e71180c5a0369f77891a,586285251738769,591636657487099,617457929337756,6194825762e5e71180c5a0369f77891a,641572980807696,743390914745061,787177406984546,854283923931763,904645145861431,906146178865942,995381040494312,995688131075061,995688131075062,c9325525b3dbe71196061866dafb6f91,d459e3b9ffe5e71180c5a0369f77891a,d5f8d04b8dc2e711b0d31866dafb5571,e1ca5028b9afe711b639000c29d6c8f4,e2ca5028b9afe711b639000c29d6c8f4,e3ca5028b9afe711b639000c29d6c8f4,e840cc7d78e0e71180bd008cfaedcb35,f46d473e3dc8e711b0d31866dafb5571',
    //   'Carrier_Id': '%',
    //   'Ssa_Id': '%',
    //   'Staff_Type': '1'
    // }
    // return {
    //   'AppId': '4',
    //   'USERID': '89',
    //   'USERCODE': 'ln888',
    //   'USERNAME': 'åˆ˜å¨œ',
    //   'Staff_Id': '89',
    //   'Staff_No': 'ln888',
    //   'Staff_Name': 'åˆ˜å¨œ',
    //   'Mnemonic_Code': null,
    //   'Staff_Pwd': null,
    //   'Is_Active': null,
    //   'Mobilephone': null,
    //   'Qq': null,
    //   'Wechat': null,
    //   'Remark': null,
    //   'Creator': null,
    //   'Created_Time': '0001-01-01 12:00:00',
    //   'Updated_Time': '0001-01-01 12:00:00',
    //   'Status': null,
    //   'Operator_Id': '684571324568415',
    //   'Ldc_Id': '%',
    //   'Con_Id': '%',
    //   'Carrier_Id': '%',
    //   'Ssa_Id': '%'
    // }
    return {
      'AppId': '4',
      'USERID': '3',
      'USERCODE': 'macf',
      'USERNAME': 'é©¬æ˜¥èŠ¬',
      'Staff_Id': '3',
      'Staff_No': 'macf',
      'Staff_Name': 'é©¬æ˜¥èŠ¬',
      'Mnemonic_Code': null,
      'Staff_Pwd': null,
      'Is_Active': null,
      'Mobilephone': null,
      'Qq': null,
      'Wechat': null,
      'Remark': null,
      'Creator': null,
      'Created_Time': '0001-01-01 12:00:00',
      'Updated_Time': '0001-01-01 12:00:00',
      'Status': null,
      'Operator_Id': '684571324568415',
      'Ldc_Id': '%',
      'Con_Id': '%',
      'Carrier_Id': '%',
      'Ssa_Id': '%'
    }
    // return {
    //   'AppId': '6',
    //   'USERID': '515',
    //   'USERCODE': 'taop',
    //   'USERNAME': 'é™¶ä½©',
    //   'Staff_Id': '515',
    //   'Staff_No': 'taop',
    //   'Staff_Name': 'é™¶ä½©',
    //   'Mnemonic_Code': null,
    //   'Staff_Pwd': null,
    //   'Is_Active': null,
    //   'Mobilephone': null,
    //   'Qq': null,
    //   'Wechat': null,
    //   'Remark': null,
    //   'Creator': null,
    //   'Created_Time': '0001-01-01 12:00:00',
    //   'Updated_Time': '0001-01-01 12:00:00',
    //   'Status': null,
    //   'Operator_Id': '684571324568415',
    //   'Ldc_Id': '%',
    //   'Con_Id': '%',
    //   'Carrier_Id': '%',
    //   'Ssa_Id': '%'
    // }
    // return {
    //   'AppId': '6',
    //   'USERID': '534',
    //   'USERCODE': 'GUOLH',
    //   'USERNAME': 'é™¶ä½©',
    //   'Staff_Id': '534',
    //   'Staff_No': 'GUOLH',
    //   'Staff_Name': 'é™¶ä½©',
    //   'Mnemonic_Code': null,
    //   'Staff_Pwd': null,
    //   'Is_Active': null,
    //   'Mobilephone': null,
    //   'Qq': null,
    //   'Wechat': null,
    //   'Remark': null,
    //   'Creator': null,
    //   'Created_Time': '0001-01-01 12:00:00',
    //   'Updated_Time': '0001-01-01 12:00:00',
    //   'Status': null,
    //   'Operator_Id': '346820465830730',
    //   'Ldc_Id': '%',
    //   'Con_Id': '%',
    //   'Carrier_Id': '%',
    //   'Ssa_Id': '%'
    // }
  }
}

var idTmr
function getExplorer () {
  var explorer = window.navigator.userAgent
  if (explorer.indexOf('MSIE') >= 0) {
    // ie
    return 'ie'
  } else if (explorer.indexOf('Firefox') >= 0) {
    // firefox
    return 'Firefox'
  } else if (explorer.indexOf('Chrome') >= 0) {
    // Chrome
    return 'Chrome'
  } else if (explorer.indexOf('Opera') >= 0) {
    // Opera
    return 'Opera'
  } else if (explorer.indexOf('Safari') >= 0) {
    // Safari
    return 'Safari'
  }
}
function tranform (table, name) {
  name = name || 'test'
  let tableHead = table.$el.querySelector('thead')
  let ths = tableHead.getElementsByTagName('th')
  let tableBody = table.$el.querySelector('tbody')
  let trs = tableBody.getElementsByTagName('tr')
  let tableInnerHTML = '<thead><tr>'
  if (ths) {
    Array.from(ths).forEach((th) => {
      let td = th.querySelector('.cell')
      // console.log(td)
      if (td) {
        tableInnerHTML = tableInnerHTML + '<th>' + td.innerHTML + '</th>'
      }
    })
    tableInnerHTML += '</tr><thead><tbody>'
  }
  if (trs) {
    Array.from(trs).forEach((tr) => {
      tableInnerHTML += '<tr>'
      let tds = tr.getElementsByClassName('cell')
      Array.from(tds).forEach(td => {
        tableInnerHTML = tableInnerHTML + '<td>' + td.innerHTML + '</td>'
      })
      tableInnerHTML += '</tr>'
    })
  }
  tableInnerHTML += '</tbody>'
  if (getExplorer() !== 'Safari' && name.substr(-1, 4) !== '.xls') {
    name += '.xls'
  }

  if (getExplorer() === 'ie') {
    var curTbl = table
    var oXL = new window.ActiveXObject('Excel.Application')
    var oWB = oXL.Workbooks.Add()
    var xlsheet = oWB.Worksheets(1)
    var sel = document.body.createTextRange()
    sel.moveToElementText(curTbl)
    sel.select()
    sel.execCommand('Copy')
    xlsheet.Paste()
    oXL.Visible = true

    try {
      var fname = oXL.Application.GetSaveAsFilename('Excel.xls', 'Excel Spreadsheets (*.xls), *.xls')
    } catch (e) {
      print('Nested catch caught ' + e)
    } finally {
      oWB.SaveAs(fname)
      // oWB.Close(savechanges = false)
      oXL.Quit()
      oXL = null
      idTmr = setInterval(Cleanup(), 1)
    }
  } else {
    tableToExcel(tableInnerHTML, name)
  }
}
function Cleanup () {
  window.clearInterval(idTmr)
  // CollectGarbage()
}
let tableToExcel = (function () {
  let uri = 'data:application/vnd.ms-excelbase64,'
  let template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>'
  let base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
  let format = function (s, c) {
    return s.replace(/{(\w+)}/g, function (m, p) { return c[p] })
  }
  return function (table, name) {
    console.log(table)
    let ctx = {worksheet: name || 'Worksheet', table: table}
    let achor = document.createElement('a')
    achor.href = uri + base64(format(template, ctx))
    console.log(format(template, ctx))
    achor.download = name
    achor.click()
  }
})()

const table2excel = {}

table2excel.transform = tranform

export default table2excel

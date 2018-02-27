//1、变量 grInstallPath 等号后面的参数是插件安装文件的所在的网站目录，一般从网站的根目
//   录开始寻址，插件安装文件一定要存在于指定目录下。
//2、grVersion 等号后面的参数是插件安装包的版本号，如果有新版本插件安装包，应上传新版
//   本插件安装文件到网站对应目录，并更新这里的版本号。
//3、更多详细信息请参考帮助中“报表插件(WEB报表)->在服务器部署插件安装包”部分
import Vue from 'vue'
console.log(this, 'huishiusgxiusgxusi')
var grInstallPath = 'grinstall'//实际项目中应该写从根目录寻址的目录，如grInstallPath="/myapp/report/grinstall"
var grVersion = '6,0,15,0618'
var GridReport = {}
//以下注册号为本机开发测试注册号，报表访问地址为localhost时可以去掉试用标志
//购买注册后，请用您的注册用户名与注册号替换下面变量中值
var grUserName = '锐浪报表插件本机开发测试注册'
var grSerialNo = '8PJH495VA61FLI5TG0L4KB2337F1G7AKLD6LNNA9F9T28IKRU6N33P8Z6XX4BUYB5E9NZ6INMD5T8EN47IX63VV7F9BJHB5ZJQQ6MX3J3V12C4XDHU97SXX6X3VA57KCB6'
//报表插件目前只能在32位浏览器中使用
var _grPlatform = window.navigator.platform
if (_grPlatform.indexOf('64') > 0) {
    alert('锐浪Grid++Report报表插件不能运行在64位浏览器中，相关报表与打印功能将无法正常运新，请改用32位浏览器！')
}
//区分浏览器(IE or not)
var _grAgent = navigator.userAgent.toLowerCase()
var _grIsIE = _grAgent.indexOf('msie') > 0
var grCodeBase
if (_grIsIE) {
    grCodeBase = 'codebase="' + grInstallPath + '/grbsctl6.cab#Version=' + grVersion + '"'
} else {
    grCodeBase = ''
}
//插入一个报表对象，用来判断插件是否已经安装，或是否需要安装更新版本
GridReport.Install_InsertReport = function () {
    var typeid
    if (_grIsIE) {
        typeid = 'classid="clsid:396841CC-FC0F-4989-8182-EBA06AA8CA2F" '
    } else {
        typeid = 'type="application/x-grplugin6-report" '
    }
    typeid += grCodeBase
    document.write('<object style="display:none" id="_ReportOK" ' + typeid)
    document.write(' width="0" height="0" VIEWASTEXT>')
    document.write('</object>')
}
//用来判断插件是否已经安装，或是否需要安装更新版本。如果需要安装，则在网页中插入安装相关的文字内容
//如果插件已经安装且也不要更新，则返回 true，反之为 false。
GridReport.Install_Detect = function () {
    var _ReportOK = document.getElementById('_ReportOK')
    if (_ReportOK.Register === undefined) {  //检查是否安装程序
        return false
    } else if ((_ReportOK.Utility.ShouldUpdatePlugin === undefined) || _ReportOK.Utility.ShouldUpdatePlugin(grVersion) === true) { //检查是否应该下载新版本程序
        return false
    }
    return true
}
//创建报表对象，报表对象是不可见的对象，详细请查看帮助中的 IGridppReport
//Name - 指定插件对象的ID，可以用js代码 document.getElementById("%Name%") 获取报表对象
//EventParams - 指定报表对象的需要响应的事件，如："<param name='OnInitialize' value=OnInitialize> <param name='OnProcessBegin' value=OnProcessBegin>"形式，可以指定多个事件
GridReport.CreateReport = function (PluginID, EventParams) {
    var typeid
    if (_grIsIE) {
        typeid = 'classid="clsid:396841CC-FC0F-4989-8182-EBA06AA8CA2F" '
    } else {
        typeid = 'type="application/x-grplugin6-report"'
    }
    typeid += grCodeBase
    document.write('<object id="' + PluginID + '" ' + typeid)
    document.write(' width="0" height="0" VIEWASTEXT>')
    if (EventParams !== undefined) {
        document.write(EventParams)
    }
    document.write('</object>')
    document.write('<script type="text/javascript">')
    document.write(PluginID + '.Register("' + grUserName + '", "' + grSerialNo + '")')
    document.write('</script>')
}
//获取报表对象的统一方法，该报表对象是不可见的对象
GridReport.GetReport = function () {
    var Report = document.getElementById('Report')
    if (Report === null || Report === undefined) {
         Vue.$confirm('需要安装该网站提供的插件才能正常打印，点击\'确定\'下载安装', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //IE浏览器可以直接点击运行，谷歌内核的需要先下载，后安装
            window.location.href = '/ReportPlugins/grbsctl6.exe'
        }).catch((e) => {
          Vue.$alert('错误', '文件找不到,错误代码:' + e, 'error')
        })
        /*$.messager.confirm('提醒', '需要安装该网站提供的插件才能正常打印，点击\'确定\'下载安装', function (ok) {
            if (ok) {
                try {
                    //IE浏览器可以直接点击运行，谷歌内核的需要先下载，后安装
                    window.location.href = '/ReportPlugins/grbsctl6.exe'
                    return
                } catch (e) {
                   // $.messager.alert('错误', '文件找不到,错误代码:' + e, 'error')
                    this.$alert('错误', '文件找不到,错误代码:' + e, 'error')
                }
            }
        })*/
        return
    }
    return Report
}
//用更多的参数创建报表打印显示插件，详细请查看帮助中的 IGRPrintViewer
//PluginID - 插件的ID，可以通过 var ReportViewer = document.getElementById("%PluginID%") 这样的方式获取插件引用变量
//Width - 插件的显示宽度，"100%"为整个显示区域宽度，"500"表示500个屏幕像素点
//Height - 插件的显示高度，"100%"为整个显示区域高度，"500"表示500个屏幕像素点
//ReportURL - 获取报表模板的URL
//DataURL - 获取报表数据的URL
//AutoRun - 指定插件在创建之后是否自动生成并展现报表,值为false或true
//ExParams - 指定更多的插件属性阐述,形如: "<param name="%ParamName%" value="%Value%">"这样的参数串
GridReport.CreatePrintViewerEx2 = function (PluginID, Width, Height, ReportURL, DataURL, AutoRun, ExParams) {
    var typeid
    if (_grIsIE) {
        typeid = 'classid="clsid:ABB64AAC-D7E8-4733-B052-1B141C92F3CE" ' + grCodeBase
    } else {
        typeid = 'type="application/x-grplugin6-printviewer"'
    }
    document.write('<object id="' + PluginID + '" ' + typeid)
    document.write(' width="' + Width + '" height="' + Height + '">')
    document.write('<param name="ReportURL" value="' + ReportURL + '">')
    document.write('<param name="DataURL" value="' + DataURL + '">')
    document.write('<param name="AutoRun" value=' + AutoRun + '>')
    document.write('<param name="SerialNo" value="' + grSerialNo + '">')
    document.write('<param name="UserName" value="' + grUserName + '">')
    document.write(ExParams)
    document.write('</object>')
}
//用更多的参数创建报表打印显示插件，详细请查看帮助中的 IGRDisplayViewer
//PluginID - 插件的ID，可以通过 var ReportViewer = document.getElementById("%PluginID%") 这样的方式获取插件引用变量
//Width - 插件的显示宽度，"100%"为整个显示区域宽度，"500"表示500个屏幕像素点
//Height - 插件的显示高度，"100%"为整个显示区域高度，"500"表示500个屏幕像素点
//ReportURL - 获取报表模板的URL
//DataURL - 获取报表数据的URL
//AutoRun - 指定插件在创建之后是否自动生成并展现报表,值为false或true
//ExParams - 指定更多的插件属性阐述,形如: "<param name="%ParamName%" value="%Value%">"这样的参数串
GridReport.CreateDisplayViewerEx2 = function (PluginID, Width, Height, ReportURL, DataURL, AutoRun, ExParams) {
    var typeid
    if (_grIsIE) {
        typeid = 'classid="clsid:600CD6D9-EBE1-42cb-B8DF-DFB81977122E" ' + grCodeBase
    } else {
        typeid = 'type="application/x-grplugin6-displayviewer"'
    }
    document.write('<object id="' + PluginID + '" ' + typeid)
    document.write(' width="' + Width + '" height="' + Height + '">')
    document.write('<param name="ReportURL" value="' + ReportURL + '">')
    document.write('<param name="DataURL" value="' + DataURL + '">')
    document.write('<param name="AutoRun" value=' + AutoRun + '>')
    document.write('<param name="SerialNo" value="' + grSerialNo + '">')
    document.write('<param name="UserName" value="' + grUserName + '">')
    document.write(ExParams)
    document.write('</object>')
}
//以 ReportDesigner 为 ID 创建报表设计器插件(Designer)，详细请查看帮助中的 IGRDesigner
//Width - 插件的显示宽度，"100%"为整个显示区域宽度，"500"表示500个屏幕像素点
//Height - 插件的显示高度，"100%"为整个显示区域高度，"500"表示500个屏幕像素点
//LoadReportURL - 读取报表模板的URL，运行时从此URL读入报表模板数据并加载到设计器插件
//SaveReportURL - 保存报表模板的URL，保存设计后的结果数据，由此URL的服务在WEB服务端将报表模板持久保存
//DataURL - 获取报表运行时数据的URL，在设计器中进入打印视图与查询视图时从此URL获取报表数据
//ExParams - 指定更多的插件属性阐述,形如: "<param name="%ParamName%" value="%Value%">"这样的参数串
GridReport.CreateDesignerEx = function (Width, Height, LoadReportURL, SaveReportURL, DataURL, ExParams) {
    var typeid
    if (_grIsIE) {
        typeid = 'classid="clsid:CE666189-5D7C-42ee-AAA4-E5CB375ED3C7" ' + grCodeBase
    } else {
        typeid = 'type="application/x-grplugin6-designer"'
    }
    document.write('<object id="ReportDesigner" ' + typeid)
    document.write(' width="' + Width + '" height="' + Height + '">')
    document.write('<param name="LoadReportURL" value="' + LoadReportURL + '">')
    document.write('<param name="SaveReportURL" value="' + SaveReportURL + '">')
    document.write('<param name="DataURL" value="' + DataURL + '">')
    document.write('<param name="SerialNo" value="' + grSerialNo + '">')
    document.write('<param name="UserName" value="' + grUserName + '">')
    document.write(ExParams)
    document.write('</object>')
}
//以 ReportViewer 为 ID 创建报表打印显示器插件(PrintViewer)，参数说明参考 CreatePrintViewerEx2
GridReport.CreatePrintViewerEx = function (Width, Height, ReportURL, DataURL, AutoRun, ExParams) {
    GridReport.CreatePrintViewerEx2('ReportViewer', Width, Height, ReportURL, DataURL, AutoRun, ExParams)
}
//以 ReportViewer 为 ID 创建报表查询显示器插件(DisplayViewer)，参数说明参考 CreateDisplayViewerEx2
GridReport.CreateDisplayViewerEx = function (Width, Height, ReportURL, DataURL, AutoRun, ExParams) {
    GridReport.CreateDisplayViewerEx2('ReportViewer', Width, Height, ReportURL, DataURL, AutoRun, ExParams)
}
//以 ReportViewer 为 ID 创建报表打印显示器插件(PrintViewer)，插件大小为100%充满位置区域，插件创建后会自动运行，参数说明参考 CreatePrintViewerEx2
GridReport.CreatePrintViewer = function (ReportURL, DataURL) {
    GridReport.CreatePrintViewerEx('100%', '100%', ReportURL, DataURL, true, '')
}
//以 ReportViewer 为 ID 创建报表查询显示器插件(DisplayViewer)，插件大小为100%充满位置区域，插件创建后会自动运行，参数说明参考 CreateDisplayViewerEx2
GridReport.CreateDisplayViewer = function (ReportURL, DataURL) {
    GridReport.CreateDisplayViewerEx('100%', '100%', ReportURL, DataURL, true, '')
}
//以 ReportDesigner 为 ID 创建报表设计器插件(Designer)，插件大小为100%充满位置区域，参数说明参考 CreateDesignerEx
GridReport.CreateDesigner = function (LoadReportURL, SaveReportURL, DataURL) {
    GridReport.CreateDesignerEx('100%', '100%', LoadReportURL, SaveReportURL, DataURL, '')
}
export default GridReport

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import router from './router'
import store from './store'
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Dialog,
  Form,
  FormItem,
  Input,
  Option,
  Radio,
  RadioGroup,
  Row,
  Select,
  Table,
  TableColumn,
  TabPane,
  pagination,
  Tabs,
  Popover,
  Message,
  MessageBox,
  Menu,
  MenuItem,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Loading
} from 'element-ui'
import 'normalize.css'
// import '../../theme/index.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/common/style/icon.css'
import App from './App'

Vue.use(Checkbox)
Vue.use(Col)
Vue.use(Input)
Vue.use(Option)
Vue.use(Row)
Vue.use(Select)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Button)
Vue.use(DatePicker)
Vue.use(Card)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Dialog)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(pagination)
Vue.use(Popover)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Loading)

Vue.component(Message.name, Message)
Vue.component(MessageBox.name, MessageBox)

Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.showLoading = function (text) {
  text = text || '正在加载...'
  return Loading.service({text: text})
}

Vue.prototype.go = function (arg) {
  if (typeof arg === 'number') {
    router.go(arg)
  } else {
    router.push(arg)
  }
}

// 消息提示弹出框
Vue.prototype.messageInfo = function (text) {
  return this.$alert(text, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
}

Vue.prototype.goBack = function (num) {
  this.$router.go(num)
}
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

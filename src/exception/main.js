// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {
  Button,
  Card,
  Checkbox,
  CheckboxGroup,
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
  Loading,
  Tooltip,
  inputNumber
} from 'element-ui'
import 'normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/common/style/icon.css'

Vue.use(Checkbox)
Vue.use(CheckboxGroup)
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
Vue.use(Loading)
Vue.use(Tooltip)
Vue.use(inputNumber)

Vue.component(Message.name, Message)
Vue.component(MessageBox.name, MessageBox)

Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt

Vue.config.productionTip = false

Vue.prototype.showLoading = function (text) {
  text = text || '正在加载...'
  return Loading.service({text: text})
}

// 消息提示弹出框
Vue.prototype.messageInfo = function (text) {
  return this.$alert(text, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})

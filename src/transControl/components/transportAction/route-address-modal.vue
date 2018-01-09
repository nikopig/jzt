<template>
  <div>
    <el-dialog class='Mydialog' title="地址选择" :close-on-click-modal="false" :visible.sync="visible">
      <el-tabs v-model="activeName">
        <el-tab-pane label="委托方地址" name="consi">
        <el-form>
          <div class='form-group'>
            <el-input v-model="consi.keyword" auto-complete="off" placeholder='输入关键字搜索' icon="search"></el-input>
          </div>
        </el-form>
        <div class='tabel-wrapper'>
          <el-table stripe ref='singleTable' :data="realConsi" height='300' @row-dblclick='_confirm'>
            <el-table-column label="委托方" prop="All_Name" width="200"></el-table-column>
            <el-table-column label="地址简称" prop="Address_Shortname" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="联系人" prop="Contact_Name"></el-table-column>
            <el-table-column label="联系电话" prop="Contact_Phone" width="150"></el-table-column>
            <el-table-column label="省" prop="Province_Name"></el-table-column>
            <el-table-column label="市" prop="City_Name"></el-table-column>
            <el-table-column label="区/县" prop="Area_Name" width="100"></el-table-column>
            <el-table-column label="详细地址" prop="Address" width="250" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
        <el-tab-pane label="物流中心地址" name="logistics">
          <el-form>
            <div class='form-group'>
              <el-input v-model="logistics.keyword" auto-complete="off" placeholder='输入关键字搜索' icon="search"></el-input>
            </div>
          </el-form>
          <div class='tabel-wrapper'>
            <el-table stripe ref='singleTable' :data="realLogistics" height='300' @row-dblclick='_confirm'>
              <el-table-column label="物流中心" prop="All_Name" width="200"></el-table-column>
              <el-table-column label="地址简称" prop="Address_Shortname" width="200" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="联系人" prop="Contact_Name"></el-table-column>
              <el-table-column label="联系电话" prop="Contact_Phone" width="150"></el-table-column>
              <el-table-column label="省" prop="Province_Name"></el-table-column>
              <el-table-column label="市" prop="City_Name"></el-table-column>
              <el-table-column label="区/县" prop="Area_Name" width="100"></el-table-column>
              <el-table-column label="详细地址" prop="Address" width="250" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="承运商地址" name="carri">
          <el-form>
            <div class='form-group'>
              <el-input v-model="carri.keyword" auto-complete="off" placeholder='输入关键字搜索' icon="search"></el-input>
            </div>
          </el-form>
          <div class='tabel-wrapper'>
            <el-table stripe ref='singleTable' :data="realCarri" height='300' @row-dblclick='_confirm'>
              <el-table-column label="承运商" prop="All_Name" width="200"></el-table-column>
              <el-table-column label="地址简称" prop="Address_Shortname" width="200" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="联系人" prop="Contact_Name"></el-table-column>
              <el-table-column label="联系电话" prop="Contact_Phone" width="150"></el-table-column>
              <el-table-column label="省" prop="Province_Name"></el-table-column>
              <el-table-column label="市" prop="City_Name"></el-table-column>
              <el-table-column label="区/县" prop="Area_Name" width="100"></el-table-column>
              <el-table-column label="详细地址" prop="Address" width="250" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="外部中转地址" name="outerTransfer">
          <el-form>
            <div class='form-group'>
              <el-input v-model="outerTransfer.keyword" auto-complete="off" placeholder='输入关键字搜索' icon="search"></el-input>
            </div>
          </el-form>
          <div class='tabel-wrapper'>
            <el-table stripe ref='singleTable' :data="realOuterTransfer" height='300' @row-dblclick='_confirm'>
              <el-table-column label="中转地简称" prop="Address_Shortname" width="200" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column label="联系人" prop="Contact_Name"></el-table-column>
              <el-table-column label="联系电话" prop="Contact_Phone" width="150"></el-table-column>
              <el-table-column label="省" prop="Province_Name"></el-table-column>
              <el-table-column label="市" prop="City_Name"></el-table-column>
              <el-table-column label="区/县" prop="Area_Name" width="100"></el-table-column>
              <el-table-column label="详细地址" prop="Address" width="250" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
          </div>
          <div class="footer">
            <el-button type="danger" @click="showAddDialog = true">新增</el-button>
            <el-button type="primary" @click="visible = false">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog class="add" title="手工填写地址信息" :visible.sync="showAddDialog">
      <el-form ref="addForm" label-width="90px" :model="form">
        <el-form-item label="所在地址" prop="selectOptions" :rules="{type: 'array', required: true, message: '请输入所在地址', trigger: 'blur'}">
          <el-cascader
            :options="regionData"
            v-model="form.selectOptions"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="地址简称" prop="shortAddress" :rules="{required: true, message: '请输入地址简称', trigger: 'blur'}">
          <el-input v-model="form.shortAddress"></el-input>
        </el-form-item>
        <el-form-item label="收货人姓名" prop="contactName" :rules="{required: true, message: '请输入收货人姓名', trigger: 'blur'}">
          <el-input v-model="form.contactName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactPhone" :rules="{required: true, message: '请输入联系方式', trigger: 'blur'}">
          <el-input v-model="form.contactPhone"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address" :rules="{required: true, message: '请输入详细地址', trigger: 'blur'}">
          <el-input type="textarea" v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="submitValidate">保存</el-button>
        <el-button type="success" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="showAddDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
  import Api from '@/common/js/api.js'
  import regionData from '@/common/js/region.js'
  export default {
    name: 'routeAddressModal',
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      // 数据总条数
      total: {
        type: Number,
        default: 10
      },
      // 是否分页
      isPages: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        visible: this.isVisible,
        showAddDialog: false, // 新增中转地址弹窗
        activeName: 'consi',
        consi: { // 委托方地址
          keyword: '',
          data: []
        },
        logistics: { // 物流中心地址
          keyword: '',
          data: []
        },
        carri: { // 承运方地址
          keyword: '',
          data: []
        },
        outerTransfer: { // 外部中转地址
          keyword: '',
          data: []
        },
        regionData: regionData, // 省市区数据
        form: {
          selectOptions: [],
          address: '',
          shortAddress: '',
          contactName: '',
          contactPhone: ''
        }
      }
    },
    computed: {
      // 委托方地址（过滤后）
      realConsi () {
        return this.consi.data.filter((item) => {
          let keyword = this.consi.keyword
          if (!keyword) return true
          return (item.All_Name.indexOf(keyword) !== -1) || (item.Address_Shortname.indexOf(keyword) !== -1) || (item.Contact_Name.indexOf(keyword) !== -1) || (item.Contact_Phone.indexOf(keyword) !== -1)
        })
      },
      // 物流中心地址（过滤后）
      realLogistics () {
        return this.logistics.data.filter((item) => {
          let keyword = this.logistics.keyword
          if (!keyword) return true
          return (item.All_Name.indexOf(keyword) !== -1) || (item.Address_Shortname.indexOf(keyword) !== -1) || (item.Contact_Name.indexOf(keyword) !== -1) || (item.Contact_Phone.indexOf(keyword) !== -1)
        })
      },
      // 承运商地址（过滤后）
      realCarri () {
        return this.carri.data.filter((item) => {
          let keyword = this.carri.keyword
          if (!keyword) return true
          return (item.All_Name.indexOf(keyword) !== -1) || (item.Address_Shortname.indexOf(keyword) !== -1) || (item.Contact_Name.indexOf(keyword) !== -1) || (item.Contact_Phone.indexOf(keyword) !== -1)
        })
      },
      // 外部中转地址（过滤后）
      realOuterTransfer () {
        return this.outerTransfer.data.filter((item) => {
          let keyword = this.outerTransfer.keyword
          if (!keyword) return true
          return (item.All_Name.indexOf(keyword) !== -1) || (item.Address_Shortname.indexOf(keyword) !== -1) || (item.Contact_Name.indexOf(keyword) !== -1) || (item.Contact_Phone.indexOf(keyword) !== -1)
        })
      }
    },
    watch: {
      visible (val) {
        this.$emit('update:isVisible', val)
        if (val) this.getData()
      },
      showAddDialog (val) {
        if (val && this.$refs.addForm) this.resetForm()
      },
      isVisible (val) {
        this.visible = val
      }
    },
    methods: {
      // 重置表单
      resetForm () {
        this.$refs.addForm.resetFields()
      },
      // 新增
      addAddress () {
        let params = {
          address_Json: JSON.stringify({
            Province: this.form.selectOptions[0],
            City: this.form.selectOptions.length > 1 ? this.form.selectOptions[1] : '',
            Area: this.form.selectOptions.length > 2 ? this.form.selectOptions[2] : '',
            Address: this.form.address,
            Address_Shortname: this.form.shortAddress,
            Contact_Name: this.form.contactName,
            Contact_Phone: this.form.contactPhone,
            Is_Default: 'N',
            Creator: Api.userInfo.USERID,
            All_Id: Api.userInfo.Operator_Id
          })
        }
        Api.post('TMP_TransportTaskDD_AddressSave', params)
          .then(resp => {
            if (resp.Flag) {
              this.$alert('新增中转地址成功')
              this.showAddDialog = false
              this.getOutAddress()
//              setTimeout(this.getOutAddress, 5000)
//              this.$nextTick()
            } else {
              this.messageInfo(resp.ErrInfo)
            }
          })
      },
      submitValidate () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addAddress()
          } else {
            return false
          }
        })
      },
       // 获取数据
      getData () {
        // 获取委托方地址
        Api.get('TMP_TransportTaskScheding_GetWlzxConAddr', {Operator_Id: Api.userInfo.Operator_Id, Address_Type: '3', Begin: 0, End: 100})
          .then((resp) => {
            if (resp.Flag) {
              this.consi.data = resp.MsgInfo
            } else {
              this.messageInfo(resp.ErrInfo)
            }
          })
        // 获取物流中心地址
        Api.get('TMP_TransportTaskScheding_Yd_GetWlzxAddr', {})
          .then((resp) => {
            if (resp.Flag) {
              this.logistics.data = resp.MsgInfo
            } else {
              this.messageInfo(resp.ErrInfo)
            }
          })
        // 获取承运商地址
        Api.get('TMP_TransportTaskScheding_GetWlzxConAddr', {Operator_Id: Api.userInfo.Operator_Id, Address_Type: '5', Begin: 0, End: 100})
          .then((resp) => {
            if (resp.Flag) {
              this.carri.data = resp.MsgInfo
            } else {
              this.messageInfo(resp.ErrInfo)
            }
          })
        this.getOutAddress()
      },
      // 外部中转地址
      getOutAddress () {
        Api.get('TMP_TransportTaskScheding_GetZzdAddr', {Operator_Id: Api.userInfo.Operator_Id, Begin: 0, End: 100})
          .then((resp) => {
            if (resp.Flag) {
              this.outerTransfer.data = resp.MsgInfo
            } else {
              this.messageInfo(resp.ErrInfo)
            }
          })
      },
      hide () {
        this.$emit('update:isVisible', false)
      },
      // 确定按钮
      _confirm (row, event) {
        this.$emit('change', row)
        this.hide()
      }
    }
  }
</script>
<style lang="less">
  .Mydialog{
    font-family: "Microsoft YaHei";
    table{
      width:100% !important;
    }
    .el-input__icon{
      margin:0;
    }
    .el-dialog{
      border-radius: 4px;
      .el-dialog__header{
        background-color: #eef6f6;
        padding: 11px 13px;
        border-radius: 4px 4px 0 0;
        .el-dialog__title{
          font-size:16px;
          font-weight: 500;
        }
      }
      .el-dialog__body{
        padding:20px;
        .form-group{
          width: 400px;
          height:30px;
          margin-bottom:15px;
          .el-input{
            height:100%;
            border-radius: 0;
          }
        }
        .el-table{
          .el-table__header-wrapper{
            th{
              height:32px;
              .cell{
                font-size: 12px;
                font-weight: 600;
              }
            }
          }
          .el-table__body-wrapper{
            td{
              height:32px;
              .cell{
                line-height:16px;
                font-size:12px;
                white-space: nowrap;
                .name-wrapper{
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }
          }
        }
        .el-pagination{
          margin-top:15px;
        }
        .footer {
          padding-top: 15px;
          text-align: right;
        }
      }
    }
  }
  .add {
    .el-dialog.el-dialog--small {
      height: 531px
    }
    .el-cascader {
      width: 100%;
    }
  }
</style>

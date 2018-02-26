<template>
<div>
    <div class="costServices">
        <div class="common-container">
            <el-form :inline="true" size="small" label-width="72px" class="clearfix ">
                <el-form-item label="费用类型：">
                    <el-input v-model="searchCost"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" icon="el-icon-search" @click="costSearch" >查询</el-button>
                </el-form-item>
                <el-form-item class="f-r">
                    <el-button type="text" @click="addCost"><i class="el-icon-plus"></i>&nbsp;新增费用类型</el-button>
                    <el-button type="text" @click="addSer"><i class="el-icon-plus"></i>&nbsp;新增服务项目</el-button>
                    <el-button type="text" @click="removeCost"><i class="el-icon-delete"></i>&nbsp;删除费用类型</el-button>
                    <el-button type="text" @click="removeSer"><i class="el-icon-delete"></i>&nbsp;删除服务项目</el-button>
                </el-form-item>
            </el-form>
            <div class="table-box layout">
                <div class="table-l" style="width:320px;">
                    <el-table :data="listData"
                    highlight-current-row
                    style="width:100%;"
                    ref= "mul"
                    @selection-change="selectCheckBoxsL"
                    @row-click="selectChangel" >
                        <el-table-column type="selection" width="40"></el-table-column>
                        <el-table-column prop="setIndexl" label="序号" width="40"></el-table-column>
                        <el-table-column prop="Service_No" label="费用类型编号"></el-table-column>
                        <el-table-column prop="Service_Name" label="费用类型名称"></el-table-column>
                        <el-table-column label="操作" width="55">
                            <template slot-scope="scope">
                                <el-button class="primary" type="text" size="small" @click="editCost(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div>
                        <el-pagination
                            v-show="pageL.isShow"
                            layout="total, prev, pager, next, jumper"
                            :page-size="pageL.pageSize"
                            :total="pageL.total"
                            @current-change="handleCurrentChangeL" >
                        </el-pagination>
                    </div>
                </div>
                <div class="table-r" style="width:100%;" v-show="isTableSer">
                        <el-table :data="tableData"
                        @row-click="selectChanger"
                        ref="multipleTable"
                        highlight-current-row
                        @selection-change="selectCheckBoxsR">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="setIndexr" label="序号" width="60"></el-table-column>
                        <el-table-column prop="Service_No" label="服务项目编号" width="80"></el-table-column>
                        <el-table-column prop="Service_Name" label="服务项目名称" show-overflow-tooltip width="120"></el-table-column>
                        <el-table-column prop="Charging_Rule" label="计算规则(预)" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="remarks" label="备注" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="Creator_Name" label="创建人" width="65"></el-table-column>
                        <el-table-column prop="Created_Time" label="创建时间" width="150"></el-table-column>
                        <el-table-column label="操作" width="55">
                            <template slot-scope="scope">
                                <el-button class="primary" type="text" size="small" @click="editSer(scope.$index, scope.row)"><i class="el-icon-edit" v-show="isEdit"></i></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div>
                         <el-pagination
                            v-show="pageR.isShow"
                            layout="total, prev, pager, next, jumper"
                            :page-size="pageR.pageSize"
                            :total="pageR.total"
                            @current-change="handleCurrentChangeR" >
                        </el-pagination>
                    </div>
                </div>
            </div>
            <el-dialog :title="dialog.addEidetCost" :visible.sync="dialogFormCostVisible" >
                <div class="formcost">
                    <el-form :inline="true" size="small" label-width="120px" class="clearfix" :rules="rules" :model="formCostData">
                <el-form-item label="费用类型编号："  prop="Cost_number">
                    <el-input v-model="formCostData.Cost_number"></el-input>
                </el-form-item>
                <el-form-item label="费用类型名称：" prop="Cost_name" >
                    <el-input v-model="formCostData.Cost_name"></el-input>
                </el-form-item>
               </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                 <el-button @click="dialogFormCostVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveCost">保 存</el-button>
                </div>
            </el-dialog>
            <el-dialog :title="dialog.addEidetSer" :visible.sync="dialogFormServiceVisible" >
                 <div class="formservice">
                <el-form :inline="true" size="small" label-width="120px" class="clearfix" :model="formSerData" :rules="rules2">
                <el-form-item label="服务项目编号：" prop="SerNumber">
                    <el-input v-model="formSerData.SerNumber"></el-input>
                </el-form-item>
                <el-form-item label="服务项目名称：" prop="SerName">
                    <el-input v-model="formSerData.SerName"></el-input>
                </el-form-item>
                <el-form-item label="计算规则（预）：" prop="SerCalculation">
                    <el-input v-model="formSerData.SerCalculation" ></el-input>
                </el-form-item>
                <el-form-item label="备注；" prop="SerRemarks">
                    <el-input v-model="formSerData.SerRemarks" type="textarea"></el-input>
                </el-form-item>
               </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                 <el-button @click="dialogFormServiceVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveSer">保 存</el-button>
                </div>
            </el-dialog>
            <el-dialog title="提示" :visible.sync="dialogDeleteVisible" width="30%">
                <span v-html="txt.delTxt"></span>
                 <span slot="footer" class="dialog-footer">
                 <el-button @click="dialogDeleteVisible = false">取 消</el-button>
                <el-button type="primary" @click="deletes">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</div>
</template>

<script>
    import Api from '@/common/js/api'
    import { DateFtt } from '@/common/js/utils'
    export default {
        name: 'costservices',
        props: [],
        components: {},
        data () {
            var validateCostSerNu = (rule, value, callback) => {
                let regCap = /^[A-Z]*$/
                if (!value) {
                    callback(new Error('请填写费用类型编号'))
                } else {
                    if (!regCap.test(value)) {
                         callback(new Error('请填写大写字母'))
                    } else {
                        if (this.getLength(value) > 10) {
                            callback(new Error('请输入10个字符'))
                        } else {
                             callback()
                        }
                    }
                }
            }
            var validateCostSerNam = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请填写费用类型名称'))
                } else {
                    if (this.getLength(value) > 20) {
                        callback(new Error('请输入20个字符'))
                    } else {
                        callback()
                    }
                }
            }
            var validateCostSerCal = (rule, value, callback) => {
                    if (this.getLength(value) > 40) {
                        callback(new Error('请输入40个字符'))
                    } else {
                        callback()
                    }
            }
             var validateCostSerRem = (rule, value, callback) => {
                    if (this.getLength(value) > 100) {
                        callback(new Error('请输入100个字符'))
                    } else {
                        callback()
                    }
            }
            return {
                tableData: [{}],
                listData: [{}],
                formCostData: {
                    Cost_number: '',
                    Cost_name: ''
                },
                formSerData: {
                    SerNumber: '',
                    SerName: '',
                    SerCalculation: '',
                    SerRemarks: '',
                    Founder: '',
                    Dates: '',
                    serNuTxt: '',
                    serNaTxt: '',
                    serCalTxt: '',
                    serRemTxt: ''
                },
                pageL: {
                    currentPage: 1, // 当前页
                    pageSize: 10, // 每页条数
                    startIndex: 0, //开始的页数
                    total: 40,
                    isShow: false
                    },
                pageR: {
                    currentPage: 1, // 当前页
                    pageSize: 10, // 每页条数
                    startIndex: 0, //开始的页数
                    total: 40, // 总条数
                    isShow: false
                },
                txt: {
                    delTxt: ''
                },
                dialog: {
                    addEidetCost: '', //设置弹窗文字提示信息
                    addEidetSer: ''
                },
                costsSers: {
                    Cost_number: '',
                    Super_Id: '',
                    SerNumber: '', //层级class为2  其值表示新建的Ser_Id
                    SearchCost: '',
                    selectNu: ''
                }, // 保存选择当前行的数据
                isEdit: false,
                isEditCost: false,
                isEditSer: false,
                dialogFormCostVisible: false,
                dialogFormServiceVisible: false,
                dialogDeleteVisible: false,
                deleteCost: false,
                deleteSer: false,
                costSerParam: {}, // 请求同一接口保存数据 分次调用
                costIndex: '',
                serIndex: '',
                isTableSer: false, //控制右边显示 当显示无数据 则不显示
                searchCost: '', //查询框的值
                selectionR: [],
                rules: {
                    Cost_number: [{required: true, validator: validateCostSerNu, trigger: 'blur'}],
                    Cost_name: [{required: true, validator: validateCostSerNam, trigger: 'blur'}]
                },
                rules2: {
                    SerNumber: [{required: true, validator: validateCostSerNu, trigger: 'blur'}],
                    SerName: [{required: true, validator: validateCostSerNam, trigger: 'blur'}],
                    SerCalculation: [{validator: validateCostSerCal, trigger: 'blur'}],
                    SerRemarks: [{validator: validateCostSerRem, trigger: 'blur'}]
                }
            }
        },
        computed: {},
        methods: {
            selectCheckBoxsL (selection) {  //删除费用类
                console.log(selection)
                let selectBoxs = []
                selection.forEach((item, index) => {
                    return selectBoxs.push(item.Ser_Id)
                })
                this.costsSers.Cost_number = selectBoxs.join(',')
                console.log(this.costsSers.Cost_number)
            },
            selectCheckBoxsR (selection) { // 多选删除服务类型
                let selectBoxs = []
                if (selection.length > 0) {
                    this.costsSers.selectNu = selection[0].Super_Id
                    this.toggleSelectionR(true)
                }
                if (selection.length === 0) {
                    this.toggleSelectionR(false)
                }
                selection.forEach((item, index) => {
                    return selectBoxs.push(item.Ser_Id)
                })
                this.costsSers.SerNumber = selectBoxs.join(',')
                console.log(this.costsSers.SerNumber)
            },
            handleCurrentChangeL (num) { //获取当前页数
                this.pageR.startIndex = 0
                this.pageL.currentPage = num
                this.pageL.startIndex = (this.pageL.currentPage - 1) * this.pageL.pageSize
                this.getSerData()
            },
            handleCurrentChangeR (num) { //获取当前页数
                this.pageR.currentPage = num
                this.pageR.startIndex = (this.pageR.currentPage - 1) * this.pageR.pageSize
                this.getSerData()
            },
            selectChangel (row, event) { //获取当前行的值
                this.pageR.startIndex = 0
                this.pageR.isShow = false
                this.costIndex = row.setIndexl - 1
                this.costsSers.Cost_number = row.Ser_Id
                this.costsSers.Super_Id = row.Super_Id
                this.getSerData()
                this.$refs.mul.toggleRowSelection(row)
            },
            selectChanger (row, event, column) { //获取当前行的值
                console.log(row)
                this.serIndex = row.setIndexr - 1
                this.costsSers.Cost_number = row.Super_Id
                this.$refs.multipleTable.toggleRowSelection(row)
                // this.costsSers.SerNumber = row.Ser_Id
            },
            getIndexl () { //获取序号值
               for (let i = 0; i < this.listData.length; i++) {
                   this.listData[i].setIndexl = i + 1 + this.pageL.startIndex
               }
            },
            getIndexr () {
               for (let i = 0; i < this.tableData.length; i++) {
                   this.tableData[i].setIndexr = i + 1 + this.pageR.startIndex
               }
            },
            editCost (index, row) {   // 编辑费用类型
                this.dialogFormCostVisible = true
                this.init()
                this.isEditCost = false
                this.dialog.addEidetCost = '编辑费用类型'
                this.costsSers.Cost_number = row.Ser_Id
                this.costsSers.Super_Id = row.Super_Id
                this.formCostData.Cost_number = row.Service_No
                this.formCostData.Cost_name = row.Service_Name
            },
            editSer (index, row) { //编辑服务类型
                this.dialogFormServiceVisible = true
                this.init()
                this.isEditSer = false
                this.dialog.addEidetSer = '编辑服务项目'
                this.costsSers.Cost_number = row.Super_Id
                this.costsSers.SerNumber = row.Ser_Id
                this.formSerData.SerNumber = row.Service_No
                this.formSerData.SerName = row.Service_Name
                this.formSerData.SerCalculation = row.Charging_Rule ? row.Charging_Rule : '' //计算规则
                this.formSerData.SerRemarks = row.remarks ? row.remarks : ''//备注
            },
            saveSer () {  // 保存服务类型
                this.formSerData.SerNumber = this.formSerData.SerNumber.toUpperCase()
                let regCap = /^[A-Z]*$/
                if (!(this.formSerData.SerNumber && this.formSerData.SerName)) {
                    this.$alert('表单信息未填写完整', '提示称', {
                        confirmButtonText: '确定'
                    })
                    return
                }
                if (!regCap.test(this.formSerData.SerNumber)) {
                    return
                }
                if (this.getLength(this.formSerData.SerNumber) > 10) {
                     this.$alert('服务项目编号请输入10个字符', '提示称', {
                        confirmButtonText: '确定'
                    })
                    return
                }
                if (this.getLength(this.formSerData.SerName) > 20) {
                    return
                }
                if (this.getLength(this.formSerData.SerCalculation) > 40) {
                    return
                }
                if (this.getLength(this.formSerData.SerRemarks) > 100) {
                    return
                }
                this.dialogFormServiceVisible = false
                let param = {}
                param.data = {}
                if (this.isEditSer) {
                    param.dataType = 'insert'
                    param.data.Super_Id = this.costsSers.Cost_number ? this.costsSers.Cost_number : 0
                } else {
                    param.dataType = 'update'
                    param.data.Ser_Id = this.costsSers.SerNumber !== 0 ? this.costsSers.SerNumber : 0
                }
                    param.data.Service_No = this.formSerData.SerNumber ? this.formSerData.SerNumber : ''
                    param.data.Service_Name = this.formSerData.SerName ? this.formSerData.SerName : ''
                    param.data.Class = 2
                    param.data.Charging_Rule = this.formSerData.SerCalculation ? this.formSerData.SerCalculation : ''
                    param.data.remarks = this.formSerData.SerRemarks ? this.formSerData.SerRemarks : ''
                    param.data.Creator = this.formSerData.Founder
                    this.costSerParam = param
                    this.getCostSer(2) //2代表服务类型
            },
            saveCost () { //保存费用类型
                this.formCostData.Cost_number = this.formCostData.Cost_number.toUpperCase()
                let regCap = /^[A-Z]*$/
                if (!(this.formCostData.Cost_name && this.formCostData.Cost_number)) {
                    this.$alert('表单信息未填写完整', '提示称', {
                        confirmButtonText: '确定'
                    })
                    return
                }
                if (!regCap.test(this.formCostData.Cost_number)) {
                    return
                }
                if (this.getLength(this.formCostData.Cost_number) > 10) {
                    this.$alert('费用类型编号请输入10个字符', '提示称', {
                        confirmButtonText: '确定'
                    })
                    return
                }
                if (this.getLength(this.formCostData.Cost_name) > 20) {
                    return
                }
                this.dialogFormCostVisible = false
                let param = {}
                param.data = {}
                if (this.isEditCost) {
                    param.dataType = 'insert'
                    param.data.Super_Id = this.costsSers.Cost_number !== 0 ? this.costsSers.Cost_number : 0
                    console.log(param.data.Super_Id)
                } else {
                    param.dataType = 'update'
                    param.data.Ser_Id = this.costsSers.Cost_number !== 0 ? this.costsSers.Cost_number : 0
                }
                    param.data.Service_No = this.formCostData.Cost_number ? this.formCostData.Cost_number : ''
                    param.data.Service_Name = this.formCostData.Cost_name ? this.formCostData.Cost_name : ''
                    param.data.Class = 1
                    param.data.Service_No = this.formCostData.Cost_number ? this.formCostData.Cost_number : ''
                    param.data.Service_Name = this.formCostData.Cost_name ? this.formCostData.Cost_name : ''
                    param.data.Creator = this.formSerData.Founder ? this.formSerData.Founder : ''
                    console.log(param)
                    this.costSerParam = param
                    this.getCostSer(1) //1代表费用类型
            },
            addCost () { //新建费用类型
                this.dialogFormCostVisible = true
                this.init()
                this.costsSers.Cost_number = 0
                this.isEditCost = true
                this.dialog.addEidetCost = '新增费用类型'
            },
            addSer () { //新建服务项目
                if (!this.costsSers.Cost_number) {
                    this.$alert('请选择相应的费用类型', '提示称', {
                    confirmButtonText: '确定'
                    })
                    return
                }
                this.dialogFormServiceVisible = true
                this.init()
                this.isEditSer = true
                this.dialog.addEidetSer = '新增服务项目'
            },
            removeCost () { //删除费用类型
                 if (!this.costsSers.Cost_number) {
                    this.$alert('请选择要删除的费用类型数据', '提示称', {
                    confirmButtonText: '确定'
                    })
                    return
                }
                if (this.tableData.length > 0) {
                   this.txt.delTxt = '将删掉费用类型下的服务项目，是否删除, 确定才操作'
                }
                 if (this.tableData.length === 0) {
                    this.txt.delTxt = '将删掉费用类型，是否删除, 确定才操作'
                }
                this.dialogDeleteVisible = true
                this.deleteCost = true
                let param = {}
                param.dataType = 'delete'
                param.data = {}
                param.data.Ser_Id = this.costsSers.Cost_number
                this.costSerParam = param
            },
            deletes () { // 删除提示框
                this.dialogDeleteVisible = false
                if (this.deleteCost) {
                    this.getCostSer(1) //1 代表费用类型
                }
                if (this.deleteSer) {
                    this.getCostSer(2) //2 代表服务类型
                }
            },
            removeSer () { //删除服务项目
                 if (!this.costsSers.SerNumber) {
                    this.$alert('请选择要删除的服务项目数据', '提示称', {
                    confirmButtonText: '确定'
                    })
                    return
                }
                if (this.costsSers.SerNumber) {
                     this.txt.delTxt = '将删掉服务项目，是否删除, 确定才操作'
                }
                this.dialogDeleteVisible = true
                this.deleteSer = true
                let param = {}
                param.dataType = 'delete'
                param.data = {}
                param.data.Ser_Id = this.costsSers.SerNumber
                this.costSerParam = param
            },
            getSessionName () {  //获取登录名
               this.formSerData.Founder = Api.userInfo.USERID
            },
            init () {
                this.formSerData.SerNumber = ''
                this.formSerData.SerName = ''
                this.formSerData.SerCalculation = ''
                this.formSerData.SerRemarks = ''
                this.Dates = ''
                this.formCostData.Cost_number = ''
                this.formCostData.Cost_name = ''
                this.searchCost = ''
                this.dialog.addEidetCost = ''
                this.dialog.addEidetSer = ''
            },
            getCostData () {  //首次请求费用类型数据
                let param = {}
                param.dataType = 'select'
                param.data = {}
                param.data.KeyWords = this.searchCost ? this.searchCost : ''
                param.data.startIndex = this.pageL.startIndex
                param.data.pageSize = this.pageL.pageSize
                param.data.level = '1'
                param.data.SuperId = this.costsSers.Cost_number ? this.costsSers.Cost_number : ''
                this.costSerParam = param
                this.getCostSer(1) //1代表费用类型
            },
            getSerData () {  //点击费用类型下的服务类型数据
                let param = {}
                param.dataType = 'select'
                param.data = {}
                param.data.level = '2'
                param.data.KeyWords = this.searchCost ? this.searchCost : ''
                param.data.userId = this.formSerData.Founder ? this.formSerData.Founder : ''
                param.data.startIndex = this.pageR.startIndex
                param.data.pageSize = this.pageR.pageSize
                param.data.SuperId = this.costsSers.Cost_number ? this.costsSers.Cost_number : ''
                this.costSerParam = param
                this.getCostSer(2)  //2 代表费用类型
            },
            getCostSer (type) {  // 增删改查同一接口
                let url = 'ServiceItemApi'
                let params = {}
                params = this.costSerParam
                params.data = JSON.stringify(params.data)
                this.loadingWait = this.showLoading('请稍候...')
                Api.yuyan(url, params).then((res) => {
                    this.loadingWait.close()
                    if (type === 2) {  //2 代表费用类型
                        if (res.Flag) {
                            this.isTableSer = true
                            this.tableData = res.MsgInfo   //获得服务类型数据
                            if (res.MsgInfo.length > 0) {
                                this.pageR.total = this.tableData[0].bigTotalItems
                                this.costsSers.selectNu = this.tableData[0].Super_Id
                                this.pageR.isShow = true
                                this.isEdit = true
                                this.getIndexr()
                            }
                            if (this.costSerParam.dataType !== 'select') {
                                this.getSerData()
                            }
                        }
                    } else {
                         if (res.Flag) {
                            this.listData = res.MsgInfo  //获得费用类型数据
                            if (res.MsgInfo.length > 0) {
                                this.pageL.total = this.listData[0].bigTotalItems
                                this.pageL.isShow = true
                                this.getIndexl()
                            }
                            if (this.costSerParam.dataType === 'delete') {
                                this.tableData = null
                                this.isTableSer = false
                            }
                            if (this.costSerParam.dataType !== 'select') {
                                this.getCostData()
                            }
                        } else {
                            this.$alert(res.ErrInfo)
                        }
                    }
                    this.isEditCost = false
                    this.isEditSer = false
                    this.deleteCost = false
                    this.deleteSer = false
                })
            },
            costSearch () {
                if (!this.saveCost) {
                    return
                }
                 this.getCostData()
                 this.searchCost = ''
            },
            toggleSelectionR (isBoolean) {
                if (isBoolean === true) {  //代表选中
                    this.listData.forEach((row) => {
                        if (row.Ser_Id === this.costsSers.selectNu) {
                            this.$refs.mul.toggleRowSelection(row, true)
                            return false
                        }
                    })
                }
                if (isBoolean === false) { //设置不选中
                    this.listData.forEach((row) => {
                        if (row.Ser_Id === this.costsSers.selectNu) {
                            this.$refs.mul.toggleRowSelection(row, false)
                            return false
                        }
                    })
                }
            },
            getLength (str) {
                let strLength
                if (str === null) {
                    return 0
                }
                if (typeof str !== 'string') {
                    str += ''
                }
                return str.replace(/[^\x00-\xff]/g, 'aa').length
            }
        },
        created () {
            this.getSessionName()
            this.getCostData()
        },
        mounted () {
            this.init()
        },
        watch: {
        }
    }
</script>

<style lang="less">
    .costServices {
        box-sizing: border-box;
        padding: 15px 0px;
        .common-container {
            min-height: 0px;
             .el-form {
                border:1px solid #e5e5e5;
                box-sizing: border-box;
                padding: 0px 20px;
                    .el-form-item {
                        position: relative;
                        margin-bottom: 0px;
                        p {
                            position: absolute;
                            height: 16px;
                            line-height: 16px;
                            width: 130px;
                            top:19px;
                            right:-140px;
                            margin: 0px;
                            padding: 0px;
                            color:crimson;
                            line-height: 5px;
                            font-size: 20px;
                            vertical-align: middle;
                            b {
                                height: 5px;
                                font-size: 6px;
                                font-weight: 400;
                                position: absolute;
                                top:-4px;
                                left:14px;
                            }
                        }
                    }
                }
            .f-r {
                float:right;
            }
            .table-box {
                margin-top:20px;
                border:0;
                box-sizing: border-box;
            }
            .layout {
                display: flex;
                justify-content:space-between;
                .el-table {
                    .cell {
                        padding-right:0px;
                        padding-left:5px;
                    }
                }
                .el-pagination {
                    position: fixed;
                    bottom:0px;
                    height: 40px;
                    left: 0px;
                    box-sizing: border-box;
                    z-index: 99;
                    margin-top:0px;
                }
                .table-l {
                    .el-pagination {
                        background-color:#fff;
                        width:30%;
                        z-index: 99;
                        left:15%;
                        transform: translate(-50%,0px)
                    }
                }
                .table-r {

                    .el-pagination {
                        width:70%;
                        background-color:#fff;
                        left:65%;
                        transform: translate(-50%,0px);
                        .el-pager {
                        }
                    }
                }
            }
            .el-dialog__body {
                padding-left:20px;
                        .el-form {
                            .el-form-item {
                                margin-right:27px;
                                width: 100%;
                                display: flex;
                                margin-bottom: 20px;
                                .el-form-item__content {
                                   flex:1
                                }
                            }
                        }
                .formcost {
                }
                .formservice {
                }
            }
        }
    }
</style>

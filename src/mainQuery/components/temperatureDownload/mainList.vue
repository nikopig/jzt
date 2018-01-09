<template>
  <div>
    <div class="headbar">
      <div class="common-row">
        <label>当前位置：</label>
        <div class="common-col">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click.native="go(-1)">首页</el-breadcrumb-item>
            <el-breadcrumb-item>温度下载</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
    </div>
    <div class="toolbar">
      <div class="btn-box">
        <el-button type="text" icon="mo-displayUninsuredvehicles" @click="goLocation">位置查询</el-button>
      </div>
    </div>
    <div class="common-condition-box">
      <el-form :model="form" :inline="true">
        <el-form-item label="订单编号：">
          <el-input v-model="form.Yewdj_No"></el-input>
        </el-form-item>
        <el-form-item label="开票时间：">
          <el-date-picker type="daterange" v-model="form.Date_Range" :clearable="false" @change="onChange"></el-date-picker>
        </el-form-item>
        <el-form-item label="客户名称：">
          <el-input v-model="form.Ssa_Name"></el-input>
        </el-form-item>
        <el-form-item label="设备号：">
          <el-input placeholder="设备号/内码" v-model="form.Sb_No"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.isHistory">历史数据</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <common-gride-card :expandAble="false" :hightLight="false" v-for="(item, index) in origData" :key="index">
        <div slot="header">
          <label class="header-item">订单编号：<span class="hight-lingt">{{item.YEWDJ_NO}}</span></label>
          <label class="header-item">最低温度：<span class="hight-lingt">{{item.Low_Temp}}℃</span></label>
          <label class="header-item">最高温度：<span class="hight-lingt">{{item.High_Temp}}℃</span></label>
          <label class="header-item">实时温度：<span class="hight-lingt">{{item.Realtime_Temp}}℃</span></label>
          <div class="btn-box">
            <el-button type="text" @click="goDetail(item)">
              查看详情
              <i class="el-icon-arrow-right"></i>
            </el-button>
          </div>
        </div>
        <common-row>
          <common-col>
            <span class="label">客户名称：</span>
            <span class="content">{{item.Ssa_Name}}</span>
          </common-col>
          <common-col>
            <span class="label">开票时间：</span>
            <span class="content">{{item.CRT_DATE}}</span>
          </common-col>
          <common-col>
            <span class="label">电子锁编号：</span>
            <span class="content">{{item.SB_NO}}</span>
          </common-col>
          <common-col>
            <span class="label">电子锁ID：</span>
            <span class="content">{{item.Con_Sb_Id}}</span>
          </common-col>
          <common-col>
            <span class="label">商品名称：</span>
            <span class="content">{{item.CHINESE_NAME}}</span>
          </common-col>
          <common-col>
            <span class="label">商品温层：</span>
            <span class="content">{{item.Refrigeration_TypeName}}</span>
          </common-col>
          <common-col>
            <span class="label">商品件数：</span>
            <span class="content">{{item.Planned_Pcs}}</span>
          </common-col>
          <common-col>
            <span class="label">商品重量(㎏)：</span>
            <span class="content">{{item.Planned_Weight}}</span>
          </common-col>
          <common-col>
            <span class="label">商品体积(m³)：</span>
            <span class="content">{{item.Planned_Volume}}</span>
          </common-col>
        </common-row>
      </common-gride-card>
    </div>
  </div>
</template>

<script>
  import commonGrideCard from '@/common/components/common-gride-card'
  import commonRow from '@/common/components/common-row'
  import commonCol from '@/common/components/common-col'
  import Api from '@/common/js/api.js'
  import {DateFtt, subSection} from '@/common/js/utils.js'
  export default {
    name: 'temperatureDownload',
    props: [],
    components: {commonGrideCard, commonRow, commonCol},
    data () {
      return {
        form: {
          Yewdj_No: '',
          Date_Range: [new Date(), new Date()],
          Ssa_Name: '',
          Sb_No: '',
          isHistory: false
        },
        origData: Object.freeze([])
      }
    },
    computed: {},
    methods: {
      onChange () {
      },
      goLocation () {
        window.top.Myhome.addTabEx('位置查询', '../HtmlPages/JLPFrame/OrderSitSearch.html')
      },
      getData () {
        let interFace = this.form.isHistory ? 'DS_APP_JLP_ELECTRONICLOCK_MAINDATA_OLD' : 'DS_APP_JLP_ELECTRONICLOCK_MAINDATA'
        let params = {
          YEWDJ_NO: this.form.Yewdj_No,
          BEGIN_DATE: DateFtt('yyyy-MM-dd', this.form.Date_Range[0]),
          END_DATE: DateFtt('yyyy-MM-dd', this.form.Date_Range[1], true),
          SSA_NAME: this.form.Ssa_Name,
          SB_NO: this.form.Sb_No
        }
        this.loadingWait = this.showLoading('请稍候...')
        Api.get(interFace, params)
          .then(res => {
            this.loadingWait.close()
            if (res.Flag) {
              this.origData = Object.freeze(res.MsgInfo)
            } else {
              this.messageInfo(res.ErrInfo)
            }
          })
      },
      goDetail (row) {
        this.$router.push({
          name: 'tempDetailList',
          params: {
            sid: row.Con_Sb_Id,
            beginDate: row.Start_Time,
            endDate: row.End_Time,
            High_Temp: subSection(row.Refrigeration_TypeName, '(', '@'),
            Low_Temp: subSection(row.Refrigeration_TypeName, '@', ')'),
            flag: this.form.isHistory ? '0' : '1'
          }
        })
      },
      init () {
        this.getData()
      }
    },
    created () {
    },
    mounted () {
      this.init()
    }
  }
</script>
<style lang="less">
  @import '../../../common/style/less/primary.less';
  .temperatureDownload {
    &.contain {
      padding: 20px;
    }
    .hight-lingt {
      color: @main-color;
      font-size: 14px;
    }
  }
</style>

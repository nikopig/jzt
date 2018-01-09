<template>
    <div class="common-tab-wraper common-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="应收流水" name="first">
            </el-tab-pane>
            <el-tab-pane :disabled="true"></el-tab-pane>
            <el-tab-pane label="应付流水" name="second">
            </el-tab-pane>
        </el-tabs>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
</template>

<script>
    export default {
        name: 'accountFlow',
        components: {},
        props: [],
        data () {
            return {
                activeName: 'first',
//                flowType: '', // 流程类型(stream:流水  balance:对账  conAudit:委托方审核  carAudit:承运方审核)
                diecType: '', // 收支类型(recive:应收  meet:应付)
                firstLabel: '',
                secondLabel: ''
            }
        },
        methods: {
          onPoint (obj) {},
          setType (route) {
            this.diecType = route.params.diecType
            console.log(this.diecType)
            switch (this.diecType) {
              case '20':
                this.activeName = 'second'
                break
              default:
                this.activeName = 'first'
                break
            }
          }
        },
        created () {},
        computed: {},
        mounted () {
          this.setType(this.$route)
        },
        watch: {
          $route (val) {
            this.setType(val)
          },
          activeName (val) {
            switch (val) {
              case 'first':
                // 应收
                this.$router.push('/10')
                break
              case 'second':
                // 应付
                this.$router.push('/20')
                break
            }
          }
        }
    }
</script>
<style lang="less">
    .entryAudit{
        /*background-color: #f3f3f4;
        padding: 8px;*/
        .el-tabs{
            background-color: #fff;
            /*border-top: 3px solid #e7eaec;*/
        }
        .el-tabs__nav{
            float: none;
            text-align: center;
            .el-tabs__item{
                width: 20%;
            }
            .el-tabs__active-bar{
                left: 20%;
            }
        }
        .el-tabs__content{
            margin-top: 21px;
        }
        /*.el-input__inner{
            padding: 0 10px;
            height: 26px;
            line-height: 26px;
            border-radius: 0;
            border: 1px solid #dbdbdb;
            color: #666;
            font-size: 12px;
        }
        ::-webkit-input-placeholder{
            color: #666;
        }
        ::-moz-input-placeholder{
            color: #666;
        }
        :-moz-input-placeholder{
            color: #666;
        }
        :-ms-input-placeholder{
            color: #666;
        }*/
    }
    .audit-wraper {
      padding: 45px 15px;
    }
</style>

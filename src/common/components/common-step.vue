<template>
    <div>
        <div class="common-step-wraper">
            <div class="steps tab" :style="stepsStyle" :class="{'active': stepIndex <= len}">
              <div class="step-item" v-for="(label, index) in labels" @click.stop="stepChange(index)" :class="{'active': stepIndex > index}">
                    <span>{{label}}</span>
                </div>
                <div class="h-line" :style="blankStyle"  :class="{'active': stepIndex >= len}"></div>
            </div>
            <div class="v-line"></div>
            <div class="sumary tab" @click.stop="toLastStep" :class="{'active': stepIndex > len}">
                <span><i class="el-icon-mo-orderSummary"></i>&nbsp;订单汇总</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            labels: {
                default () {
                    return ['客户信息', '商品信息', '我的订单']
                }
            },
            value: {
                type: Number,
                default: 1
            }
        },
        model: {
            event: 'change'
        },
        data () {
            return {}
        },
        computed: {
            len () {
              return this.labels.length
            },
            blankStyle () {
                return {
                    width: 'calc(' + 100 / (this.len + 1) + '% - 96px)'
                }
            },
            stepsStyle () {
                return {
                    flex: this.len + 1
                }
            },
            stepIndex: {
                get () {
                    return this.value
                },
                set (val) {
                    this.$emit('change', val)
                }
            }
        },
        methods: {
            stepChange (index) {
                this.stepIndex = index + 1
            },
            toLastStep () {
                this.stepIndex = this.len + 1
            }
        },
        created () {}
    }
</script>
<style lang="less" scoped>
  @import "../style/less/primary.less";
  .common-step-wraper {
    background-color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    .tab {
      padding: 0 60px;
      border-bottom: 2px solid @border-deep-color;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      &.active {
        border-bottom-color: @main-color;
      }
    }
    .steps {
      height: 50px;
      text-align: right;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      .h-line {
        height: 20px;
        border-bottom: 3px solid @border-deep-color;
        &.active {
          border-bottom-color: @main-color;
        }
      }
      .step-item {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        height: 20px;
        border-bottom: 3px solid @border-deep-color;
        &.active {
          border-bottom-color: @main-color;
          color: @main-color;
        }
        span {
          display: inline-block;
          *display: inline-block;
          padding: 0 20px;
          cursor: pointer;
          position: relative;
          top: 12px;
          background-color: #fff;
        }
      }
    }
    .steps.active {
      border-bottom: 2px solid @main-color;
    }
    .v-line {
      width: 1px;
    }
    .sumary {
      width: 100px;
      flex:1;
      text-align: center;
      cursor: pointer;
      span {
        position: relative;
        top: 12px;
      }
    }
  }
</style>

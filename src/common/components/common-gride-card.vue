<template>
    <div class="gride-card" @click="onSelect" :class="{active: isActive && hightLight}">
      <div class="card-header">
        <slot name="header"></slot>
      </div>
      <div class="card-body">
        <slot></slot>
        <div class="expand-btn" :class="iconClass" v-if="expandAble">
          <span @click.stop="onExpand" class="down-btn el-icon" :class="[isExpand ? 'el-icon-mo-up2' : 'el-icon-mo-down2']"></span>
        </div>
      </div>
      <div class="child-card" v-show="isExpand" v-if="expandAble">
        <slot name="children"></slot>
      </div>
      <div class="child-card" v-if="!expandAble">
        <slot name="children"></slot>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'grideCard',
        props: {
          expand: {
            type: Boolean,
            default: false
          },
          clickSelect: {
            type: Boolean,
            default: true
          },
          expandAble: {
            type: Boolean,
            default: true
          },
          hightLight: {
            type: Boolean,
            default: true
          }
        },
        components: {},
        data () {
            return {
              isActive: false,
              isExpand: this.expand
            }
        },
        computed: {
          iconClass () {
            return this.isExpand ? 'up' : 'down'
          }
        },
        methods: {
          onSelect () {
            if (this.clickSelect) {
              this.isActive = !this.isActive
              this.$emit('select', this.isActive)
            }
          },
          onExpand () {
            if (this.expandAble) {
              this.isExpand = !this.isExpand
              this.$emit('update:expand', !this.isExpand)
              this.$emit('expand')
            }
          }
        },
        created () {
        },
        mounted () {
        }
    }
</script>
<style lang="less" scoped>
  .gride-card {
    margin-top: 20px;
    border: 1px solid #d1dbe5;
    background-color: #fff;
    overflow: hidden;
    .card-header {
      padding: 0px 20px 0px 10px;
      height: 37px;
      line-height: 37px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      border-bottom: 1px solid #d1dbe5;
      box-sizing: border-box;
      background-color: #EBEEF5;
      & label, & .header-item {
        padding-right: 20px;
      }
      & .btn-box {
        display: inline-block;
        *display: inline-block;
        zoom: 1;
        float: right;
      }
    }
    .card-body {
      padding: 15px;
    }
    .child-card > *:first-child {
      border-top: 1px solid #d1dbe5;
    }
    &.active .card-body {
      background-color: #f2fbff
    }
    &.active .card-header {
      background-color: #e8f1f5
    }
    &.active .card-body .expand-btn {
      color: #11b3ff;
    }
    .card-body {
      position: relative;
      .expand-btn {
        font-size: 40px;
        position: absolute;
        right: 13px;
        bottom: -3px;
        cursor: pointer;
        transition: all .2s linear;
        color: #cfcfcf;
        &.down:hover {
          bottom: -8px;
        }
        &.up:hover {
          bottom: 2px;
        }
      }
    }
  }
</style>

<template>
    <div class="card-wraper" :class="{'active': isChecked}" @click="onChange">
        <div class="card-head" :title="name">{{name}}</div>
        <div class="card-body">
            <div class="info-item" v-for="item in cardData">
              <i :class="item.icon" :title="item.text">{{item.text}}</i>
            </div>
            <div class="check-box">
                <el-checkbox v-model="isChecked"></el-checkbox>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'selectCard',
        props: {
          cardData: {
            type: Array,
            default () {
              return []
            }
          },
          name: {
            type: String,
            default: ''
          },
          value: {
            default: false
          }
        },
        data () {
          return {
            isChecked: false
          }
        },
        computed: {
          checked: {
            get () {
              console.log(this.value)
              return this.value
            },
            set (val) {
              console.log(val)
              this.$emit('change', val)
            }
          }
        },
        model: {
          event: 'change'
        },
        methods: {
          onChange (e) {
            if (e.target.className === 'el-checkbox__inner' || e.target.className === 'el-checkbox__original') return false
            this.isChecked = !this.isChecked
          }
        },
        watch: {
          isChecked (val) {
            this.checked = val
          },
          // 是否选中双向绑定
          value (val) {
            this.isChecked = val
          }
        },
        created () {
        }
    }
</script>
<style lang="less" scoped>
  .card-wraper {
    width: 100%;
    border:1px solid #ccc;
    cursor: pointer;
    &.active {
      color: #546f8d;
    }
    &.active .card-head {
      background-color: #CCECF9;
    }
    &.active .card-body {
      background-color: #EFFAFE;
    }
    .card-head {
      padding: 10px;
      height: 33px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      background-color: #eee;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .card-body {
      padding: 10px;
      .info-item {
        margin-bottom: 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .check-box {
        text-align: right;
      }
    }
  }
</style>

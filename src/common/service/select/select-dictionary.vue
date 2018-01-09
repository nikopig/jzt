<template>
  <div class="common-select">
    <el-radio-group v-model="choice" v-if="type === 'radio'">
      <el-radio v-for="(item, index) in options" :key="index" :label="item.Value_Data">{{item.Value_Desc}}</el-radio>
    </el-radio-group>
    <el-select v-model="selectVal" placeholder="请选择" clearable v-if="type === 'select'">
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :value="item.Value_Data"
        :label="item.Value_Desc"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import Api from '@/common/js/api'

  export default {
    name: 'select-dictionary',
    props: {
      value: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'select'
      },
      field: {
        type: String,
        default: ''
      },
      iterFace: { // 接口名
        type: String,
        default: 'FdGetFiledDtl'
      }
    },
    model: {
      event: 'change'
    },
    data () {
      return {
        options: [
          {
            label: '常温'
          },
          {
            label: '冷藏'
          }
        ]
      }
    },
    computed: {
      selectVal: {
        get () {
          return this.value
        },
        set (val) {
          this.$emit('change', val)
          // 向父组件传所选项的描述
          let selectLabel = ''
          let selects = this.options.filter((item) => {
            return item.Value_Data === val
          })
          if (selects.length > 0) {
            selectLabel = selects[0].Value_Desc
          }
          this.$emit('select-label', selectLabel)
        }
      },
      choice: {
        get () {
          return this.value
        },
        set (val) {
          this.$emit('change', val)
        }
      }
    },
    methods: {
      initData () {
        let params = {
          Field_Name: this.field
        }
        Api.get(this.iterFace, params, true)
          .then((resp) => {
            console.log(resp)
            if (resp.Flag) {
              this.options = resp.MsgInfo
              // 如果以单选框类型展示，加入‘全部’选项
              if (this.type === 'radio') {
                this.options.push({
                  Value_Data: '%',
                  Value_Desc: '全部'
                })
                this.choice = this.options[0].Value_Data
              }
            }
          })
      }
    },
    mounted () {
      this.initData()
    }
  }
</script>
<style lang="less" scoped>
  .common-select {
    display: inline-block;
    *display: inline-block;
    zoom: 1;
  }
</style>

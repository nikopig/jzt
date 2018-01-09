<template>
  <div class="common-select">
    <el-select v-model="selectVal" placeholder="请选择" clearable>
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
    name: 'common-select',
    props: {
      value: {
        type: String,
        default: ''
      },
      field: {
        type: String,
        default: ''
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
        }
      }
    },
    methods: {
      initData () {
        let p = Api.get('FdGetServiceType', {})
        console.log(p)
          p.then((resp) => {
            console.log(resp)
            if (resp.Flag) {
              this.options = resp.MsgInfo
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

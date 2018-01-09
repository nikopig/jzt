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
    name: 'selectAgingType',
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
    watch: {
      value (newVal) {
        console.log(newVal)
      }
    },
    computed: {
      selectVal: {
        get () {
          return this.value
        },
        set (val) {
          this.$emit('change', val)
          console.log(val)
        }
      }
    },
    methods: {
      initData () {
        let params = {
          FIELD_NAME: ',aging_type,'
        }
        let p = Api.get('INF_FD_FIELD_DTL_All_LIST', params)
          p.then((resp) => {
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

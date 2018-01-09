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
    name: 'selectAgingCommitWay',
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
      },
      selectVal2: {
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
          FIELD_NAME: ',Commitment_Way,'
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

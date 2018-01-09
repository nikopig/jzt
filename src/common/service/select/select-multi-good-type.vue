<template>
  <div class="common-select multiGoodType">
    <el-select v-model="selectVal" multiple placeholder="请选择" clearable @remove-tag="removeTag">
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
    name: 'selectMultiGoodType',
    props: {
      value: {
        type: Array,
        default () {
          return []
        }
      },
      /*{
        type: String,
        default: ''
      },*/
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
          FIELD_NAME: ',Goods_Type,'
        }
        let p = Api.get('INF_FD_FIELD_DTL_All_LIST', params)
          p.then((resp) => {
            if (resp.Flag) {
              this.options = resp.MsgInfo
            }
          })
      },
      removeTag (val) {
        // console.log(val)
      }
    },
    mounted () {
      this.initData()
    }
  }
</script>
<style lang="less">
  .multiGoodType.common-select {
    display: inline-block;
    *display: inline-block;
    zoom: 1;
    .el-select__tags {
      top: 0;
      transform: translateY(0);
    }
  }
</style>

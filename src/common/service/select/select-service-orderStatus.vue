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
      ServiceType: {
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
      getData () {
        let params = {
           Field_Name: this.ServiceType
        }
        Api.get('Fd_Field_Dtl', params)
          .then((resp) => {
            if (resp.Flag) {
              this.options = resp.MsgInfo
            }
          })
      },
      init () {
        if (!this.ServiceType) return
        this.getData()
      }
    },
    watch: {
      ServiceType () {
        this.getData()
      }
    },
    mounted () {
      this.init()
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

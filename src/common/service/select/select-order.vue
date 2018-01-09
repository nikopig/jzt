<template>
  <div class="common-select">
    <el-checkbox-group v-model="choices" @change="handleChange">
      <el-checkbox v-for="(item, index) in options" :key="index" :label="item.Value_Data">{{item.Value_Desc}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template> 

<script>
  import Api from '@/common/js/api'

  export default {
    name: 'select-order',
    props: {
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
        options: [],
        choices: [],
        Value_Data: ''
      }
    },
    computed: {
    },
    methods: {
        handleChange (val) {
            let temp = this.choices.join(',')
            this.Value_Data = temp
            this.changeData()
        },
      initData () {
        let params = {
          Field_Name: this.field
        }
        Api.get('TMP_Fd_Field_Dtl', params, true)
          .then((resp) => {
            if (resp.Flag) {
              this.options = resp.MsgInfo
              this.Value_Data = this.choices.join(',')
              this.changeData()
              this.$nextTick(() => {
                this.$emit('loaded')
              })
              }
          })
      },
      changeData () {
          this.$emit('change', this.Value_Data)
      }
    },
    created () {
      this.initData()
    },
    watch: {
        choices (val) {
        }
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
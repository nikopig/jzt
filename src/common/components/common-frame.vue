<template>
    <div class="common-frame">
      <div class="toolbar">
        <div class="btn-box">
          <el-button type="text" icon="caret-left" @click="go(-1)">返回</el-button>
        </div>
      </div>
      <iframe :src="src" frameborder="0" class="iframe" :style="{height: height}"></iframe>
    </div>
</template>

<script>
    export default {
        name: 'commonFrame',
        props: [],
        components: {},
        data () {
            return {
              src: this.$route.params.src,
              height: ''
            }
        },
        computed: {},
        methods: {
          setHeight () {
            this.height = window.innerHeight - 180 + 'px'
            console.log(this.height)
          }
        },
        created () {
        },
        mounted () {
          this.setHeight()
          window.onresize = this.setHeight
        }
    }
</script>
<style lang="less" scoped>
  .common-frame {
    .iframe {
      width: 100%;
    }
  }
</style>

<template>
    <div>
    </div>
</template>

<script>
    export default {
        name: 'commonSideMenu',
        props: [],
        components: {},
        data () {
            return {
              menus: [
                {
                  name: '数据接口服务',
                  path:'/a',
                  icon: '',
                  level: 1,
                  children: [
                    {
                      name: '分菜单1',
                      path:'/aa',
                      icon: '',
                      level: 2
                    },
                    {
                      name: '分菜单2',
                      path:'/ab',
                      icon: '',
                      level: 2
                    },
                    {
                      name: '分菜单3',
                      path:'/ac',
                      icon: '',
                      level: 2
                    }
                  ]
                }
              ]
            }
        },
        computed: {},
        methods: {},
        created () {
        },
        mounted () {
        }
    }
</script>
<style lang="less" scoped>
</style>

<template>
  <div class="carri-search common-container">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'carri-search'
  }
</script>

<style scoped>
  .carri-search {
    padding: 10px;
  }
</style>

<template>
  <div class="my-header">
    <h2>
      <slot>{{title}}</slot>
    </h2>
    <el-menu v-if="menus&&menus.length" :default-active="$route.path" mode="horizontal" @select="handleSelect">
      <el-menu-item v-for="(menu,i) in menus" :key="i" :index="menu.router">{{menu.name}}</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'my-header',
  props: {
    title: { type: String },
    menus: { type: Array }
  },
  methods: {
    handleSelect (router) {
      this.$router.push(router)
    }
  }
}
</script>

<style lang="scss">
</style>

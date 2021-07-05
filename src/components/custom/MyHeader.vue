<template>
  <div class="my-header">
    <h2><slot>{{title}}</slot></h2>
  </div>
</template>

<script>
export default {
  name: 'my-header',
  props: {
    title: { type: String }
  }
}
</script>

<style lang="scss">

</style>

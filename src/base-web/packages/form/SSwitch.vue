<template>
  <div :class="cpClassName">
    <el-switch v-model="privateValue"
      :disabled="cpIsDetail"
      :width="options.width||40"
      :name="options.name||''"
      :active-text="options.activeText||''"
      :inactive-text="options.inactiveText||''"
      :active-value="options.activeValue||true"
      :active-color="options.activeColor||'#409EFF'"
      :inactive-value="options.inactiveValue||false"
      :inactive-color="options.activeColor||'#ff4949'">
    </el-switch>
  </div>
</template>

<script>
import mixins from '../../mixins/package'
export default {
  name: 'SSwitch',
  mixins: [mixins]
}
</script>

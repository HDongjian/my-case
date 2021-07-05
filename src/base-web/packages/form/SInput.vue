<template>
  <div :class="cpClassName">
    <el-input v-if="!cpIsDetail" @change="change" @focus="focus" @blur="blur" @input="input" :type="cpTypes" :maxlength='cpMaxlength' :rows="cpRows" :disabled='cpDisabled' :placeholder="cpPlaceholder" :style="cpStyles"
      v-model="privateValue"></el-input>
    <div v-else class="details">
      <template v-if="ruleType === 'idCard'">
        <span>{{infoHide?lib.stringCardCodeEncrypt(privateValue):privateValue}}</span>
        <i class="el-icon-view" @click="infoHide = !infoHide"></i>
      </template>
      <template v-else-if="['mobile','phone','landline'].includes(ruleType)">
        <span>{{infoHide?lib.stringPhoneEncrypt(privateValue):privateValue}}</span>
        <i class="el-icon-view" @click="infoHide = !infoHide"></i>
      </template>
      <template v-else-if="ruleType === 'email'">
        <span>{{infoHide?lib.stringEmailEncrypt(privateValue):privateValue}}</span>
        <i class="el-icon-view" @click="infoHide = !infoHide"></i>
      </template>
      <template v-else-if="ruleType === 'name'">
        <span>{{infoHide?lib.stringNameEncrypt(privateValue):privateValue}}</span>
        <i class="el-icon-view" @click="infoHide = !infoHide"></i>
      </template>
      <template v-else>{{cpDetailText}}</template>
    </div>
  </div>
</template>

<script>
import mixins from '../../mixins/package'
export default {
  name: 'SInput',
  mixins: [mixins],
  data () {
    return {
      defaultType: 'text',
      maxlengthMap: {
        number: 100,
        mobile: 11,
        idCard: 18,
        landline: 13
      },
      infoHide: true
    }
  },
  methods: {
    blur () {
      if (!this.lib.isFunction(this.options.blur)) return
      this.options.blur(this.privateValue)
    },
    input () {
      if (!this.lib.isFunction(this.options.input)) return
      this.options.input(this.privateValue)
    },
    focus () {
      if (!this.lib.isFunction(this.options.focus)) return
      this.options.focus(this.privateValue)
    }
  },
  computed: {
    cpMaxlength () {
      if (this.options.maxLength) {
        return this.options.maxLength
      }
      if (this.maxlengthMap[this.ruleType]) {
        return this.maxlengthMap[this.ruleType]
      }
      return this.defaultMaxLength
    },
    cpRows () {
      return this.options.rows || this.defaultRows
    },
    cpTypes () {
      return this.options.type || this.defaultType
    }
  }
}
</script>

<style lang='scss'>
.s-input {
  .details {
    text-align: left;
    i {
      cursor: pointer;
      font-size: 30px;
      font-size: 18px;
      margin-left: 10px;
      vertical-align: middle;
    }
  }
}
</style>

<template>
  <div class="textarea">
    <label v-if="$props.label">{{ $props.label }} <span v-if="$props.required" class="red">*</span></label>
    <div class="textarea-wrapper">
      <div v-if="beforeIcon" class="before-icon">
        <icon-search v-if="beforeIcon==='search'"></icon-search>
      </div>
      <textarea
          :value="modelValue"
          autocomplete="off"
          @input="input"
          class="radius-4"
          :type="showPassword ?'text' : $props.type"
          :placeholder="$props.placeholder"
      />
      <span v-if="!$props.label" :class="[value ? 'top' : 'hidden']">
        {{ $props.placeholder }}
        <span v-if="$props.required && !$props.label" class="red">*</span>
      </span>
      <div v-if="afterIcon" class="after-icon">
        <icon-eye @click="showPwd" v-if="afterIcon === 'eye'"></icon-eye>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps, ref, defineEmits} from 'vue'
import IconSearch from '@/components/icon/Search'
import IconEye from '@/components/icon/Eye'

const $props = defineProps({
  label: {
    type: String,
    default: null
  },
  modelValue: null,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: 'Излаш'
  },
  beforeIcon: {
    type: String,
    default: null
  },
  afterIcon: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  }
})

const $emits = defineEmits({
  input: null,
  change: null
})

const value = ref(null)
const showPassword = ref(false)

const input = (v) => {
  $emits('update:modelValue', v.target.value)
  value.value = v.target.value
  $emits('input', v.target.value)
}

const change = (v) => {
  value.value = v.target.value
  $emits('change', v.target.value)
}

const showPwd = () => {
  showPassword.value = !showPassword.value
}
</script>
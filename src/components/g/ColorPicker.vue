<template>
  <div class="color-picker">
    <label v-if="$props.label">
      {{ $props.label }} <span v-if="$props.required" class="red">*</span>
    </label>
    <div class="color-picker-wrapper">
      <input type="color" @input="inputValue">
    </div>
  </div>
</template>

<script setup>
const $props = defineProps({
  label: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  },
  modelValue: null,
})

const $emits = defineEmits({
  'update:modelValue': null,
})

const inputValue = (e) => {
  $emits('update:modelValue', e?.target?.value)
}
</script>
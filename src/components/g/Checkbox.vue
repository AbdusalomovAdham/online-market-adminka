<template>
  <div :class="['g-checkbox', $props.oneLine && 'one-line']">
    <label class="checkbox">
      <input id="checkbox" type="checkbox" @change="$emits('change', $event.target.value)" :value="$props.modelValue" v-model="value">
      <span :class="['slider', $props.modelValue && 'active']">
        <div class="circle"></div>
      </span>
    </label>
    <span v-if="$props.label" class="g-checkbox-label">{{ $props.label }}</span>
  </div>
</template>

<script setup>
import {defineProps, defineEmits, watch, ref, onMounted} from 'vue'

const $props = defineProps({
  modelValue: null,
  label: {
    type: String,
    default: null,
  },
  oneLine: {
    type: Boolean,
    default: false
  }
})

const $emits = defineEmits({
  'update:modelValue': null,
  'change': null
})

const value = ref(false)

onMounted(() => {
  value.value = $props.modelValue
})

watch(() => value.value, (v) => {
  $emits('update:modelValue', v)
})

watch(() => $props.modelValue, (v) => {
  value.value = v
})
</script>

<style>
.one-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.one-line label {
  margin: 0;
}
</style>
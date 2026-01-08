<template>
  <div class="search">
    <div class="search-wrapper">
      <button @click="$emits('filter')">
        <span>Filter</span>
        <IconFilter></IconFilter>
      </button>
      <div class="before-icon">
        <icon-search></icon-search>
      </div>
      <input
          :value="modelValue"
          autocomplete="off"
          @input="input"
          class="radius-4"
          placeholder="Izlash"
      >
    </div>
  </div>
</template>

<script setup>
import {defineProps, ref, defineEmits} from 'vue'
import IconFilter from '@/components/icon/Filter'
import IconSearch from '@/components/icon/Search'

const $props = defineProps({
  modelValue: null,
})

const $emits = defineEmits({
  input: null,
  change: null,
  'update:modelValue': null,
  filter: null
})

const value = ref(null)
const showPassword = ref(false)

const input = (v) => {
  $emits('update:modelValue', v.target.value)
  value.value = v.target.value
  $emits('input', v.target.value)
}
</script>
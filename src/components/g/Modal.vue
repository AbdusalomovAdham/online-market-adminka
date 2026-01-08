<template>
  <div class="modal">
    <div :class="['modal-wrapper', width && `w-${width}`]">
      <div class="modal-header">
        <h2>{{ $props.title }}</h2>
        <icon-x @click="$emits('close')"></icon-x>
      </div>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconX from '@/components/icon/X'
import {defineProps, defineEmits} from 'vue'

const $props = defineProps({
  title: {
    type: String,
    default: ""
  },
  width: null
})

const $emits = defineEmits({
  close: null
})

</script>
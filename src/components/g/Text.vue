<template>
  <div class="g-text">
    <span>{{ $props.title }}:</span>
    <p>{{ $props.text  || '-' }}</p>
  </div>
</template>

<script setup>
import {defineProps} from 'vue'

const $props = defineProps({
  title: {
    type: String,
    default: null
  },
  text: {
    type: String,
    default: null
  }
})

</script>
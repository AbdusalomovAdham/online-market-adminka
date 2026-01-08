<template>
    <button class="btn">
      <span v-if="props.tooltip" class="tooltip">
        {{ props.tooltip }}
      </span>
      <slot></slot>
    </button>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  tooltip: {
    type: String,
    default: null
  }
})
</script>

<style></style>
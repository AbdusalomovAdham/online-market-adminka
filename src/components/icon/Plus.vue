<template>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1045_10738)">
      <path d="M10 4.16699V15.8337" :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4.16675 10H15.8334" :stroke="color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_1045_10738">
        <rect width="20" height="20" fill="white"/>
      </clipPath>
    </defs>
  </svg>
</template>

<script setup>
import {defineProps} from 'vue';

const $props = defineProps({
  color: {
    type: String,
    default: () => "white"
  }
})
</script>
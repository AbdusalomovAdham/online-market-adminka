<template>
  <div v-if="$props.files?.length" class="g-files">
    <div class="g-files-wrapper">
      <span>{{ $props.title }}:</span>
      <div class="flex gap-12">
        <a v-for="(f, idx) in $props.files" :key="f" :href="f && f.includes('https://taklif2024.rudi.uz') ? f : `https://taklif2024.rudi.uz${f}`" target="_blank" download class="file">
          <span>Fayl {{ idx+1 }}</span>
<!--          <icon-clear></icon-clear>-->
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue'
import IconClear from '@/components/icon/Clear'

const $props = defineProps({
  files: {
    type: Array,
    default: []
  },
  title: {
    type: String,
    default: 'Yuklangan fayllar'
  }
})
</script>

<template>
  <div class="g-device">
    <div class="device">
      <IconDevice />
      <span>{{ $props.name }}</span>
    </div>
    <div class="screen">
      <div class="img">
        <img :src="$props.screen" alt="" />
      </div>
    </div>
    <div class="info">
      <div class="flex space-between">
        <span class="user">{{ $props.user }}</span>
        <div class="duration">{{ $props.duration }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconDevice from "@/components/icon/Device.vue";
import { defineProps } from "vue";

const $props = defineProps({
  user: null,
  duration: null,
  screen: null,
  name: null,
});
</script>

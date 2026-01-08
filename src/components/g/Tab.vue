<template>
  <div class="g-tab">
    <div class="g-tab-wrapper">
      <ul>
        <li
          v-for="t in $props.tabs"
          @click="selectTab(t?.id)"
          :to="t?.path"
          :key="t?.id"
          class="item"
          :class="[t?.id === $props.modelValue && 'active']"
        >
          {{ t?.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const $props = defineProps({
  tabs: {
    type: Object,
    default: [],
  },
  modelValue: null,
});

const $emits = defineEmits({
  "update:modelValue": null,
});

const selectTab = (id) => {
  $emits("update:modelValue", id);
};
</script>

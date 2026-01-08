<template>
  <div class="multi-select-wrapper">
    <div class="select">
      <label v-if="props.label === ''">Katigoriyani tanlang</label>
      <label v-if="props.label">{{ props.label }}</label>
    </div>

    <MultiSelect
      v-model="innerValue"
      :options="data"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :placeholder="placeholder"
      filter
      filterPlaceholder="Qidirish..."
      display="chip"
      appendTo="body"
      class="w-full custom-multiselect"
    />
  </div>
</template>

<script setup>
import MultiSelect from "primevue/multiselect";
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "Tanlang",
  },
  optionLabel: {
    type: String,
    default: "name",
  },
  optionValue: {
    type: String,
    default: "id",
  },
  label: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<style>
/* =========================
   MULTISELECT INPUT
========================= */
.p-multiselect-label-container {
  height: 48px;
}

input:focus {
  outline: none !important;
  box-shadow: none !important;
  border-color: transparent !important;
}
.custom-multiselect.p-multiselect {
  width: 100%;
  border-radius: 4px;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
}

.custom-multiselect.p-multiselect::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.p-multiselect-label,
.p-placeholder {
  height: 100%;
  font-size: 16px !important;
  color: rgba(0, 0, 0, 0.6);
}

/* label / chips */
.custom-multiselect .p-multiselect-label {
  padding: 8px 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* chip */
.custom-multiselect .p-multiselect-token {
  border-radius: 6px;
  font-size: 13px;
  padding: 4px 8px;
}

/* =========================
   DROPDOWN PANEL
========================= */
.p-multiselect-panel {
  border-radius: 12px;
  padding: 0;
  z-index: 9999;
}

/* =========================
   HEADER / SEARCH
========================= */
.p-multiselect-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
}

.p-multiselect-filter {
  height: 36px;
  padding: 0 40px 0 12px;
  border-radius: 8px;
  font-size: 14px;
}

.p-multiselect-filter-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
}

.p-multiselect-close {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}

/* =========================
   ITEMS
========================= */
.p-multiselect-items {
  padding: 6px 0;
}

.p-multiselect-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  font-size: 14px;
}

.p-checkbox {
  width: 18px;
  height: 18px;
}

.p-multiselect-empty-message {
  padding: 10px 20px;
}

.p-multiselect-trigger svg {
  width: 12px;
  height: 12px;
}
</style>

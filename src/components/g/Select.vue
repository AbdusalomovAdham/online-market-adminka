<template>
  <div class="select">
    <label v-if="$props.label"
      >{{ $props.label }} <span v-if="required" class="red">*</span></label
    >
    <div class="select-wrapper">
      <span
        v-if="modelValue && !$props.label"
        :class="[
          modelValue ? 'top' : $props.type === 'date' ? 'top' : 'default',
        ]"
      >
        {{ $props.placeholder }}
        <span v-if="required && !$props.label" class="red">*</span>
      </span>
      <select
        :value="modelValue"
        @input="input"
        @change="change"
        :disabled="$props.disabled"
      >
        <option v-if="!unclearable" value="">{{ $props.placeholder }}</option>
        <option
          v-for="o in $props.options"
          :key="o?.[$props.value]"
          :value="o?.[$props.value]"
        >
          {{ $props.lang ? o?.[$props.option]?.[lang] : o?.[$props.option] }}
        </option>
      </select>
      <icon-clear v-if="modelValue && !unclearable" @click="clear"></icon-clear>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from "vue";
import IconClear from "@/components/icon/Clear";

const $props = defineProps({
  label: {
    type: String,
    default: null,
  },
  modelValue: null,
  unclearable: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "text",
  },
  lang: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: "Танланг",
  },
  option: {
    type: String,
    default: "name",
  },
  value: {
    type: [String, Number],
    default: "id",
  },
  options: {
    type: Array,
    default: [],
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const $emits = defineEmits({
  input: null,
  change: null,
  "update:modelValue": null,
});

const value = ref(null);

const input = (v) => {
  $emits("update:modelValue", v.target.value);
  value.value = v.target.value;
  $emits("input", v.target.value);
};

const change = (v) => {
  value.value = v.target.value;
  $emits("change", v.target.value);
};

const clear = () => {
  $emits("update:modelValue", null);
  value.value = null;
  $emits("change", null);
};
</script>

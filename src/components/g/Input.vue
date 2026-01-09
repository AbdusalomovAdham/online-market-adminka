<template>
  <div class="input">
    <label v-if="$props.label"
      >{{ $props.label }}
      <span v-if="$props.required" class="red">*</span></label
    >
    <div class="input-wrapper">
      <div v-if="beforeIcon" class="before-icon">
        <icon-search v-if="beforeIcon === 'search'"></icon-search>
      </div>
      <input
        :value="modelValue"
        autocomplete="off"
        @input="input"
        class="radius-4"
        :type="showPassword ? 'text' : $props.type"
        :placeholder="$props.placeholder"
        :min="$props.min"
        :step="$props.step"
        :max="$props.max"
      />
      <span
        v-if="!$props.label || ($props.type === 'date' && !$props.label)"
        :class="[value || $props.type === 'date' ? 'top' : 'hidden']"
        >{{ $props.placeholder }}</span
      >
      <div v-if="afterIcon" class="after-icon">
        <icon-eye @click="showPwd" v-if="afterIcon === 'eye'"></icon-eye>
      </div>
      <icon-clear
        v-if="modelValue && $props.type === 'date'"
        @click="clear"
      ></icon-clear>
      <button @click="$emits('btnClick')" v-if="btn === 'update'">
        <icon-refresh></icon-refresh>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, onMounted } from "vue";
import IconSearch from "@/components/icon/Search";
import IconEye from "@/components/icon/Eye";
import IconClear from "@/components/icon/Clear";
import IconRefresh from "@/components/icon/Refresh";

const $props = defineProps({
  label: {
    type: String,
    default: null,
  },
  btn: {
    type: String,
    default: null,
  },
  modelValue: null,
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: null,
  },
  beforeIcon: {
    type: String,
    default: null,
  },
  afterIcon: {
    type: String,
    default: null,
  },
  required: {
    type: Boolean,
    default: false,
  },
  min: {
    type: [String, Number],
    default: null,
  },
  max: {
    type: [String, Number],
    default: null,
  },
  step: {
    type: [String, Number],
    default: null,
  },
});

const $emits = defineEmits({
  input: null,
  change: null,
  "update:modelValue": null,
  btnClick: null,
});

const value = ref(null);
const showPassword = ref(false);

onMounted(() => {
  setTimeout(() => {
    value.value = $props.modelValue;
  }, 200);
});

const input = (v) => {
  $emits("update:modelValue", v.target.value);
  value.value = v.target.value;
  $emits("input", v.target.value);
};

const change = (v) => {
  value.value = v.target.value;
  $emits("change", v.target.value);
};

const showPwd = () => {
  showPassword.value = !showPassword.value;
};

const clear = () => {
  $emits("update:modelValue", null);
  value.value = null;
};
</script>

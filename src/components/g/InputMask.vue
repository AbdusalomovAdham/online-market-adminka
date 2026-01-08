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
        autocomplete="off"
        @input="input"
        :value="modelValue"
        class="radius-4"
        v-model="value"
        :type="showPassword ? 'text' : $props.type"
        :placeholder="$props.placeholder"
      />
      <span v-if="!$props.label" :class="[value ? 'top' : 'hidden']">{{
        $props.placeholder
      }}</span>
      <div v-if="afterIcon" class="after-icon">
        <icon-eye @click="showPwd" v-if="afterIcon === 'eye'"></icon-eye>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits, watch } from "vue";
import IconSearch from "@/components/icon/Search";
import IconEye from "@/components/icon/Eye";

const $props = defineProps({
  label: {
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
    default: "Излаш",
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
});

const $emits = defineEmits({
  input: null,
  change: null,
  "update:modelValue": null,
});

const value = ref("+998 ");
const showPassword = ref(false);

watch(
  () => value.value,
  (v) => {
    if (v?.length < 5) {
      value.value = "+998 ";
      return;
    }

    if (!"0123456789- ".includes(v[v.length - 1])) {
      value.value = v.substr(0, v.length - 1);
      return;
    }

    if (v.length > 16) {
      value.value = v.substr(0, 17);
    }

    if (v?.length === 8 && v[7] !== "-") {
      value.value = v?.substr(0, 7) + `-${v[7] ? v[7] : ""}`;
    } else if (v?.length === 7 && v[7] === "-") {
      value.value = v?.substr(0, 7);
    }

    if (v?.length === 12 && v[11] !== "-") {
      value.value = v?.substr(0, 11) + `-${v[11] ? v[11] : ""}`;
    } else if (v?.length === 12 && v[11] === "-") {
      value.value = v?.substr(0, 11);
    }

    if (v?.length === 15 && v[14] !== "-") {
      value.value = v?.substr(0, 14) + `-${v[14] ? v[14] : ""}`;
    } else if (v?.length === 15 && v[14] === "-") {
      value.value = v?.substr(0, 14);
    }

    $emits("update:modelValue", v);
  }
);

const input = (v) => {
  // $emits('update:modelValue', v.target.value)
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
</script>

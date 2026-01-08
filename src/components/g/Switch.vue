<template>
    <div class="g-switch">
        <span v-if="$props.label" class="g-switch-label">{{ $props.label }}</span>
        <label class="switch">
            <input id="checkbox" type="checkbox" @change="onChange" :value="$props.modelValue" v-model="value">
            <span :class="['slider', value && 'active']">
                <div class="circle"></div>
            </span>
        </label>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, watch, ref, onMounted } from 'vue'

const $props = defineProps({
    modelValue: null,
    label: {
        type: String,
        default: null,
    }
})

const $emits = defineEmits({
    'update:modelValue': null,
    'change': null
})

const value = ref(false)

onMounted(() => {
    setTimeout(() => {
        value.value = $props.modelValue
    }, 200)
})

const onChange = (v) => {
    $emits('change', v.target.value === 'true')
}

watch(() => value.value, (v) => {
    $emits('update:modelValue', v)
})

</script>

<style>
.one-line {
    display: flex;
    align-items: center;
    gap: 8px;
}

.one-line label {
    margin: 0;
}
</style>
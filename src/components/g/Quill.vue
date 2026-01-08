<script setup>
import { defineProps, ref, defineEmits, onMounted } from 'vue'
import Quill from "quill";
import "quill/dist/quill.snow.css";

const $props = defineProps({
    label: {
        type: String,
        default: () => {
            return null
        }
    },
    required: {
        type: Boolean,
        default: () => {
            return false
        }
    },
    value: null,
    modelValue: null,
})
const editor = ref(null);

onMounted(() => {
    const quillInstance = new Quill(editor.value, {
        theme: "snow",
    });
    quillInstance.on("text-change", () => {
        $emits('update:modelValue', quillInstance.root.innerHTML)
    });
    // setTimeout(() => {
    $props.value && (quillInstance.root.innerHTML = $props.value)

    const formatElement = Array.from(document.querySelectorAll(".ql-toolbar"))[2]
    console.log(formatElement?.childNodes[2])
    // }, 600)


})

const $emits = defineEmits({
    'update:modelValue': null,
})

</script>

<template>
    <div class="g-quill">
        <label v-if="label">{{ label }}<span v-if="required" class="red">*</span></label>
        <div ref="editor"></div>
    </div>
</template>

<style>
.tox-notification--error {
    display: none !important;
}
</style>

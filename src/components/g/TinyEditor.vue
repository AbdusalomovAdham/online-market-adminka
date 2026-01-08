<script setup>
import Editor from "@tinymce/tinymce-vue";
import { defineProps, ref, defineEmits, watch, onMounted } from 'vue'

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

onMounted(() => {
    setTimeout(() => {
        input.value = $props.value
    }, 200)
})

const $emits = defineEmits({
    'update:modelValue': null,
})

const input = ref(null)

watch(() => input.value, (v) => {
    $emits('update:modelValue', v)
})

</script>

<template>
    <div class="g-tiny-editor">
        <label v-if="label">{{ label }}<span v-if="required" class="red">*</span></label>
        <editor api-key="nhpbsizo738i9ed7vqhikc4huedqp1cxizugf8n9igdxg5rp" :init="{
            toolbar_mode: 'sliding',
            selector: 'textarea',
            height: 500,
            toolbar:
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            plugins:
                'lists link image table code help wordcount media autosave emoticons fullscreen nonbreaking pagebreak preview save tableinsertdialog',
        }" v-model="input" />
    </div>
</template>

<style>
.tox-notification--error {
    display: none !important;
}
</style>

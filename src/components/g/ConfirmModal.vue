<template>
    <GModal @close="$emits('cancel')">
        <template v-slot:body>
            <div class="flex center mb-48">
                <h2 class="text-center">{{ title }}</h2>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex gap-12 center">
                <Button v-if="confirmBtn" @click="$emits('confirm')" class="main">{{ confirm }}</Button>
                <Button @click="$emits('cancel')">Bakor qilish</Button>
            </div>
        </template>
    </GModal>
</template>
<script setup>
import GModal from '@/components/g/Modal.vue'
import Button from '@/components/g/Button.vue'
import { defineProps, defineEmits } from 'vue'

const $props = defineProps({
    title: null,
    confirmBtn: {
        type: Boolean,
        default: () => {
            return true
        }
    },
    confirm: {
        type: String,
        default: () => {
            return 'Tasdiqlayman'
        }
    }
})
const $emits = defineEmits({
    confirm: null,
    cancel: null
})
</script>
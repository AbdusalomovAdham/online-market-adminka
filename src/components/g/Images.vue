<template>
    <div class="g-images">
        <div v-for="(img, idx) in images" class="image" @click="selectedImg = img" :key="idx">
            <div class="cover"></div>
            <Eye></Eye>
            <img :src="img">
        </div>
        <div v-if="selectedImg" @click="selectedImg = null" class="selected-img">
            <img :src="selectedImg" alt="">
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import Eye from '@/components/icon/Eye2.vue'

const $props = defineProps({
    images: {
        type: Array,
        default: () => {
            return []
        }
    }
})

const selectedImg = ref(null)
</script>
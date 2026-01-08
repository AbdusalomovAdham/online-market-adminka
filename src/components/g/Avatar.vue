<template>
    <div class="g-avatar">
        <div class="g-avatar-wrapper">
            <div class="image">
                <img :src="imgUrl || require('@/assets/images/avatar.png')" alt="">
            </div>
            <label v-if="uploadable" class="input">
                <input type="file" @change="uploadFile" accept="image/jpeg,image/png,image/jpg">
                <IconPlus color="#ccc"></IconPlus>
            </label>
        </div>
    </div>
    <ImageCropper v-if="cropping" :file="imgUrl" @onCrop="onCrop" @onClose="onClose"></ImageCropper>
</template>

<script setup>
import { ref } from 'vue'
import IconPlus from '@/components/icon/Plus.vue'
import ImageCropper from '@/components/g/ImageCropper.vue'
import { defineEmits, defineProps } from 'vue'

const imgUrl = ref(null)
const $emits = defineEmits({
    'upload': null
})
const $props = defineProps({
    'uploadable': {
        type: Boolean,
        default: () => {
            return true
        }
    }
})
const cropping = ref(false)
const imgFile = ref(null)

const onCrop = (file) => {
    if (file) {
        imgUrl.value = URL.createObjectURL(file)
        imgFile.value = file
        $emits('upload', file)
    }
}
const onClose = () => {
    cropping.value = false
}
const uploadFile = (e) => {
    const file = e?.target?.files[0]

    if (file) {
        imgUrl.value = URL.createObjectURL(file)
        imgFile.value = file
        cropping.value = true
        $emits('upload', file)
    }
}
</script>
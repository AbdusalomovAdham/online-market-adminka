<template>
    <div class="g-image-uploader">
        <label class="uploader">
            <input type="file" @change="change" multiple accept="image/png,image/jpg">
            <div class="label">
                <Images />
                <span>Rasm yuklang</span>
            </div>
        </label>
        <div class="images">
            <div v-for="(f, idx) in files" :key="idx" class="image">
                <img :src="f.url" />
                <div class="actions">
                    <Eye @click="showImage(f.url)"></Eye>
                    <Trash @click="removeImage(idx)"></Trash>
                </div>
            </div>
            <div v-for="(img, idx) in images" :key="idx" class="image">
                <img :src="img" />
                <div class="actions">
                    <Eye @click="showImage(img)"></Eye>
                    <Trash @click="deleteIdx = idx + 1"></Trash>
                </div>
            </div>
        </div>
        <div v-if="imgUrl" @click="imgUrl = null" class="img-preview">
            <img :src="imgUrl">
        </div>
    </div>
    <ConfirmModal v-if="deleteIdx || (deleteIdx == 0)" title="Rasmni o'chirishni tasdiqlaysizmi?" @confirm="confirm" @cancel="deleteIdx = null"></ConfirmModal>
</template>

<script setup>
import Images from '@/components/icon/Images.vue'
import Trash from '@/components/icon/Trash.vue'
import Eye from '@/components/icon/Eye2.vue'
import ConfirmModal from '@/components/g/ConfirmModal.vue'
import { ref, defineEmits, defineProps} from 'vue'
import api from '@/plugins/axios'

const files = ref([])
const $props = defineProps({
    'modelValue': null,
    images: null,
    deleteUrl: null
})
const $emits = defineEmits({
    'update:modelValue': null,
    'delete': null
})
const imgUrl = ref(null)
const deleteIdx = ref(null)

const showImage = (url) => {
    imgUrl.value = url
}

const change = (e) => {
    files.value = [...files.value, ...Array.from(e.target.files).map(file => {
        const url = URL.createObjectURL(file); 
        return {
            file,
            url
        }
    })]

    $emits('update:modelValue', files.value)
}

const removeImage = (idx) => {
    files.value = files.value.filter((_, i) => i != idx)

    $emits('update:modelValue', files.value)
    $emits('delete', idx)
}

const confirm = async () => {
    try {
        await api.post($props.deleteUrl, {
            index: deleteIdx.value
        })
        $emits('delete')
    } catch(e) {
        alert(e)
        console.error(e)
    }
}
</script>
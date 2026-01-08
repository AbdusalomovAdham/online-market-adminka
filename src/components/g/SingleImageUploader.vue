<template>
    <div class="g-single-image-uploader">
        <div class="uploader">
            <div v-if="$props.label" class="label">
                {{ $props.label }} <span v-if="$props.required" class="red">*</span>
            </div>
            <div class="input">
                <label :for="uid">
                    <div class="img">
                        <img v-if="imgUrl" :src="imgUrl">
                        <div v-else class="placeholder">
                            {{ $props.placeholder }}
                        </div>
                        <div v-if="imgUrl" @click.prevent="clearImage" class="clear">
                            <IconTrash></IconTrash>
                        </div>
                    </div>
                </label>
                <input type="file" :id="uid" @input="uploadImage" accept="image/jpeg,image/png,image/jpg">
            </div>
        </div>
    </div>
</template>

<script setup>
import IconTrash from '@/components/icon/Trash.vue'
import { ref, defineProps, defineEmits, watch } from 'vue';

const $props = defineProps({
    label: null,
    placeholder: {
        type: String,
        default: () => {
            return 'Upload image'
        }
    },
    modelValue: null,
    url: null,
    required: {
        type: Boolean,
        default: () => {
            return false
        }
    }
})

const $emits = defineEmits({
    'update:modelValue': null,
    'delete': null
})


const img = ref(null)
const imgUrl = ref(null)

const uploadImage = (e) => {
    imgUrl.value = URL.createObjectURL(e.target.files[0])
    img.value = e.target.files[0]
    console.log(img.value, imgUrl.value, e.target.files)
}

const generateUniqueId = (length = 8) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let id = '';
    for (let i = 0; i < length; i++) {
        const randIndex = Math.floor(Math.random() * chars.length);
        id += chars[randIndex];
    }
    return id;
}
const uid = generateUniqueId(8)

const clearImage = () => {
    imgUrl.value = null
    img.value = null
    $emits('delete')
}

watch(() => $props.url, (v) => {
    imgUrl.value = v
})
watch(() => img.value, (v) => {
    $emits('update:modelValue', v)
})

</script>
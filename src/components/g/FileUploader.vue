<template>
  <div class="g-file-uploader">
    <div class="g-file-uploader-wrapper">
      <input :id="`file-uploader-${uid}`" multiple type="file" @change="uploadFile" accept=".doc,.docx,image/*,.xlsx,.pdf">
      <label class="uploader" :for="`file-uploader-${uid}`">
        <p>
          {{ $props.label }}
          <br>
          <span>(.doc, .docx, .pdf, .jpg, .jpeg, .xlsx, .png)</span>
        </p>
      </label>
      <div class="flex gap-8">
        <div v-for="f in files" :key="f.lastModified" class="file">
          <span>
            {{ f.name }}
          </span>
          <icon-clear @click="removeFile(f.lastModified)"></icon-clear>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps, defineEmits, ref} from 'vue'
import IconClear from '@/components/icon/Clear'

const $props = defineProps({
  label: {
    type: String,
    default: 'Fayl yuklash uchun bosing (Maks: 5mb)'
  }
})

const $emits = defineEmits({
  upload: null
})

const maxSize = ref(10*1024*1024)
const files = ref([])
const uid = ref(Math.floor(Math.random() * 1001))

const uploadFile = (e) => {
  Array.from(e.target.files).forEach(f => {
    if(f.size <= maxSize.value) {
      files.value.push(f)
    } else {
      alert(`${f.name} hajmi 10mb dan oshmasligi kerak!`)
    }
  })
  $emits('upload', files.value)
}

const removeFile = (lastModified) => {
  files.value = files.value.filter(f => f.lastModified !== lastModified)
}
</script>
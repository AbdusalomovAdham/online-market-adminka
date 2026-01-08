<template>
  <g-modal title="Ma'lumotlarni tahrirlash" width="1000" @close="$emits('cancel')">
    <template v-slot:body>
      <div class="rows gap-24 mb-24">
        <div class="col-24">
          <g-tab-lang v-model="lang"></g-tab-lang>
        </div>
        <div class="col-24">
          <Input label="Raqamlar" :value="updateForm.number" placeholder="Kiriting" v-model="updateForm.number"></Input>
        </div>
        <div class="col-24">
          <Textarea label="Savol" :value="updateForm.title[lang]" placeholder="Savol" v-model="updateForm.title[lang]"></Textarea>
        </div>
        <div class="col-24">
          <Textarea label="Javob" :value="updateForm.description[lang]" placeholder="Javob" v-model="updateForm.description[lang]"></Textarea>
        </div>
        <div class="col-24">
          <GSwitch v-model="updateForm.status" label="Status"></GSwitch>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex gap-12 content-end">
        <Button class="main px-32" @click="create">Yaratish</Button>
        <Button class="px-32" @click="$emits('cancel')">Bekor qilish</Button>
      </div>
    </template>
  </g-modal>
</template>

<script setup>
import GModal from '@/components/g/Modal.vue'
import Button from '@/components/g/Button.vue'
import Input from '@/components/g/Input.vue'
import GSwitch from '@/components/g/Switch'
import Textarea from '@/components/g/Textarea'
import GTabLang from '@/components/g/TabLang.vue'
import { useAdminStatisticsStore } from '@/store/admin/statistics'
import { ref, defineEmits, defineProps, onMounted } from 'vue'
import api from '@/plugins/axios'

const $emits = defineEmits({
  'cancel': null,
  'created': null
})
const $props = defineProps({
  'id': null,
})
const statisticsStore = useAdminStatisticsStore()
const lang = ref('oz')
const updateForm = ref({
  title: {
    "oz": null,
    "ru": null,
  },
  number: null,
  status: false,
  description: {
    "oz": null,
    "ru": null
  }
})

onMounted(async () => {
  try {
    let res = await api.get(`/admin/statistics/${$props.id}`)

    updateForm.value = res?.data || {}
  } catch(e) {
    console.error(e)
  }
})

const create = async () => {
  try {
    await statisticsStore.update($props.id, {
      ...updateForm.value
    })
    $emits('updated')
  } catch (e) {
    alert(e)
    console.error(e)
  }
}
</script>
<template>
  <g-modal title="Statistika yaratish" width="1000" @close="$emits('cancel')">
    <template v-slot:body>
      <div class="rows gap-24 mb-24">
        <div class="col-24">
          <g-tab-lang v-model="lang"></g-tab-lang>
        </div>
        <div class="col-24">
          <Input label="Raqamlar" :value="createForm.number" placeholder="Kiriting" v-model="createForm.number"></Input>
        </div>
        <div class="col-24">
          <Input label="Sarlavha" :value="createForm.title[lang]" placeholder="Sarlavha" v-model="createForm.title[lang]"></Input>
        </div>
        <div class="col-24">
          <Textarea label="Izoh" :value="createForm.description[lang]" placeholder="Izoh" v-model="createForm.description[lang]"></Textarea>
        </div>
        <div class="col-24">
          <GSwitch v-model="createForm.status" label="Status"></GSwitch>
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
import Textarea from '@/components/g/Textarea.vue'
import GSwitch from '@/components/g/Switch'
import GTabLang from '@/components/g/TabLang.vue'
import { useAdminStatisticsStore } from '@/store/admin/statistics'
import {ref, defineEmits} from 'vue'

const $emits = defineEmits({
    'cancel': null, 
    'created': null
})
const statisticsStore = useAdminStatisticsStore()
const lang = ref('oz')
const createForm = ref({
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

const create = async () => {
  try {
    await statisticsStore.create({
      ...createForm.value
    })
    $emits('created')
  } catch (e) {
    alert(e)
    console.error(e)
  }
}
</script>
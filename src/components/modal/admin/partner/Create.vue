<template>
  <g-modal title="Yangi hamkor yaratish" width="1000" @close="$emits('cancel')">
    <template v-slot:body>
      <div class="rows gap-24 mb-24">
        <div class="col-24">
          <g-tab-lang v-model="lang"></g-tab-lang>
        </div>
        <div class="col-24">
          <GInput label="Tartib raqami" :value="createForm.index" placeholder="Tartib raqami" v-model="createForm.index"></GInput>
        </div>
        <div class="col-24">
          <Textarea label="Nomi" :value="createForm.name[lang]" placeholder="Nomi" v-model="createForm.name[lang]"></Textarea>
        </div>
        <div class="col-24">
          <Textarea label="Izoh" :value="createForm.comment[lang]" placeholder="Izoh" v-model="createForm.comment[lang]"></Textarea>
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
import GInput from '@/components/g/Input.vue'
import Button from '@/components/g/Button.vue'
import Textarea from '@/components/g/Textarea.vue'
import GSwitch from '@/components/g/Switch'
import GTabLang from '@/components/g/TabLang.vue'
import { useAdminPartnerStore } from '@/store/admin/partner'
import {ref, defineEmits} from 'vue'

const $emits = defineEmits({
    'cancel': null, 
    'created': null
})
const partnerStore = useAdminPartnerStore()
const lang = ref('oz')
const createForm = ref({
  name: {
    "oz": null,
    "ru": null,
  },
  index: null,
  status: false,
  comment: {
    "oz": null,
    "ru": null
  }
})

const create = async () => {
  try {
    await partnerStore.create({
      ...createForm.value,
      index: createForm.value.index ? +createForm.value.index : 1
    })
    $emits('created')
  } catch (e) {
    alert(e)
    console.error(e)
  }
}
</script>
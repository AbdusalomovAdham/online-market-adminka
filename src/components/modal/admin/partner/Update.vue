<template>
  <g-modal title="Yangi hamkor yaratish" width="1000" @close="$emits('cancel')">
    <template v-slot:body>
      <div class="rows gap-24 mb-24">
        <div class="col-24">
          <g-tab-lang v-model="lang"></g-tab-lang>
        </div>
        <div class="col-24">
          <GInput label="Tartib raqami" :value="updateForm.index" placeholder="Tartib raqami" v-model="updateForm.index"></GInput>
        </div>
        <div class="col-24">
          <Textarea label="Nomi" :value="updateForm.name[lang]" placeholder="Nomi"
            v-model="updateForm.name[lang]"></Textarea>
        </div>
        <div class="col-24">
          <Textarea label="Izoh" :value="updateForm.comment[lang]" placeholder="Izoh"
            v-model="updateForm.comment[lang]"></Textarea>
        </div>
        <div class="col-24">
          <GSwitch v-model="updateForm.status" label="Status"></GSwitch>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex gap-12 content-end">
        <Button class="main px-32" @click="update">Yangilash</Button>
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
import { ref, defineEmits, onMounted } from 'vue'
import api from '@/plugins/axios'

const $emits = defineEmits({
  'cancel': null,
  'updated': null
})
const $props = defineProps({
  id: null
})
const partnerStore = useAdminPartnerStore()
const lang = ref('oz')
const updateForm = ref({
  id: null,
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

onMounted(async () => {
  try {
    let res = await api.get(`/admin/partner/${$props.id}`)
    
    updateForm.value = { ...res.data }
  } catch (e) {
    console.error(e)
  }
})

const update = async () => {
  try {
    await partnerStore.update($props.id, {
      ...updateForm.value,
      index: updateForm.value.index ? +updateForm.value.index : 1
    })
    $emits('updated')
  } catch (e) {
    alert(e)
    console.error(e)
  }
}
</script>
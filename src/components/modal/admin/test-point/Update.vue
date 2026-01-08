<template>
  <g-modal title="Yangi ko'rsatkich yaratish" width="1000" @close="$emits('cancel')">
    <template v-slot:body>
      <div class="rows gap-24 mb-24">
        <div class="col-24">
          <g-tab-lang v-model="lang"></g-tab-lang>
        </div>
        <div class="col-24">
          <Input v-model="updateForm.comment[lang]" placeholder="Test nomi"></Input>
        </div>
        <div class="col-12">
          <Input v-model="updateForm.minPoint" type="number" placeholder="Dan"></Input>
        </div>
        <div class="col-12">
          <Input v-model="updateForm.maxPoint" type="number" placeholder="Gacha"></Input>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex gap-12 content-end">
        <Button class="main px-32" @click="update">Yaratish</Button>
        <Button class="px-32" @click="$emits('cancel')">Bekor qilish</Button>
      </div>
    </template>
  </g-modal>
</template>

<script setup>
import GModal from '@/components/g/Modal.vue'
import Button from '@/components/g/Button.vue'
import Input from '@/components/g/Input.vue'
import GTabLang from '@/components/g/TabLang.vue'
import { useAdminTestPointStore } from '@/store/admin/test-point'
import { ref, defineEmits, defineProps, onMounted } from 'vue'
import api from '@/plugins/axios'

const $emits = defineEmits({
  'cancel': null,
  'updated': null
})
const $props = defineProps({
  id: null
})
const testPointStore = useAdminTestPointStore()
const lang = ref('oz')
const updateForm = ref({
  id: null,
  comment: {
    "oz": null,
    "ru": null,
  },
  maxPoint: null,
  minPoint: null,
})

onMounted(async () => {
   try {
    const res = await api.get(`/admin/test-point/${$props.id}`)

    updateForm.value = {...res?.data}
   } catch(e) {
    console.error(e)
   }
})

const update = async () => {
  try {
    await testPointStore.update($props.id, {
      ...updateForm.value,
      minPoint: +updateForm.value.minPoint,
      maxPoint: +updateForm.value.maxPoint,
    })
    $emits('updated')
  } catch (e) {
    alert(e)
    console.error(e)
  }
}
</script>
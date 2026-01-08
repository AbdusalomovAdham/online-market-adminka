<template>
  <g-modal title="Yangi test yaratish" width="1000" @close="$emits('cancel')">
    <template v-slot:body>
      <div class="rows gap-24 mb-24">
        <div class="col-24">
          <g-tab-lang v-model="lang"></g-tab-lang>
        </div>
        <div class="col-12">
          <Input v-model="updateForm.name[lang]" placeholder="Test nomi"></Input>
        </div>
        <div class="col-12">
          <Input v-model="updateForm.random_count" type="number" placeholder="Random savollar soni"></Input>
        </div>
        <div class="col-12">
          <Input v-model="updateForm.maxPoint" type="number" placeholder="Maksimal ball"></Input>
        </div>
        <div class="col-12">
          <Input v-model="updateForm.duration" type="number" placeholder="Test yechish vaqti (minut)"></Input>
        </div>
        <div class="col-12">
          <Select v-model="updateForm.type" placeholder="Test turi" :options="typeList" option="title"
            value="value"></Select>
        </div>
        <div v-if="updateForm.type == 'PRIVATE'" class="col-12">
          <Input v-model="updateForm.price" type="number" placeholder="Test yechish narxi (so'm)"></Input>
        </div>
        <div class="col-12">
          <Input v-model="updateForm.matchableCount" type="number" placeholder="Match savollar soni"></Input>
        </div>
        <div v-show="lang == 'oz'" class="col-24">
          <Quill label="Izoh" :value="updateForm.description['oz']" v-model="updateForm.description['oz']"></Quill>
        </div>
        <div v-show="lang == 'ru'" class="col-24">
          <Quill label="Izoh" :value="updateForm.description['oz']" v-model="updateForm.description['ru']"></Quill>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex gap-12 content-end">
        <Button class="main px-32" @click="update">Saqlash</Button>
        <Button class="px-32" @click="$emits('cancel')">Bekor qilish</Button>
      </div>
    </template>
  </g-modal>
</template>

<script setup>
import GModal from '@/components/g/Modal.vue'
import Button from '@/components/g/Button.vue'
import Input from '@/components/g/Input.vue'
import Quill from '@/components/g/Quill.vue'
import GTabLang from '@/components/g/TabLang.vue'
import Select from '@/components/g/Select.vue'
import { useAdminTestStore } from '@/store/admin/test'
import { ref, defineEmits, onMounted } from 'vue'
import api from '@/plugins/axios'

const $emits = defineEmits({
  'cancel': null,
  'updated': null
})
const $props = defineProps({
  id: null
})
const typeList = [
  {
    value: 'PRIVATE',
    title: 'Pullik'
  },
  {
    value: 'PUBLIC',
    title: 'Tekin'
  }
]
const testStore = useAdminTestStore()
const lang = ref('oz')
const updateForm = ref({
  name: {
    "oz": null,
    "ru": null,
  },
  random_count: null,
  price: null,
  status: false,
  type: null,
  maxPoint: null,
  duration: null,
  description: {
    "oz": null,
    "ru": null
  },
  matchableCount: 0
})

onMounted(async () => {
  try {
    const res = await api.get(`/admin/test/${$props.id}`)

    updateForm.value = {...res?.data}
  } catch(e) {
    console.error(e)
  }
})

const update = async () => {
  try {
    await testStore.update($props.id, {
      ...updateForm.value,
      price: +updateForm.value.price,
      duration: +updateForm.value.duration,
      random_count: +updateForm.value.random_count,
      maxPoint: +updateForm.value.maxPoint,
      matchableCount: +updateForm.value.matchableCount,
    })
    $emits('updated')
  } catch (e) {
    alert(e)
    console.error(e)
  }
}
</script>
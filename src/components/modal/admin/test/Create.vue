<template>
  <g-modal title="Yangi test yaratish" width="1000" @close="$emits('cancel')">
    <template v-slot:body>
      <div class="rows gap-24 mb-24">
        <div class="col-24">
          <g-tab-lang v-model="lang"></g-tab-lang>
        </div>
        <div class="col-12">
          <Input v-model="createForm.name[lang]" placeholder="Test nomi"></Input>
        </div>
        <div class="col-12">
          <Input v-model="createForm.random_count" type="number" placeholder="Random savollar soni"></Input>
        </div>
        <div class="col-12">
          <Input v-model="createForm.maxPoint" type="number" placeholder="Maksimal ball"></Input>
        </div>
        <div class="col-12">
          <Input v-model="createForm.duration" type="number" placeholder="Test yechish vaqti (minut)"></Input>
        </div>
        <div class="col-12">
          <Select v-model="createForm.type" placeholder="Test turi" :options="typeList" option="title"
            value="value"></Select>
        </div>
        <div v-if="createForm.type == 'PRIVATE'" class="col-12">
          <Input v-model="createForm.price" type="number" placeholder="Test yechish narxi (so'm)"></Input>
        </div>
        <div class="col-12">
          <Input v-model="createForm.matchableCount" type="number" placeholder="Match savollar soni"></Input>
        </div>
        <div v-show="lang == 'oz'" class="col-24">
          <Quill label="Izoh" :value="createForm.description['oz']" v-model="createForm.description['oz']"></Quill>
        </div>
        <div v-show="lang == 'ru'" class="col-24">
          <Quill label="Izoh" :value="createForm.description['oz']" v-model="createForm.description['ru']"></Quill>
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
import Quill from '@/components/g/Quill.vue'
import GTabLang from '@/components/g/TabLang.vue'
import Select from '@/components/g/Select.vue'
import { useAdminTestStore } from '@/store/admin/test'
import {ref, defineEmits} from 'vue'

const $emits = defineEmits({
    'cancel': null, 
    'created': null
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
const createForm = ref({
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

const create = async () => {
  try {
    await testStore.create({
      ...createForm.value,
      price: +createForm.value.price,
      duration: +createForm.value.duration,
      random_count: +createForm.value.random_count,
      maxPoint: +createForm.value.maxPoint,
      matchableCount: +createForm.value.matchableCount,
    })
    $emits('created')
  } catch (e) {
    alert(e)
    console.error(e)
  }
}
</script>
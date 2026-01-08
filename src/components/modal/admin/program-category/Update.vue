<template>
  <g-modal title="Tahrirlash" width="600" @close="$emits('cancel')">
    <template v-slot:body>
      <div class="rows gap-24 mb-24">
        <div class="col-24">
          <Input
            label="Kategoriya nomi"
            :value="updateForm.name"
            placeholder="Kiriting"
            v-model="updateForm.name"
          ></Input>
        </div>
        <div class="col-24">
          <Input
            label="Rang"
            :value="updateForm.color"
            placeholder="Kiriting"
            v-model="updateForm.color"
          ></Input>
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
import GModal from "@/components/g/Modal.vue";
import Button from "@/components/g/Button.vue";
import Input from "@/components/g/Input.vue";
import { ref, defineEmits, onMounted } from "vue";
import axios from "@/plugins/axios";

const $emits = defineEmits({
  cancel: null,
  updated: null,
});
const $props = defineProps({
  id: null,
});
const updateForm = ref({
  id: null,
  name: null,
});

const fetchDetail = async () => {
  try {
    const response = await axios.get(`/admin/program-category/${$props.id}`);
    updateForm.value = response?.data || {};
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

const update = async () => {
  try {
    await axios.put(`/admin/program-category/${$props.id}`, {
      ...updateForm.value,
      userId: +updateForm.value.userId || null,
    });
    $emits("updated");
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

onMounted(async () => {
  await fetchDetail();
});
</script>

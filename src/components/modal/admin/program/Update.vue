<template>
  <g-modal title="Tahrirlash" width="600" @close="$emits('cancel')">
    <template v-slot:body>
      <div class="rows gap-24 mb-24">
        <div class="col-24">
          <Select
            label="Ilovalar"
            placeholder="Tanlang"
            v-model="updateForm.key"
            :options="activeProgramList"
            option="activeProgram"
            value="activeProgram"
          ></Select>
        </div>
        <div class="col-24">
          <Select
            label="Kategoriya"
            placeholder="Tanlang"
            v-model="updateForm.categoryId"
            :options="categoryList"
            option="name"
            value="id"
          ></Select>
        </div>
        <div class="col-24">
          <Input
            label="Ilova nomi"
            :value="updateForm.name"
            placeholder="Ilova nomi"
            v-model="updateForm.name"
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
import Select from "@/components/g/Select.vue";
import { ref, defineEmits, defineProps, onMounted } from "vue";
import axios from "@/plugins/axios";

const $emits = defineEmits({
  cancel: null,
  updated: null,
});
const $props = defineProps({
  id: null,
});
const activeProgramList = ref([]);
const categoryList = ref([]);
const updateForm = ref({
  name: null,
  categoryId: null,
});

const fetchActivePrograms = async () => {
  try {
    const response = await axios.get(
      "/admin/device-activity/active-program/statistics"
    );
    activeProgramList.value = response || [];
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get("/admin/program-category/list");
    categoryList.value = response?.data?.results || [];
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

const fetchDetail = async () => {
  try {
    const response = await axios.get(`/admin/program/${$props.id}`);
    updateForm.value = response?.data || {};
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

const update = async () => {
  try {
    await axios.put(`/admin/program/${$props.id}`, {
      ...updateForm.value,
      categoryId: +updateForm.value.categoryId,
    });
    $emits("updated");
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

onMounted(async () => {
  await fetchDetail();
  fetchActivePrograms();
  fetchCategories();
});
</script>

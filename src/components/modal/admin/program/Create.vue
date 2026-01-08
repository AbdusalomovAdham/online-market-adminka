<template>
  <g-modal title="Yangi ilova yaratish" width="600" @close="$emits('cancel')">
    <template v-slot:body>
      <div class="rows gap-24 mb-24">
        <div class="col-24">
          <Select
            label="Ilovalar"
            placeholder="Tanlang"
            v-model="createForm.key"
            :options="activeProgramList"
            option="activeProgram"
            value="activeProgram"
          ></Select>
        </div>
        <div class="col-24">
          <Select
            label="Kategoriya"
            placeholder="Tanlang"
            v-model="createForm.categoryId"
            :options="categoryList"
            option="name"
            value="id"
          ></Select>
        </div>
        <div class="col-24">
          <Input
            label="Ilova nomi"
            :value="createForm.name"
            placeholder="Ilova nomi"
            v-model="createForm.name"
          ></Input>
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
import GModal from "@/components/g/Modal.vue";
import Button from "@/components/g/Button.vue";
import Input from "@/components/g/Input.vue";
import Select from "@/components/g/Select.vue";
import { ref, defineEmits, onMounted } from "vue";
import axios from "@/plugins/axios";

const $emits = defineEmits({
  cancel: null,
  created: null,
});
const activeProgramList = ref([]);
const categoryList = ref([]);
const createForm = ref({
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

const create = async () => {
  try {
    await axios.post("/admin/program/create", {
      ...createForm.value,
      categoryId: +createForm.value.categoryId,
    });
    $emits("created");
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

onMounted(async () => {
  fetchActivePrograms();
  fetchCategories();
});
</script>

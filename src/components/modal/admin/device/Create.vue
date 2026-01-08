<template>
  <g-modal title="Yangi qurilma yaratish" width="600" @close="$emits('cancel')">
    <template v-slot:body>
      <div class="rows gap-24 mb-24">
        <div class="col-24">
          <Select
            label="Xodim"
            placeholder="Tanlang"
            v-model="createForm.userId"
            :options="userList"
            option="full_name"
            value="id"
          ></Select>
        </div>
        <div class="col-24">
          <Input
            label="Qurilma nomi"
            :value="createForm.name"
            placeholder="Qurilma nomi"
            v-model="createForm.name"
          ></Input>
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
import GModal from "@/components/g/Modal.vue";
import Button from "@/components/g/Button.vue";
import Input from "@/components/g/Input.vue";
import GSwitch from "@/components/g/Switch";
import Select from "@/components/g/Select.vue";
import { ref, defineEmits, onMounted } from "vue";
import axios from "@/plugins/axios";

const $emits = defineEmits({
  cancel: null,
  created: null,
});
const userList = ref([]);
const createForm = ref({
  name: null,
  status: false,
  userId: null,
});

const fetchUsers = async () => {
  try {
    const response = await axios.get("/admin/user/list");
    userList.value = response?.data?.results;
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

const create = async () => {
  try {
    await axios.post("/admin/device/create", {
      ...createForm.value,
      userId: +createForm.value.userId || null,
    });
    $emits("created");
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

onMounted(async () => {
  await fetchUsers();
});
</script>

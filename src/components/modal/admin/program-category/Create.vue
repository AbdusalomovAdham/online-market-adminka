<template>
  <g-modal
    title="Yangi ilova kategoriyasi yaratish"
    width="600"
    @close="$emits('cancel')"
  >
    <template v-slot:body>
      <div class="rows gap-24 mb-24">
        <div class="col-24">
          <Input
            label="Kategoriya nomi"
            :value="createForm.name"
            placeholder="Kiriting"
            v-model="createForm.name"
          ></Input>
        </div>
        <div class="col-24">
          <Input
            label="Rang"
            :value="createForm.color"
            placeholder="Kiriting"
            v-model="createForm.color"
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
import { ref, defineEmits } from "vue";
import axios from "@/plugins/axios";

const $emits = defineEmits({
  cancel: null,
  created: null,
});
const createForm = ref({
  name: null,
});

const create = async () => {
  try {
    await axios.post("/admin/program-category/create", {
      ...createForm.value,
    });
    $emits("created");
  } catch (e) {
    alert(e);
    console.error(e);
  }
};
</script>

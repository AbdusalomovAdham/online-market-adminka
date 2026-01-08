<template>
  <g-modal title="Parametr tahrirlash" width="600" @close="$emits('cancel')">
    <template #body>
      <!-- LANGUAGE TABS -->
      <div class="lang-tabs mb-24">
        <button
          v-for="l in langs"
          :key="l"
          :class="{ active: activeLang === l }"
          @click="activeLang = l"
        >
          {{ l.toUpperCase() }}
        </button>
      </div>

      <div class="rows gap-24 mb-24">
        <!-- CATEGORY NAME -->
        <div class="col-24">
          <Input
            :label="`Parametr nomi (${activeLang.toUpperCase()})`"
            placeholder="Parametr nomini kiriting"
            v-model="updateForm.name[activeLang]"
          />
        </div>

        <!-- PARAM TYPE -->
        <div class="col-24">
          <Select
            label="Parametr turi"
            placeholder="Tanlang"
            v-model="updateForm.type"
            :options="paramTypes"
            option="name"
            value="value"
          />
        </div>

        <!-- PARENT CATEGORY -->
        <div class="col-24">
          <!-- <Select
            label="Kategoriya"
            placeholder="Tanlang"
            v-model="updateForm.category_id"
            :options="categoryList"
            option="name"
            value="id"
          /> -->

          <MultiSelect
            v-model="updateForm.category_id"
            :data="categoryList"
            :optionValue="'id'"
            placeholder="Katigoriyani tanlang"
          />
        </div>

        <!-- STATUS -->
        <div class="col-24">
          <GSwitch v-model="updateForm.status" label="Status" />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-12 content-end">
        <Button class="main px-32" @click="update">Yangilash</Button>
        <Button class="px-32" @click="$emits('cancel')"> Bekor qilish </Button>
      </div>
    </template>
  </g-modal>
</template>

<script setup>
import { ref, defineEmits, onMounted } from "vue";
import axios from "@/plugins/axios";

import GModal from "@/components/g/Modal.vue";
import Button from "@/components/g/Button.vue";
import Input from "@/components/g/Input.vue";
import GSwitch from "@/components/g/Switch";
import Select from "@/components/g/Select.vue";
import MultiSelect from "@/components/g/MultiSelect.vue";

const $emits = defineEmits(["cancel", "created"]);

// props
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

// languages
const langs = ["uz", "ru", "en"];
const activeLang = ref("uz");

// form
const updateForm = ref({
  name: {
    uz: "",
    ru: "",
    en: "",
  },
  status: true,
  category_id: null,
  type: null,
});

// parent categories
const categoryList = ref([]);

// fetch categories
const fetchCategories = async () => {
  const res = await axios.get("/admin/category/list");
  categoryList.value = res?.data?.results || [];
};

// udpate
const update = async () => {
  if (
    !updateForm.value.name.uz ||
    !updateForm.value.name.ru ||
    !updateForm.value.name.en
  ) {
    alert("Iltimos, barcha maydonlarni to'ldiring");
    return;
  }

  try {
    await axios.patch(`/admin/param/${props.id}`, updateForm.value);

    $emits("close");
    $emits("updated");
  } catch (e) {
    console.error(e);
    alert("Xatolik yuz berdi");
  }
};

// param types
const paramTypes = ref([
  { id: 1, name: "Select", value: "select" },
  { id: 2, name: "Number", value: "number" },
  { id: 3, name: "Multiselect", value: "multiselect" },
  { id: 4, name: "Text", value: "text" },
]);

// get param by id
const getParamById = async (id) => {
  const res = await axios.get(`/admin/param/${id}`);
  updateForm.value = res?.data || {};
};

onMounted(() => {
  fetchCategories();
  getParamById(props.id);
});
</script>

<style scoped>
.lang-tabs {
  display: flex;
  gap: 8px;

  button {
    flex: 1;
    padding: 8px 0;
    border-radius: 4px;
    border: none;
    background: #efefef;
    font-weight: 600;
    cursor: pointer;

    &.active {
      background: linear-gradient(180deg, #4ba0f3 0%, #197cdc 100%);
      color: #fff;
    }
  }
}
</style>

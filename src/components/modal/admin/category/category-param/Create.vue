<template>
  <g-modal
    title="Yangi parametr yaratish"
    width="600"
    @close="$emits('cancel')"
  >
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
            :label="`Kategoriya nomi (${activeLang.toUpperCase()})`"
            placeholder="Kategoriya nomini kiriting"
            v-model="createForm.name[activeLang]"
          />
        </div>

        <!-- PARAM TYPE -->
        <div class="col-24">
          <Select
            label="Parametr turi"
            placeholder="Tanlang"
            v-model="createForm.type"
            :options="paramTypes"
            option="name"
            value="value"
          />
        </div>

        <!-- PARENT CATEGORY -->
        <div class="col-24">
          <MultiSelect
            v-model="createForm.categoryId"
            :data="categoryList"
            :placeholder="'Katigoriyani tanlang'"
          />
        </div>

        <!-- STATUS -->
        <div class="col-24">
          <GSwitch v-model="createForm.status" label="Status" />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex gap-12 content-end">
        <Button class="main px-32" @click="create">Yaratish</Button>
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

// languages
const langs = ["uz", "ru", "en"];
const activeLang = ref("uz");

// category id
const categoryId = ref([]);

// form
const createForm = ref({
  name: {
    uz: "",
    ru: "",
    en: "",
  },
  status: true,
  categoryId: null,
  type: null,
});

// parent categories
const categoryList = ref([]);

const fetchCategories = async () => {
  const res = await axios.get("/admin/category/list");
  categoryList.value = res?.data?.results || [];
};

const create = async () => {
  if (
    !createForm.value.name.uz ||
    !createForm.value.name.ru ||
    !createForm.value.name.en
  ) {
    alert("Iltimos, barcha maydonlarni to'ldiring");
    return;
  }

  if (createForm.value.parent_id) {
    createForm.value.parent_id = parseInt(createForm.value.parent_id);
  }

  try {
    await axios.post("/admin/param/create", {
      name: {
        uz: createForm.value.name.uz,
        ru: createForm.value.name.ru,
        en: createForm.value.name.en,
      },
      category_id: createForm.value.categoryId,
      status: createForm.value.status,
      type: createForm.value.type,
    });

    $emits("created");
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

onMounted(fetchCategories);
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

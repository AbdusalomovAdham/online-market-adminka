<template>
  <g-modal
    title="Kategoriyani tahrirlash"
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

        <!-- PARENT CATEGORY -->
        <div class="col-24">
          <Select
            label="Ota kategoriya (ixtiyoriy)"
            placeholder="Tanlang"
            v-model="createForm.parent_id"
            :options="categoryList"
            option="name"
            value="id"
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
        <Button class="main px-32" @click="update">Tahrirlash</Button>
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

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const $emits = defineEmits(["cancel", "created"]);

// languages
const langs = ["uz", "ru", "en"];
const activeLang = ref("uz");

// form
const createForm = ref({
  name: {
    uz: "",
    ru: "",
    en: "",
  },
  status: true,
  parent_id: null,
});

// parent categories
const categoryList = ref([]);

const fetchCategories = async () => {
  const res = await axios.get("/admin/category/list");
  categoryList.value = res?.data?.results || [];
};

const getCategoryById = async (id) => {
  const res = await axios.get(`/admin/category/${id}`);
  createForm.value = res?.data || {};
};

const update = async () => {
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
  } else {
    createForm.value.parent_id = null;
  }

  try {
    await axios.patch(`/admin/category/${props.id}`, {
      name: {
        uz: createForm.value.name.uz,
        ru: createForm.value.name.ru,
        en: createForm.value.name.en,
      },
      parent_id: createForm.value.parent_id,
      status: createForm.value.status,
    });

    $emits("close");
    $emits("updated");
  } catch (e) {
    console.error(e);
    alert("Xatolik yuz berdi");
  }
};

onMounted(() => {
  fetchCategories();
  getCategoryById(props.id);
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

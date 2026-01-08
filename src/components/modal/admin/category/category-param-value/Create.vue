<template>
  <g-modal
    title="Yangi parametr qiymatini yaratish"
    width="600"
    @close="$emits('cancel')"
  >
    <template #body>
      <!-- LANGUAGE TABS -->
      <div class="lang-tabs mb-24">
        <button
          v-for="lang in languages"
          :key="lang"
          :class="{ active: currentLanguage === lang }"
          @click="currentLanguage = lang"
        >
          {{ lang.toUpperCase() }}
        </button>
      </div>

      <div class="rows gap-24 mb-24">
        <!-- PARAM VALUE NAME -->
        <div class="col-24">
          <Input
            :label="`Qiymat nomi (${currentLanguage.toUpperCase()})`"
            placeholder="Qiymat nomini kiriting"
            v-model="formData.name[currentLanguage]"
          />
        </div>

        <!-- PARAM TYPE -->
        <div class="col-24">
          <Select
            label="Parametrni tanlang"
            placeholder="Tanlang"
            v-model="formData.param_id"
            :options="parameterList"
            option="param_name"
            value="id"
          />
        </div>

        <!-- STATUS -->
        <div class="col-24">
          <GSwitch v-model="formData.status" label="Status" />
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
const languages = ["uz", "ru", "en"];
const currentLanguage = ref("uz");

// category ids (unused but kept)
const categoryIds = ref([]);

// form data
const formData = ref({
  name: {
    uz: "",
    ru: "",
    en: "",
  },
  status: true,
  param_id: null,
});

// parameter list
const parameterList = ref([]);

// fetch parameter list
const fetchParameters = async () => {
  const res = await axios.get("/admin/param/list");
  parameterList.value = res?.data?.results || [];
};

// create parameter value
const create = async () => {
  if (
    !formData.value.name.uz ||
    !formData.value.name.ru ||
    !formData.value.name.en
  ) {
    alert("Iltimos, barcha maydonlarni to'ldiring");
    return;
  }

  if (formData.value.param_id) {
    formData.value.param_id = parseInt(formData.value.param_id);
  } else {
    alert("Parametr tanlang!");
    return;
  }

  try {
    await axios.post("/admin/param-value/create", formData.value);
    $emits("created");
  } catch (e) {
    console.error(e);
    alert("Xatolik yuz berdi");
  }
};

onMounted(() => {
  fetchParameters();
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

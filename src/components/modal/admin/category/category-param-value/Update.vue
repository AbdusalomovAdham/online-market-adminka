<template>
  <g-modal
    title="Parametr qiymatini tahrirlash"
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
        <!-- PARAMETER VALUE NAME -->
        <div class="col-24">
          <Input
            :label="`Parametr qiymatini kiriting (${currentLanguage.toUpperCase()})`"
            placeholder="Parametr qiymatini kiriting"
            v-model="formData.name[currentLanguage]"
          />
        </div>

        <!-- PARAMETER SELECT -->
        <div class="col-24">
          <Select
            label="Parametrni tanlang"
            placeholder="Parametrni tanlang"
            v-model="formData.param_id"
            :options="parameterList"
            option="param_name"
            value="id"
          />
        </div>

        <!-- STATUS SWITCH -->
        <div class="col-24">
          <GSwitch v-model="formData.status" label="Holati" />
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
import MultiSelect from "@/components/g/MultiSelect.vue";

const $emits = defineEmits(["cancel", "created"]);

// languages
const languages = ["uz", "ru", "en"];
const currentLanguage = ref("uz");

// props
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

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

// update parameter value
const update = async () => {
  if (
    !formData.value.name.uz ||
    !formData.value.name.ru ||
    !formData.value.name.en
  ) {
    alert("Please fill in all fields");
    return;
  }

  if (formData.value.param_id) {
    formData.value.param_id = parseInt(formData.value.param_id);
  } else {
    alert("Parametr tanlang!");
    return;
  }

  try {
    await axios.patch(`/admin/param-value/${props.id}`, formData.value);
    $emits("updated");
  } catch (e) {
    console.error(e);
    alert("An error occurred");
  }
};

// get parameter value by id
const getParameterValueById = async (id) => {
  const res = await axios.get(`/admin/param-value/${id}`);
  formData.value = res?.data || {};
};

onMounted(() => {
  fetchParameters();
  getParameterValueById(props.id);
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

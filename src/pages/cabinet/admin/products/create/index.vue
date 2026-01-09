<template>
  <!-- PAGE HEADER -->
  <div class="page-header flex gap-12 items-center mb-16">
    <div class="title">
      <h1 class="white">Yangi mahsulot qo'shish</h1>
    </div>
  </div>

  <div class="page-body">
    <div class="add-product">
      <div class="grid">
        <!-- LEFT SIDE -->
        <div class="left">
          <!-- GENERAL PRODUCT INFORMATION -->
          <div class="card">
            <h3>Umumiy ma’lumot</h3>

            <div class="lang-tabs mb-16">
              <button
                v-for="l in langs"
                :key="l"
                :class="{ active: activeLang === l }"
                @click="activeLang = l"
              >
                {{ l.toUpperCase() }}
              </button>
            </div>

            <!-- Product name -->
            <div class="product-name mb-16">
              <Input
                type="text"
                :placeholder="`Mahsulot nomi (${activeLang.toLowerCase()})`"
                v-model="form.name[activeLang]"
              />
            </div>

            <!-- Product description -->
            <div class="field">
              <textarea
                rows="4"
                :placeholder="`Mahsulot haqida ma'lumot (${activeLang.toLowerCase()})`"
                v-model="form.description[activeLang]"
              ></textarea>
            </div>
          </div>

          <!-- CATEGORY SELECTION -->
          <div class="card">
            <h3>Katigoriya</h3>

            <div class="mb-24">
              <!-- Category select -->
              <Select
                placeholder="Kategoriya tanlang"
                v-model="form.category_id"
                :options="categories"
                option="name"
                value="id"
              />
            </div>

            <!-- PARAMETER VALUES SECTION -->
            <div class="param-values">
              <!-- Dynamic parameter rows -->
              <div class="rows gap-24 mb-24" v-for="(p, index) in form.params">
                <!-- Parameter select -->
                <div class="col-11">
                  <Select
                    placeholder="Parametrni tanlang "
                    :options="categoryDataGetById.params"
                    option="name"
                    v-model="p.param_id"
                    value="id"
                    :disabled="!form.category_id"
                    @update:modelValue="onParamChange(p, index)"
                  />
                </div>

                <!-- Parameter value multiselect -->
                <div class="col-11">
                  <MultiSelect
                    v-model="p.selectedValues"
                    :data="p.values"
                    placeholder="Qiymatni tanlang"
                    :disabled="!p.param_id"
                  />
                </div>

                <!-- Remove parameter button -->
                <div class="col-2 flex center" style="padding: 0">
                  <Button class="btn red" @click="removeParam(index)">
                    <IconTrash />
                  </Button>
                </div>
              </div>

              <!-- Add new parameter -->
              <Button
                class="btn flex center w-100p white"
                style="
                  background: linear-gradient(180deg, #4ba0f3 0%, #197cdc 100%);
                "
                @click="addParam"
              >
                Qiymat qo'shish
              </Button>
            </div>
          </div>

          <!-- PRICING AND ADDITIONAL INFO -->
          <div class="card">
            <h3>Qo'shimcha ma'lumotlar</h3>

            <div class="row">
              <!-- Product price -->
              <div class="col-12 mb-16">
                <Input
                  type="number"
                  v-model="form.price"
                  placeholder="Mahsulot narxi"
                  min="0"
                />
              </div>

              <!-- Stock quantity -->
              <div class="col-12">
                <Input
                  type="number"
                  placeholder="Ombordagi miqdori"
                  v-model.number="form.stock_quantity"
                  min="0"
                  step="1"
                />
              </div>

              <!-- Discount percentage -->
              <div class="col-12 mb-16">
                <Input
                  type="number"
                  placeholder="Chegirma miqdori (%)"
                  v-model="form.discount_percent"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>

              <!-- Discount type -->
              <div class="col-12 mb-16">
                <Select
                  placeholder="Chegirma turini tanlang "
                  :options="categoryDataGetById.params"
                  option="name"
                  v-model="form.discount_type"
                  value="id"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="right">
          <!-- IMAGE UPLOAD -->
          <div class="card">
            <h3>Mahsulot rasmi</h3>

            <!-- Preview area -->
            <div class="upload-disabled">
              <img
                v-if="form.images.length"
                :src="form.images[selectedImageIndex].url"
              />
              <p v-else>Mahsulot rasmi</p>
            </div>

            <!-- Upload controls -->
            <div>
              <div class="upload-main" @click="openFile"></div>

              <!-- File input -->
              <input
                type="file"
                ref="fileInput"
                hidden
                multiple
                accept="image/*"
                @change="onFileChange"
              />

              <!-- Thumbnails -->
              <div class="thumbs">
                <div
                  v-for="(img, i) in form.images"
                  :key="i"
                  class="thumb"
                  :class="{ active: selectedImageIndex === i }"
                  @click="selectedImageIndex = i"
                >
                  <img :src="img.url" />
                  <span class="remove" @click.stop="removeImage(i)">×</span>
                </div>

                <!-- Add image button -->
                <div
                  v-if="form.images.length < 5"
                  class="thumb add"
                  @click="openFile"
                >
                  +
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOTER ACTIONS -->
      <div class="actions-footer">
        <Button class="btn btn-save" @click="submit">Qo'shish</Button>
        <Button class="btn" @click="router.back()">Bekor qilish</Button>
      </div>
    </div>
  </div>

  <div class="page-footer"></div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import axios from "@/plugins/axios";
import router from "@/router";

// UI components
import MultiSelect from "@/components/g/MultiSelect.vue";
import Select from "@/components/g/Select.vue";
import Button from "@/components/g/Button.vue";
import Input from "@/components/g/Input.vue";

// Icons
import IconTrash from "@/components/icon/Trash.vue";

// File input reference
const fileInput = ref(null);

// Categories list
const categories = ref([]);

// Parameter counter (not directly used, but kept)
const paramCount = ref(1);

// Trigger hidden file input
const openFile = () => {
  fileInput.value?.click();
};

const langs = ["uz", "ru", "en"];
const activeLang = ref("uz");
const form = ref({
  price: "",
  name: {
    uz: "",
    ru: "",
    en: "",
  },
  description: {
    uz: "",
    ru: "",
    en: "",
  },
  category_id: null,
  discount_percent: "",
  stock_quantity: null,
  images: [],
  param_value_id: null,
  params: [],
  discount_type: null,
});

// Add a new parameter row
const addParam = () => {
  form.value.params.push({
    param_id: null,
    values: [],
    selectedValues: [],
  });
};

// Remove parameter row
const removeParam = (index) => {
  form.value.params.splice(index, 1);
};

// Currently selected image index
const selectedImageIndex = ref(0);

// Handle file input change
const onFileChange = (e) => {
  const files = Array.from(e.target.files);

  files.forEach((file) => {
    // Limit maximum images to 5
    if (form.value.images.length >= 5) return;

    form.value.images.push({
      file,
      url: URL.createObjectURL(file),
    });
  });

  // Ensure first image is selected
  if (form.value.images.length && selectedImageIndex.value === null) {
    selectedImageIndex.value = 0;
  }

  // Reset input value
  e.target.value = "";
};

// Remove image from list
const removeImage = (index) => {
  form.value.images.splice(index, 1);

  // Adjust selected index if needed
  if (selectedImageIndex.value >= form.value.images.length) {
    selectedImageIndex.value = form.value.images.length - 1;
  }
};

const submit = async () => {
  // Basic validation
  // if (!form.value.name || !form.value.category_id) {
  //   alert("Majburiy maydonlarni to‘ldiring");
  //   return;
  // }

  // Prepare FormData
  const fd = new FormData();

  fd.append("name", JSON.stringify(form.value.name));
  fd.append("description", JSON.stringify(form.value.description));
  fd.append("price", form.value.price || 0);
  fd.append("category_id", form.value.category_id || 0);
  fd.append("discount_percent", form.value.discount_percent || 0);
  fd.append("stock_quantity", form.value.stock_quantity || 0);

  console.log("Selected Params:", form.value.params);
  const selectedParams = form.value.params
    .filter((p) => p.param_id && p.selectedValues.length)
    .map((p) => ({
      param_id: Number(p.param_id),
      value_ids: p.selectedValues,
    }));

  fd.append("params", JSON.stringify(selectedParams));

  // Append images
  form.value.images.forEach((img) => {
    fd.append("images", img.file);
  });

  try {
    // Create product request
    await axios.post("/admin/product/create", fd);

    // Redirect after success
    router.push("/cabinet/admin/products");
  } catch (e) {
    console.error(e);
  }
};

// Fetch all categories
const fetchCategories = async () => {
  try {
    const response = await axios.get("/admin/category/list");
    categories.value = response?.data?.results || [];
  } catch (e) {
    console.error(e);
  }
};

// Fetch category details by ID
const categoryDataGetById = ref([]);
const fetchCategory = async (categoryId) => {
  try {
    const response = await axios.get(`/admin/category/${categoryId}`);
    categoryDataGetById.value = response?.data || {};
  } catch (e) {
    console.error(e);
  }
};

// Fetch all parameters
const parameters = ref([]);
const fetchParameters = async () => {
  try {
    const response = await axios.get("/admin/param/list");
    parameters.value = response?.data?.results || [];
  } catch (e) {
    console.error(e);
  }
};

// Fetch parameter values by parameter ID
const parameterValues = ref([]);
const fetchParameterValues = async (parameterId) => {
  try {
    const response = await axios.get(`/admin/param-value/list/${parameterId}`);
    parameterValues.value = response?.data || [];
  } catch (e) {
    console.error(e);
  }
};

// Watch parameter change (not used correctly for arrays, kept as-is)
watch(
  () => form.value.params.param_id,
  (newVal) => {
    fetchParameterValues(newVal);
  }
);

// Watch category change and load related data
watch(
  () => form.value.category_id,
  (newVal) => {
    fetchCategory(newVal);
  }
);

const onParamChange = async (p, index) => {
  // if (!p.param_id) return;

  // // Check for duplicate parameter selection
  // const isExists = form.value.params.some(
  //   (item, i) => item.param_id === p.param_id && i !== index
  // );

  // if (isExists) {
  //   alert("Bu parametr allaqachon qo‘shilgan");
  //   p.param_id = null;
  //   return;
  // }

  // Fetch parameter values for selected parameter
  try {
    const response = await axios.get(`/admin/param-value/list/${p.param_id}`);

    p.values = response?.data || [];
    p.selectedValues = [];
  } catch (e) {
    console.error(e);
  }
};

// Allow only numeric input for stock quantity
const onStockInput = (e) => {
  const val = e.target.value.replace(/\D/g, "");
  form.stock_quantity = val ? Number(val) : "";
};

onMounted(() => {
  fetchCategories(); // Load categories on page load
  fetchParameters(); // Load parameters
  addParam(); // Initialize first parameter row
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

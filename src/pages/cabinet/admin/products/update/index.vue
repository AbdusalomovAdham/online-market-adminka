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
                :label="`Mahsulot nomi (${activeLang.toLowerCase()})`"
                type="text"
                :placeholder="`Mahsulot nomi (${activeLang.toLowerCase()})`"
                v-model="form.name[activeLang]"
              />
            </div>

            <!-- Product description -->
            <div class="col-24">
              <Textarea
                rows="4"
                :label="`Mahsulot haqida ma'lumot (${activeLang.toLowerCase()})`"
                :placeholder="`Mahsulot haqida ma'lumot (${activeLang.toLowerCase()})`"
                v-model="form.description[activeLang]"
              ></Textarea>
            </div>
          </div>

          <!-- CATEGORY SELECTION -->
          <div class="card">
            <h3>Katigoriya</h3>

            <div class="mb-24">
              <!-- Category select -->
              <Select
                label="Kategoriya tanlang"
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
                  label="Mahsulot narxi"
                  type="number"
                  v-model="form.price"
                  placeholder="Mahsulot narxi"
                  min="0"
                />
              </div>

              <!-- Stock quantity -->
              <div class="col-12">
                <Input
                  label="Ombordagi miqdori"
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
                  label="Chegirma miqdori (%)"
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
                  label="Chegirma turini tanlang"
                  placeholder="Chegirma turini tanlang"
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
              <!-- FALLBACK TO OLD IMAGE -->
              <img v-if="selectImg" :src="selectImg" />

              <!-- EMPTY STATE -->
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
                <!-- OLD IMAGES -->
                <div
                  v-for="(img, i) in form.oldImages"
                  :key="'old-' + i"
                  class="thumb"
                  :class="{
                    active:
                      activeImage.type === 'old' && activeImage.index === i,
                  }"
                  @click="imageReview(img.url, 'old', i)"
                >
                  <img :src="img.url" />
                  <span
                    class="remove"
                    @click.stop="removeOldImage(img.url, i, img.id)"
                    >×</span
                  >
                </div>

                <!-- NEW IMAGES -->
                <div
                  v-for="(img, i) in form.newImages"
                  :key="'new-' + i"
                  class="thumb"
                  @click="imageReview(img, 'new', i)"
                  :class="{
                    active:
                      activeImage.type === 'new' && activeImage.index === i,
                  }"
                >
                  <img :src="img.preview" />
                  <span
                    class="remove"
                    @click.stop="removeNewImage(img.preview, i)"
                    >×</span
                  >
                </div>

                <div
                  v-if="form.oldImages.length + form.newImages.length < 5"
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
        <Button class="btn btn-save" @click="submit">Tahrirlash</Button>
        <Button class="btn" @click="router.back()">Bekor qilish</Button>
      </div>
    </div>
  </div>

  <div class="page-footer"></div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import axios from "@/plugins/axios";
import { useRouter, useRoute } from "vue-router";

// UI components
import MultiSelect from "@/components/g/MultiSelect.vue";
import Select from "@/components/g/Select.vue";
import Button from "@/components/g/Button.vue";
import Input from "@/components/g/Input.vue";
import Textarea from "@/components/g/Textarea.vue";

const route = useRoute();
const router = useRouter();

// Icons
import IconTrash from "@/components/icon/Trash.vue";

// File input reference
const fileInput = ref(null);
const selectImg = ref(null);

const activeImage = ref({
  type: null, // 'old' | 'new'
  index: null,
  src: null,
});

// image review
const imageReview = (img, type, index) => {
  activeImage.value = {
    type,
    index,
    src: type === "new" ? img.preview : img,
  };

  selectImg.value = activeImage.value.src;
};

const removeImages = ref([]);
const removeOldImage = (img, index, id) => {
  removeImages.value.push(id);
  if (selectImg.value === img) {
    selectImg.value = null;
    activeImage.value = {
      type: null,
      index: null,
      src: null,
    };
  }

  form.value.oldImages.splice(index, 1);
};

const removeNewImage = (img, index) => {
  if (selectImg._rawValue === img) {
    alert("asdf");
    selectImg.value = null;
    activeImage.value = {
      type: null,
      index: null,
      src: null,
    };
  }

  form.value.newImages.splice(index, 1);
};

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

  oldImages: [],
  newImages: [],

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
    if (form.value.newImages.length + form.value.oldImages.length >= 5) return;

    form.value.newImages.push({
      file,
      preview: URL.createObjectURL(file),
    });
  });

  e.target.value = "";
};

// Remove image from list
const removeImage = (index) => {
  form.value.images.splice(index, 1);

  // Adjust selected index if needed
  if (selectedImageIndex.value >= form.value?.images.length) {
    selectedImageIndex.value = form.value?.images.length - 1;
  }
};

const submit = async () => {
  const fd = new FormData();

  fd.append("name", JSON.stringify(form.value.name));
  fd.append("description", JSON.stringify(form.value.description));
  fd.append("price", form.value.price || 0);
  fd.append("category_id", form.value.category_id || 0);
  fd.append("discount_percent", form.value.discount_percent || 0);
  fd.append("stock_quantity", form.value.stock_quantity || 0);

  removeImages.value.forEach((id) => {
    fd.append("remove_images", id);
  });

  form.value.newImages.forEach((img) => {
    fd.append("images", img.file);
  });

  try {
    await axios.patch(`/admin/product/update/${route.params.id}`, fd);
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
// watch(
//   () => form.value.params.param_id,
//   (newVal) => {
//     fetchParameterValues(newVal);
//   }
// );

// Watch category change and load related data
watch(
  () => form.value.category_id,
  (newVal) => {
    fetchCategory(newVal);
  }
);

const onParamChange = async (p, index) => {
  if (!p.param_id) return;

  // Check for duplicate parameter selection
  const isExists = form.value.params.some(
    (item, i) => item.param_id === p.param_id && i !== index
  );

  if (isExists) {
    alert("Bu parametr allaqachon qo‘shilgan");
    p.param_id = null;
    return;
  }

  // Fetch parameter values for selected parameter
  try {
    const response = await axios.get(`/admin/param-value/list/${p?.param_id}`);

    p.values = response?.data || [];
    p.selectedValues = [];
  } catch (e) {
    console.error(e);
  }
};

const productGetById = async (id) => {
  try {
    const res = await axios.get(`/admin/product/${id}`);
    const p = res.data;

    form.value = {
      ...form.value,
      name: p.name || { uz: "", ru: "", en: "" },
      description: p.description || { uz: "", ru: "", en: "" },
      price: p.price,
      category_id: p.category_id,
      discount_percent: p.discount_percent,
      stock_quantity: p.stock_quantity,
      discount_type: p.discount_type,

      oldImages: (p.images || []).map((img) => ({
        id: img.id,
        path: img.path,
        url: `http://localhost:8980/${img.path}`,
      })),

      newImages: [],
      params: p.params || [],
    };
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => {
  fetchCategories(); // Load categories on page load
  fetchParameters(); // Load parameters
  addParam(); // Initialize first parameter row
  productGetById(route.params.id);
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

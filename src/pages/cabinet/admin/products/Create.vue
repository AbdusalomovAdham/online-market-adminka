<template>
  <div class="page-header flex gap-12 items-center mb-16">
    <div class="title">
      <h1 class="white">Yangi mahsulot qo'shish</h1>
    </div>
  </div>
  <div class="page-body">
    <div class="add-product">
      <div class="grid">
        <!-- LEFT -->
        <div class="left">
          <!-- Category -->
          <div class="card">
            <h3>Category</h3>

            <Select
              placeholder="Kategoriya tanlang"
              v-model="form.category_id"
              :options="categories"
              option="name"
              value="id"
            />
          </div>

          <!-- General Information -->
          <div class="card">
            <h3>General Information</h3>

            <div class="field">
              <!-- <label>Name Product</label> -->
              <input type="text" placeholder="Mahsulot nomi" />
            </div>

            <div class="field">
              <textarea
                rows="4"
                placeholder="Mahsulot haqida ma'lumot"
              ></textarea>
            </div>

            <div class="param-values">
              <div class="rows gap-24 mb-24" v-for="item in paramCount">
                <div class="col-12">
                  <Select
                    placeholder="Parametrni tanlang "
                    label="Parametrni tanlang"
                  />
                </div>

                <div class="col-12">
                  <MultiSelect
                    placeholder="Parametrni tanlang "
                    label="Qiymatni tanlang"
                  />
                </div>
              </div>
              <Button
                class="btn flex center w-100p white"
                style="
                  background: linear-gradient(180deg, #4ba0f3 0%, #197cdc 100%);
                "
                @click="addParam"
                >Qiymat qo'shish</Button
              >
            </div>
          </div>

          <!-- Pricing -->
          <div class="card">
            <h3>Pricing And Stock</h3>

            <div class="row">
              <div class="field">
                <label>Mahsulot narxi</label>
                <input type="text" value="" placeholder="Mahsulot narxi" />
              </div>

              <div class="field">
                <label>Ombordagi soni</label>
                <input type="number" placeholder="Ombordagi soni" />
              </div>
            </div>

            <div class="row">
              <div class="field">
                <label>Chegirma</label>
                <input type="text" placeholder="Chegirma" />
              </div>

              <div class="field">
                <label>Chegirma turi</label>
                <select>
                  <option>Yangi yil chegirmasi</option>
                  <option>Yil chegirmasi</option>
                  <option>Bayram chegirmasi</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="right">
          <!-- Upload -->
          <div class="card">
            <h3>Upload Img</h3>

            <!-- Agar category tanlanmagan bo‘lsa -->
            <div class="upload-disabled">
              <img
                v-if="form.images.length"
                :src="form.images[selectedImageIndex].url"
              />
              <p v-else>Avval kategoriya tanlang</p>
            </div>

            <!-- Agar category tanlangan bo‘lsa -->
            <div>
              <div class="upload-main" @click="openFile">
                <!-- <span v-else>Click to upload</span> -->
              </div>

              <!-- Bitta file input -->
              <input
                type="file"
                ref="fileInput"
                hidden
                multiple
                accept="image/*"
                @change="onFileChange"
              />

              <input
                type="file"
                ref="fileInput"
                hidden
                multiple
                @change="onFileChange"
              />

              <input
                ref="file"
                type="file"
                multiple
                accept="image/*"
                hidden
                @change="handleFileChange"
              />

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
      <div class="actions-footer">
        <button class="btn-save" @click="submit">Qo'shish</button>
        <button class="btn-cancel" @click="router.back()">Bekor qilish</button>
      </div>
    </div>
  </div>
  <div class="page-footer"></div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from "vue";
import axios from "@/plugins/axios";
import router from "@/router";
import MultiSelect from "@/components/g/MultiSelect.vue";
import Select from "@/components/g/Select.vue";
import Button from "@/components/g/Button.vue";

const fileInput = ref(null);
const categories = ref([]);
const paramCount = ref(1);

const addParam = () => {
  paramCount.value++;
};

const openFile = () => {
  fileInput.value?.click();
};

// create form
const form = ref({
  name: "",
  price: "",
  description: "",
  category_id: null,
  discount_percent: "",
  stock_quantity: "",
  images: [],
});

const selectedImageIndex = ref(0);

// file change
const onFileChange = (e) => {
  const files = Array.from(e.target.files);

  files.forEach((file) => {
    if (form.value.images.length >= 5) return;

    form.value.images.push({
      file,
      url: URL.createObjectURL(file),
    });
  });

  if (form.value.images.length && selectedImageIndex.value === null) {
    selectedImageIndex.value = 0;
  }

  e.target.value = "";
};

// remove image
const removeImage = (index) => {
  form.value.images.splice(index, 1);

  if (selectedImageIndex.value >= form.value.images.length) {
    selectedImageIndex.value = form.value.images.length - 1;
  }
};

const submit = async () => {
  if (!form.value.name || !form.value.category_id) {
    alert("Majburiy maydonlarni to‘ldiring");
    return;
  }

  const fd = new FormData();

  fd.append("name", form.value.name);
  fd.append("price", form.value.price);
  fd.append("description", form.value.description);
  fd.append("category_id", form.value.category_id);
  fd.append("discount_percent", form.value.discount_percent || 0);
  fd.append("stock_quantity", form.value.stock_quantity || 0);

  form.value.images.forEach((img) => {
    fd.append("images", img.file);
  });

  try {
    await axios.post("/admin/product/create", fd);
    router.push("/cabinet/admin/products");
  } catch (e) {
    console.error(e);
  }
};

// fetch category list
const fetchCategories = async () => {
  try {
    const response = await axios.get("/admin/category/list");
    categories.value = response?.data?.results || [];
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

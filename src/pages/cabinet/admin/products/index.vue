<template>
  <div class="page-header flex gap-12 items-center mb-16">
    <div class="title">
      <Button
        @click="router.push('/cabinet/admin/products/create')"
        class="transparent w-40 h-40 flex pa-0 center"
      >
        <icon-plus></icon-plus>
      </Button>
      <h1 class="white">Mahsulotlar</h1>
    </div>
    <Search @filter="onSearch" v-model="filter.search"></Search>
  </div>
  <div class="page-body">
    <div class="table">
      <ProductTable
        :products="results"
        :loading="loading"
        :totalRows="count"
        @update-status="toggleStatus"
        @refetch="refetch"
        @delete-product="deleteProduct"
        @change-server="changeServer"
      />
    </div>
  </div>
  <!-- <div class="page-footer"></div> -->
  <CreateModal
    v-if="createModal"
    @cancel="createModal = false"
    @created="refetch"
  ></CreateModal>
  <UpdateModal
    v-if="updateModal"
    :id="selectedId"
    @cancel="updateModal = false"
    @updated="refetch"
  ></UpdateModal>
</template>

<script setup>
import Button from "@/components/g/Button";
import IconPencil from "@/components/icon/Pencil";
import IconTrash from "@/components/icon/Trash";
import IconPlus from "@/components/icon/Plus";
import GPagination from "@/components/g/Pagination";
import CreateModal from "@/components/modal/admin/program-category/Create.vue";
import UpdateModal from "@/components/modal/admin/program-category/Update.vue";
import Search from "@/components/g/Search";
import ProductTable from "@/components/g/ProductTable.vue";
import Switch from "@/components/g/Switch.vue";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import api from "@/plugins/axios";

const router = useRouter();
const filter = ref({
  limit: 15,
  page: 1,
  order: "id+desc",
  search: null,
});
const count = ref(0);
const loading = ref(true);
const results = ref([]);
const showFilter = ref(false);
const createModal = ref(false);
const updateModal = ref(false);
const selectedId = ref(null);

const selectProduct = (id) => {
  selectedId.value = id;
  updateModal.value = true;
};

const toggleStatus = async (data) => {
  const fd = new FormData();
  fd.append("status", data.status);
  try {
    await api.patch(`/admin/product/update/${data.id}`, fd);
    await refetch();
  } catch (e) {
    console.error(e);
  }
};

onMounted(async () => {
  try {
    await fetchList({ params: { ...params.value } });
  } catch (e) {
    console.error(e);
  }
});

const onSearch = async () => {
  filter.value.page = 1;
  await refetch();
};

const params = computed(() => {
  let param = {};

  Object.keys(filter.value).forEach((k) => {
    filter.value[k] && (param[k] = filter.value[k]);
  });

  param["offset"] = (param.page - 1) * param.limit;

  return param;
});

const changeServer = async (data) => {
  if (data.page) filter.value.page = data.page;
  if (data.limit) filter.value.limit = data.limit;
  if (data.order) filter.value.order = data.order;
  await refetch();
};

const fetchList = async ({ params } = {}) => {
  loading.value = true;
  try {
    const response = await api.get("/admin/products", {
      params,
    });
    count.value = response?.data?.count;
    results.value = response?.data?.results;
  } catch (e) {
    console.error(e);
  }

  loading.value = false;
};

const deleteProduct = async (id) => {
  try {
    await api.delete(`/admin/product/delete/${id}`);
    await refetch();
  } catch (e) {
    console.error(e);
  }
};

const refetch = async () => {
  await fetchList({ params: { ...params.value } });
  createModal.value = false;
  updateModal.value = false;
  selectedId.value = null;
};

watch(
  () => params.value,
  async () => {
    await fetchList({ params: { ...params.value } });
  }
);

const nextPage = async () => {
  filter.value.page++;
};

const prevPage = async () => {
  filter.value.page--;
};
</script>

<style scoped>
.product-head-title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* Table style */
.table {
  height: 100%;
}

.table :deep(.bh-table-responsive) {
  background-color: #fff !important;
  flex: 1;
}

.table :deep(.bh-pagination .bh-page-item.bh-active) {
  border: none;
  background-color: #007bff;
}

.table :deep(.bh-pagination) {
  border: none;
  background: #ffffff1a;
  border-radius: 8px;
  padding: 16px;
  margin-top: 18px;
}

.table :deep(.bh-pagination-info) {
  color: white;
  font-size: 16px;
}

.table > div:first-child {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table :deep(tbody tr td:nth-child(3)) {
  min-width: 180px;
}
</style>

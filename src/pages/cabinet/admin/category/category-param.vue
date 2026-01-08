<template>
  <div class="page-header flex gap-12 items-center mb-16">
    <div class="title">
      <Button
        @click="showModal = true"
        class="transparent w-40 h-40 flex pa-0 center"
      >
        <icon-plus></icon-plus>
      </Button>
      <h1 class="white">Katigoriya parametrlari</h1>
    </div>
    <Search @filter="onSearch" v-model="filter.search"></Search>
  </div>
  <div class="page-body">
    <div class="table">
      <Table
        :loading="loading"
        :totalRows="count"
        :cols="cols"
        :rows="results"
        :hasCheckbox="false"
        @update-status="toggleStatus"
        @update="update"
        @refetch="refetch"
        @delete="deleteItem"
        @change-server="changeServer"
      />
    </div>
  </div>
  <!-- <div class="page-footer"></div> -->
  <CreateModal
    v-if="showModal"
    @cancel="showModal = false"
    @created="created"
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
import CreateModal from "@/components/modal/admin/category/category-param/Create.vue";
import UpdateModal from "@/components/modal/admin/category/category-param/Update.vue";
import IconPlus from "@/components/icon/Plus";
import Search from "@/components/g/Search";
import Table from "@/components/g/Table.vue";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import api from "@/plugins/axios";

const showModal = ref(false);
const filter = ref({
  limit: 10,
  page: 1,
  order: "id+desc",
  search: null,
});

const count = ref(0);
const loading = ref(true);
const results = ref([]);
const createModal = ref(false);
const updateModal = ref(false);
const selectedId = ref(null);

const created = async () => {
  await refetch();
  showModal.value = false;
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

const refetch = async () => {
  await fetchList({ params: { ...params.value } });
  createModal.value = false;
  updateModal.value = false;
  selectedId.value = null;
};

const update = async (id) => {
  updateModal.value = true;
  selectedId.value = id;
};

watch(
  () => params.value,
  async () => {
    await fetchList({ params: { ...params.value } });
  }
);

// Table params
const cols = [
  { field: "__index", title: "T/r", sort: false },
  { field: "param_name", title: "Parametr nomi", sort: false },
  // { field: "category_name", title: "Katigoriya nomi", sort: false },
  { field: "type", title: "Parametr turi", sort: false },
  { field: "status", title: "Parametr holati", sort: false },
  { field: "id", title: "", sort: false, search: false },
];

// API actions
// get category list
const fetchList = async ({ params } = {}) => {
  loading.value = true;
  try {
    const response = await api.get("/admin/param/list", {
      params,
    });
    count.value = response?.data?.count;
    results.value = response?.data?.results;
  } catch (e) {
    console.error(e);
  }

  loading.value = false;
};

// DELETE
const deleteItem = async (id) => {
  if (!confirm("O'chirishni xoxlaysizmi?")) return;

  try {
    await api.delete(`/admin/param/delete/${id}`);
    await refetch();
  } catch (e) {
    console.error(e);
  }
};

// UPDATE STATUS
const toggleStatus = async (data) => {
  try {
    await api.patch(`/admin/category/${data.id}`, {
      status: data.status,
    });
    await refetch();
  } catch (e) {
    console.error(e);
  }
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

.table :deep(tbody tr td:nth-child(1)) {
  width: 40px;
}

.table :deep(tbody tr td:last-child) {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>

<template>
  <div class="page-header flex gap-12 items-center mb-16">
    <div class="title">
      <Button
        @click="router.push('/cabinet/admin/products/create')"
        class="transparent w-40 h-40 flex pa-0 center"
      >
        <icon-plus></icon-plus>
      </Button>
      <h1 class="white">Istaklar ro'yxati</h1>
    </div>
    <Search @filter="showFilter = !showFilter" v-model="filter.search"></Search>
    <g-pagination
      v-model="filter.page"
      :limit="filter.limit"
      :page="filter.page"
      :count="count"
      @next="nextPage"
      @prev="prevPage"
    ></g-pagination>
  </div>
  <div class="page-filter" :class="[showFilter && 'active']">
    <div class="page-filter-wrapper">
      <div class="flex gap-16"></div>
    </div>
  </div>
  <div class="page-body">
    <div class="table">
      <table>
        <tr>
          <th class="w-64 t-center">T/r</th>
          <th>Xaridor</th>
          <th>Status</th>
          <!-- <th>Sotilganlar soni</th> -->
          <th class="w-110"></th>
        </tr>
        <tr v-for="(u, idx) in results" :key="u?.id">
          <td class="t-center">
            {{ (filter.page - 1) * filter.limit + idx + 1 }}
          </td>
          <td>
            {{ u?.customer_id }}
          </td>
          <td>
            <Switch
              :model-value="u.status !== false"
              :leftIcon="IconLock"
              :rightIcon="IconUnlock"
              @change="(val) => toggleStatus(val, u?.id)"
            />
          </td>

          <td class="flex items-center gap-8">
            <Button @click="selectProduct(u?.id)" class="blue">
              <icon-pencil></icon-pencil>
            </Button>
            <Button class="red" @click="deleteProduct(u?.id)">
              <icon-trash></icon-trash>
            </Button>
          </td>
        </tr>
      </table>
    </div>
  </div>
  <div class="page-footer"></div>
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
import Switch from "@/components/g/Switch.vue";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import api from "@/plugins/axios";

const router = useRouter();
const filter = ref({
  limit: 15,
  page: 1,
  search: null,
});
const count = ref(0);
const results = ref([]);
const showFilter = ref(false);
const createModal = ref(false);
const updateModal = ref(false);
const selectedId = ref(null);

const selectProduct = (id) => {
  selectedId.value = id;
  updateModal.value = true;
};

const toggleStatus = async (val, id) => {
  let status = val ? false : true;
  const fd = new FormData();
  fd.append("status", status);
  try {
    await api.patch(`/admin/product/update/${id}`, fd);
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

const params = computed(() => {
  let param = {};

  Object.keys(filter.value).forEach((k) => {
    filter.value[k] && (param[k] = filter.value[k]);
  });

  param["offset"] = (param.page - 1) * param.limit;

  return param;
});

const fetchList = async ({ params }) => {
  try {
    const response = await api.get("/admin/wishlist", {
      params,
    });
    count.value = response?.count;
    results.value = response?.data;
  } catch (e) {
    console.error(e);
  }
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

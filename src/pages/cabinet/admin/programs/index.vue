<template>
  <div class="page-header flex gap-12 items-center mb-16">
    <div class="title">
      <Button
        @click="createModal = true"
        class="transparent w-40 h-40 flex pa-0 center"
      >
        <icon-plus></icon-plus>
      </Button>
      <h1 class="white">Ilovalar</h1>
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
    <Tab :tabs="tabs" v-model="selectedTab"></Tab>
    <div v-if="selectedTab == 1" class="table mt-24">
      <table>
        <tr>
          <th class="w-64 t-center">T/r</th>
          <th>Ilova nomi</th>
          <th>Kategoriya</th>
          <th>Key</th>
          <th class="w-110"></th>
        </tr>
        <tr v-for="(u, idx) in results" :key="u?.id">
          <td class="t-center">
            {{ (filter.page - 1) * filter.limit + idx + 1 }}
          </td>
          <td>
            {{ u?.name }}
          </td>
          <td>
            {{ u?.category }}
          </td>
          <td>
            {{ u?.key }}
          </td>
          <td class="flex items-center gap-8">
            <Button @click="selectDevice(u?.id)" class="blue">
              <icon-pencil></icon-pencil>
            </Button>
            <Button class="red">
              <icon-trash></icon-trash>
            </Button>
          </td>
        </tr>
      </table>
    </div>
    <div v-if="selectedTab == 2" class="table mt-24">
      <table>
        <tr>
          <th class="w-64 t-center">T/r</th>
          <th>Ilova nomi</th>
          <th>Foydalanilgan vaqt</th>
          <th class="w-210"></th>
        </tr>
        <tr v-for="(u, idx) in activePrograms" :key="u?.id">
          <td class="t-center">
            {{ (filter.page - 1) * filter.limit + idx + 1 }}
          </td>
          <td>
            {{ u?.activeProgram }}
          </td>
          <td>
            {{ formatTime(u?.count * 5) }}
          </td>
          <td class="flex items-center gap-8"></td>
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
import Tab from "@/components/g/Tab";
import IconPencil from "@/components/icon/Pencil";
import IconTrash from "@/components/icon/Trash";
import IconPlus from "@/components/icon/Plus";
import IconCopy from "@/components/icon/Copy";
import IconDownload from "@/components/icon/CloudArrowDown";
import IconPulse from "@/components/icon/Pulse";
import GPagination from "@/components/g/Pagination";
import GSwitch from "@/components/g/Switch";
import CreateModal from "@/components/modal/admin/program/Create.vue";
import UpdateModal from "@/components/modal/admin/program/Update.vue";
import Search from "@/components/g/Search";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios";

const filter = ref({
  limit: 15,
  page: 1,
  search: null,
});
const count = ref(0);
const results = ref([]);
const router = useRouter();
const showFilter = ref(false);
const createModal = ref(false);
const updateModal = ref(false);
const selectedId = ref(null);
const downloading = ref(false);
const activePrograms = ref([]);
const tabs = ref([
  {
    id: 1,
    name: "Ilovalar",
  },
  {
    id: 2,
    name: "Barcha ilovalar",
  },
]);
const selectedTab = ref(1);

const selectDevice = (id) => {
  selectedId.value = id;
  updateModal.value = true;
};

onMounted(async () => {
  try {
    await fetchList({ params: { ...params.value } });
    await fetchActivePrograms({ params: {} });
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
    const response = await axios.get("/admin/program/list", { params });
    count.value = response?.data?.count;
    results.value = response?.data?.results;
  } catch (e) {
    console.error(e);
  }
};

const fetchActivePrograms = async ({ params }) => {
  try {
    const response = await axios.get(
      "/admin/device-activity/active-program/statistics",
      { params }
    );
    activePrograms.value = response || [];
  } catch (e) {
    console.error(e);
  }
};

const updateStatus = async (id, status) => {
  try {
    await axios.patch(`/admin/device/${id}`, { status });
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

const copyUid = (uid) => {
  navigator.clipboard.writeText(uid);
  alert(`Nusxa ko'chirildi!\nMaxsus kod: ${uid}`);
};

const downloadApp = async (deviceUID) => {
  if (!deviceUID) {
    alert("Ilova topilmadi!");
    return;
  }
  if (downloading.value) {
    alert("Yuklab olish davom etmoqda!");
    return;
  }
  try {
    downloading.value = true;
    const response = await axios.post(
      "/employee/download/program",
      { deviceUID },
      {
        responseType: "blob", // important for binary files
      }
    );

    // Create blob URL
    const url = window.URL.createObjectURL(new Blob([response]));

    // Create temp link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "app.zip"); // file name
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Download failed:", e);
    alert("Download failed", e);
  }

  downloading.value = false;
};

const nextPage = async () => {
  filter.value.page++;
};

const prevPage = async () => {
  filter.value.page--;
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = [];
  if (hours > 0) result.push(`${hours} soat`);
  if (minutes > 0) result.push(`${minutes} minut`);

  return result.length > 0 ? result.join(" ") : "0 minut";
};
</script>

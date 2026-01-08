<template>
  <div class="page-header flex gap-12 items-center mb-16">
    <div class="title">
      <h1 class="white">Qurilma aktivlik tarixi</h1>
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
          <th>Sana</th>
          <th>Ish vaqti</th>
          <th class="w-56"></th>
        </tr>
        <tr v-for="(u, idx) in results" :key="u?.id">
          <td class="t-center">
            {{ (filter.page - 1) * filter.limit + idx + 1 }}
          </td>
          <td>
            {{ u?.date }}
          </td>
          <td>
            {{ formatTime(u?.screenshotCount * 5) }}
          </td>
          <td class="flex items-center gap-8">
            <Button @click="selectDevice(u?.date, u?.deviceUID)" class="blue">
              <icon-file-video></icon-file-video>
            </Button>
          </td>
        </tr>
      </table>
    </div>
  </div>
  <div class="page-footer"></div>
  <FrameVideo
    v-if="frameVideoModal"
    :date="selectedDate"
    :deviceId="route.params.id"
    :deviceUID="selectedDeviceUID"
    @cancel="frameVideoModal = false"
  ></FrameVideo>
</template>

<script setup>
import Button from "@/components/g/Button";
import IconFileVideo from "@/components/icon/FileVideo";
import GPagination from "@/components/g/Pagination";
import GSwitch from "@/components/g/Switch";
import FrameVideo from "@/components/modal/admin/device-activity/FrameVideo.vue";
import Search from "@/components/g/Search";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "@/plugins/axios";

const route = useRoute();
const filter = ref({
  limit: 15,
  page: 1,
  search: null,
  deviceId: route.params.id,
});
const count = ref(0);
const results = ref([]);
const router = useRouter();
const showFilter = ref(false);
const selectedDate = ref(null);
const frameVideoModal = ref(false);
const selectedDeviceUID = ref(null);

const selectDevice = (date, deviceUID) => {
  selectedDate.value = date;
  selectedDeviceUID.value = deviceUID;
  frameVideoModal.value = true;
};

onMounted(async () => {
  try {
    await fetchList({ params: { ...params.value } });
  } catch (e) {
    console.error(e);
  }
});

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

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
    const response = await axios.get("/admin/device-activity/list/by-date", {
      params,
    });
    count.value = response?.count;
    results.value = response?.results;
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
  frameVideoModal.value = false;
  selectedDate.value = null;
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

const nextPage = async () => {
  filter.value.page++;
};

const prevPage = async () => {
  filter.value.page--;
};
</script>

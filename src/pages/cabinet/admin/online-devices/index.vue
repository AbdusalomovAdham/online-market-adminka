<template>
  <div class="page-header flex gap-12 items-center mb-16">
    <div class="title">
      <h1 class="white">Onlayn qurilmalar</h1>
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
  <div class="page-body">
    <div class="rows gap-24">
      <div v-for="d in devices" :key="d.id" class="col-8">
        <Device
          :user="d.user"
          :duration="d.duration"
          :screen="d.screenshot"
          :name="d.name"
        ></Device>
      </div>
    </div>
  </div>
  <div class="page-footer"></div>
</template>

<script setup>
import GPagination from "@/components/g/Pagination";
import Search from "@/components/g/Search";
import Device from "@/components/g/Device";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios";

const filter = ref({
  limit: 15,
  page: 1,
  search: null,
});
const router = useRouter();
const showFilter = ref(false);
const devices = ref([]);
const count = ref(0);
const params = computed(() => {
  let param = {};

  Object.keys(filter.value).forEach((k) => {
    filter.value[k] && (param[k] = filter.value[k]);
  });

  param["offset"] = (param.page - 1) * param.limit;

  return param;
});

const fetchData = async () => {
  try {
    const response = await axios.get("/admin/online/device/list", {
      params: params.value,
    });
    console.log(response);
    devices.value = response;
  } catch (error) {
    console.error(error);
  }
};

const nextPage = async () => {
  filter.value.page++;
};

const prevPage = async () => {
  filter.value.page--;
};

onMounted(async () => {
  await fetchData();
  setInterval(async () => {
    await fetchData();
  }, 5000);
});
</script>

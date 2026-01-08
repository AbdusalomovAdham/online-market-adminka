<template>
  <div class="page-header flex gap-12 items-center mb-16">
    <div class="title">
      <Button
        @click="router.push('/cabinet/admin/users/create')"
        class="transparent w-40 h-40 flex pa-0 center"
      >
        <icon-plus></icon-plus>
      </Button>
      <h1 class="white">Foydalanuvchilar</h1>
    </div>
    <Search @filter="showFilter = !showFilter" v-model="filter.search"></Search>
    <g-pagination
      v-model="filter.page"
      :limit="filter.limit"
      :page="filter.page"
      :count="userStore.count"
      @next="nextPage"
      @prev="prevPage"
    ></g-pagination>
  </div>
  <div class="page-filter" :class="[showFilter && 'active']">
    <div class="page-filter-wrapper">
      <div class="flex gap-16">
        <div class="col-7">
          <Select
            placeholder="Rol"
            v-model="filter.role"
            :options="roleList"
            option="name"
            value="uid"
          ></Select>
        </div>
      </div>
    </div>
  </div>
  <div class="page-body">
    <div class="table">
      <table>
        <tr>
          <th class="w-64 t-center">T/r</th>
          <th>F.I.O</th>
          <th>Rol</th>
          <th>Telefon raqami</th>
          <th class="w-110"></th>
        </tr>
        <tr v-for="(u, idx) in userStore.results" :key="u?.id">
          <td class="t-center">
            {{ (filter.page - 1) * filter.limit + idx + 1 }}
          </td>
          <td>
            {{ u?.first_name }}
            {{ u?.last_name }}
          </td>
          <td>
            {{ u.role }}
          </td>
          <td>
            {{ u?.phone_number }}
          </td>
          <td class="flex items-center gap-8">
            <Button
              @click="router.push(`/cabinet/admin/users/update/${u?.id}`)"
              class="blue"
            >
              <icon-pencil></icon-pencil>
            </Button>
            <Button class="red" @click="deleteUser(u.id)">
              <icon-trash></icon-trash>
            </Button>
          </td>
        </tr>
      </table>
    </div>
  </div>
  <div class="page-footer"></div>
</template>

<script setup>
import Button from "@/components/g/Button";
import IconPencil from "@/components/icon/Pencil";
import Select from "@/components/g/Select";
import IconTrash from "@/components/icon/Trash";
import IconPlus from "@/components/icon/Plus";
import GPagination from "@/components/g/Pagination";
import Search from "@/components/g/Search";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAdminUserStore } from "@/store/admin/users";
import api from "@/plugins/axios";

const filter = ref({
  limit: 15,
  page: 1,
  search: null,
  role: null,
});
const router = useRouter();
const showFilter = ref(false);
const userStore = useAdminUserStore();
const roleList = ref([
  {
    uid: "ADMIN",
    name: "Admin",
  },
  {
    uid: "EMPLOYEE",
    name: "Xodim",
  },
]);

const roles = ref({
  ADMIN: "Admin",
  EMPLOYEE: "Xodim",
});

onMounted(async () => {
  try {
    await userStore.fetchList({ params: { ...params.value } });
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

watch(
  () => params.value,
  async () => {
    await userStore.fetchList({ params: { ...params.value } });
  }
);

const nextPage = async () => {
  filter.value.page++;
};

const prevPage = async () => {
  filter.value.page--;
};

const deleteUser = async (userId) => {
  try {
    await api.delete(`/admin/user/delete/${userId}`);
    await userStore.fetchList({ params: { ...params.value } });
  } catch (e) {
    console.error(e);
  }
};
</script>

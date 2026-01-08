import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/plugins/axios";

export const useMain = defineStore("main", () => {
  const breadcrumbs = ref([]);

  const setBreadcrumbs = (v) => {
    breadcrumbs.value = v;
  };

  return {
    breadcrumbs,
    setBreadcrumbs,
  };
});

import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/plugins/axios";

export const useAdminUserStore = defineStore("admin-users", () => {
  const results = ref([]);
  const count = ref(0);
  const all = ref([]);

  const fetchAll = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api.get("/admin/user/list");
        if (res?.data) {
          all.value = res?.data;
        }
        resolve(res?.data);
      } catch (e) {
        reject(e);
      }
    });
  };

  const fetchList = ({ params }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api.get("/admin/user/list", { params });
        if (res?.data) {
          results.value = res?.data;
          count.value = res?.count;
        }
        resolve(res?.data?.results);
      } catch (e) {
        reject(e);
      }
    });
  };

  const fetchDetail = (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api.get(`/admin/user/${id}`);
        resolve(res?.data);
      } catch (e) {
        reject(e);
      }
    });
  };

  const create = (req) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api.post("/admin/user/create", req);
        resolve(res?.data);
      } catch (e) {
        reject(e);
      }
    });
  };

  const update = (req, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api.patch(`/admin/user/${userId}`, req);
        resolve(res?.data);
      } catch (e) {
        reject(e);
      }
    });
  };

  const updatePassword = (passsword, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api.patch(`/admin/user/${userId}`, passsword);
        resolve(res?.data);
      } catch (e) {
        reject(e);
      }
    });
  };

  const deleteById = async (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api.delete(`/admin/user/${id}`);
        resolve(res?.data);
      } catch (e) {
        reject(e);
      }
    });
  };

  return {
    results,
    all,
    count,

    fetchAll,
    fetchList,
    fetchDetail,
    create,
    update,
    updatePassword,
    deleteById,
  };
});

import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/plugins/axios";

export const useAuthSignIn = defineStore("auth-sign-in", () => {
  const me = ref({});

  const SignIn = ({ login, password }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await api.post("/admin/auth/sign-in", { login, password });
        const { token, message } = res || {};

        localStorage.setItem("token", token);
        // localStorage.setItem("role", user?.role);
        // localStorage.setItem("me", JSON.stringify({ ...user }));
        // me.value = user;
        resolve(message);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  };

  const setMe = () => {
    me.value =
      (localStorage.getItem("me") && JSON.parse(localStorage.getItem("me"))) ||
      {};
  };

  return {
    me,
    setMe,
    SignIn,
  };
});

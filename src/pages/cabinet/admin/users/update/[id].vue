<template>
  <div class="page-header flex gap-12 items-center mb-16">
    <div class="title">
      <h1 class="white">Foydalanuvchi ma'lumotlarini tahrirlash</h1>
    </div>
  </div>
  <div class="page-body bg-white pa-24 radius-12">
    <div class="flex gap-24 mb-24">
      <div class="col-7">
        <Select
          required
          label="Rol"
          placeholder="Rol tanlang"
          v-model="form.role"
          :options="roleList"
          option="name"
          value="id"
        ></Select>
      </div>
      <div class="col-7">
        <Input
          :required="!!validation['first_name']"
          v-model="form.first_name"
          label="Ismi"
          placeholder="Ism kiriting"
        >
        </Input>
      </div>
      <div class="col-7">
        <Input
          :required="!!validation['first_name']"
          v-model="form.last_name"
          label="Familyasi"
          placeholder="Familyan kiriting"
        >
        </Input>
      </div>
      <div class="col-7">
        <InputMask
          :required="!!validation['phone_number']"
          v-model="form.phone_number"
          label="Telefon raqami"
          placeholder="+998 "
        ></InputMask>
      </div>
      <div class="col-7">
        <Input
          :required="!!validation['login']"
          v-model="form.login"
          label="Foydalanuvchi nomi"
          placeholder="Foydalanuvchi nomini kiriting"
        >
        </Input>
      </div>
      <div class="col-7">
        <Input
          :required="!!validation['password']"
          v-model="password"
          label="Parol"
          type="password"
          after-icon="eye"
          placeholder="Parolni kiriting"
          btn="update"
          @btnClick="updatePassword"
        >
        </Input>
      </div>
      <div class="col-7">
        <Input
          :required="!!validation['email']"
          v-model="form.email"
          label="Email"
          type="email"
          placeholder="Email kiriting"
        >
        </Input>
      </div>
    </div>
    <div class="flex gap-8 content-end">
      <Button @click="update" class="main px-24">Saqlash</Button>
      <Button @click="router.push('/cabinet/admin/users')">Bekor qilish</Button>
    </div>
  </div>
</template>

<script setup>
import Button from "@/components/g/Button";
import Input from "@/components/g/Input";
import InputMask from "@/components/g/InputMask";
import Select from "@/components/g/Select";
import { onMounted, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useAdminUserStore } from "@/store/admin/users";
import api from "@/plugins/axios";

const userStore = useAdminUserStore();

const roleList = ref([]);
const requiredFields = ref({
  ADMIN: {
    role: {
      title: "Rol",
    },
    login: {
      title: "Foydalanuvchi nomi",
    },
    first_name: {
      title: "F.I.O",
    },
    phone_number: {
      title: "Telefon raqami",
    },
  },
});
const router = useRouter();
const route = useRoute();
const form = ref({
  id: null,
  username: null,
  role: null,
  first_name: null,
  phone_number: "+998 ",
  email: null,
});

const updating = ref(false);
const password = ref("");
const userId = ref(null);
onMounted(async () => {
  try {
    form.value = await userStore.fetchDetail(route.params.id);
    userId.value = form.value.id;
  } catch (e) {
    console.error(e);
  }

  await roleFetchList();
});

const validation = computed(() => {
  if (form.value.role) {
    return requiredFields.value["ADMIN"];
  }

  return {
    role: {
      title: "Rol",
    },
  };
});

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const update = async () => {
  const notValidated = validate();
  if (notValidated) {
    alert(`To'ldirishi kerak bo'lgan maydonlar: \n${notValidated}`);
    return;
  }

  if (updating.value) {
    alert("Ma'lumotlar yuklanmoqda. Iltimos kuting!");
    return;
  }

  Object.keys(form.value).forEach((k) => {
    form.value[k] = k.includes("_id")
      ? form.value[k]
        ? +form.value[k]
        : null
      : form.value[k];
  });

  updating.value = true;
  form.value.role = Number(form.value.role);

  const fd = new FormData();

  Object.keys(form.value).forEach((k) => {
    let value = form.value[k];

    if (k.includes("_id") && value) {
      value = Number(value);
    }

    if (value !== null && value !== undefined) {
      fd.append(k, value);
    }
  });

  try {
    await userStore.update(fd, userId.value);
    router.push("/cabinet/admin/users");
  } catch (e) {
    alert(e);
    console.error(e);
  }

  updating.value = false;
};

const updatePassword = async () => {
  if (!password.value) {
    alert("Iltimos parolni kiriting!");
    return;
  }

  updating.value = true;

  const fd = new FormData();
  fd.append("password", password.value);
  try {
    await userStore.updatePassword(fd, userId.value);
    alert("Parol muvoffaqiyatli yangilandi!");
  } catch (e) {
    alert(e);
    console.error(e);
  }

  updating.value = false;
};

const validate = () => {
  let notValidated = [];
  Object.keys(form.value).forEach((k) => {
    !!validation.value[k] &&
      !form.value[k] &&
      notValidated.push(`- ${validation.value[k].title}`);
  });

  if (form.value.email && !isValidEmail(form.value.email)) {
    return `Notog'ri email kiritilgan!`;
  }

  return (notValidated?.length && notValidated.join("\n")) || null;
};

const roleFetchList = async () => {
  try {
    const res = await api.get("/admin/role/list");
    const { data } = res || [];
    roleList.value = data;
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <div class="sign-in">
    <div class="sign-in-wrapper">
      <form @submit.prevent="signIn" action="submit" autocomplete="off">
        <h1>Kirish</h1>
        <span>Bo‘sh maydonlarni to‘ldiring</span>
        <Input
          label="Login"
          v-model="form.login"
          class="big mb-32"
          placeholder="Loginingizni kiriting"
        ></Input>
        <Input
          label="Parol"
          v-model="form.password"
          class="big mb-32"
          placeholder="Parolingizni kiriting"
          after-icon="eye"
          type="password"
        ></Input>
        <Button type="submit" class="big">Kirish</Button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Input from "@/components/g/Input";
import Button from "@/components/g/Button";
import { useAuthSignIn } from "@/store/auth/sign-in";
import { useRouter } from "vue-router";

const form = ref({
  login: null,
  password: null,
});

const router = useRouter();
const signInStore = useAuthSignIn();

const signIn = async () => {
  try {
    await signInStore.SignIn({ ...form.value });
    await router.push("/cabinet/admin/users");
  } catch (e) {
    alert(
      `Foydalanuvchi topilmadi. Iltimos login va parolni tekshirib qayta kiriting! \nAgar tizimga kira olmayotgan bo'lsangiz tizim adminlariga murojaat qilishingizni so'raymiz!`
    );
    console.error(e);
  }
};

onMounted(() => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("me");
});
</script>

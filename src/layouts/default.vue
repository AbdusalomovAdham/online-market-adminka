<template>
  <div class="default">
    <div class="default-wrapper">
      <Sidebar></Sidebar>
      <div class="default-main">
        <Header></Header>
        <div class="default-pages">
          <router-view />
        </div>
      </div>
      <RightBar></RightBar>
    </div>
  </div>
</template>
<script setup>
import Sidebar from "@/components/layouts/default/Sidebar";
import RightBar from "@/components/layouts/default/RightBar";
import Header from "@/components/layouts/default/Header";

import { onMounted } from "vue";
import { useAuthSignIn } from "@/store/auth/sign-in";

const authStore = useAuthSignIn();

onMounted(() => {
  authStore.setMe();
});
</script>

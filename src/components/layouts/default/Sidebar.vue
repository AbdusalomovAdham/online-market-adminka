<template>
  <div class="sidebar">
    <div class="sidebar-wrapper pa-20">
      <div class="sidebar-top">
        <!-- <div class="logo"></div> -->
        <div class="title">
          <span>E-COMMERCE</span>
        </div>
      </div>
      <ul class="sidebar-menus">
        <li v-for="m in menuList['ADMIN']" :key="m.id" class="menu">
          <!-- PARENT -->
          <div
            class="menu-parent"
            @click="toggleMenu(m)"
            :class="{ 'active-parent': isActiveParent(m.path) }"
          >
            <div class="left">
              <div v-if="m?.icon" v-html="m.icon"></div>
              <span>{{ m.title }}</span>
            </div>

            <!-- arrow -->
            <span
              v-if="m.children?.length"
              class="arrow"
              :class="{ open: openedMenu === m.id }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#fcfcfc"
                viewBox="0 0 256 256"
              >
                <path
                  d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"
                ></path>
              </svg>
            </span>
          </div>

          <!-- CHILDREN -->
          <transition name="accordion">
            <ul
              v-if="m.children?.length && openedMenu === m.id"
              class="menu-child"
            >
              <li v-for="ch in m.children" :key="ch.id" class="mb-6">
                <router-link
                  :to="ch.path"
                  :class="{ 'active-child': isActiveChild(ch.path) }"
                  @click="onChildClick"
                >
                  <div v-if="ch?.icon" v-html="ch.icon"></div>
                  <span>{{ ch.title }}</span>
                </router-link>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import menus from "@/constants/menu";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const menuList = ref(menus);
const openedMenu = ref(null);

const isActiveChild = (path) => {
  return route.path === path;
};

const isActiveParent = (path) => {
  return route.path === path;
};

const toggleMenu = (menu) => {
  openedMenu.value = openedMenu.value === menu.id ? null : menu.id;
  if (menu.path) {
    router.push(menu.path);
  }
};

const onChildClick = () => {
  openedMenu.value = null;
};

onMounted(() => {
  const me =
    (localStorage.getItem("me") && JSON.parse(localStorage.getItem("me"))) ||
    {};

  if (me.role === "ADMIN" && me.id === 1) {
    if (menuList.value.ADMIN[0]?.id !== 1) {
      menuList.value.ADMIN.unshift({
        id: 1,
        title: "Foydalanuvchilar",
        path: "/cabinet/admin/users",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#fcfcfc" viewBox="0 0 256 256"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8Z"/></svg>`,
        children: [],
      });
    }
  }
});
</script>

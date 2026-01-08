<template>
  <div class="header">
    <div class="header-wrapper">
      <div class="left">
        <Button v-if="route.meta?.backUrl || route.meta?.goBack" @click="back" class="transparent flex gap-12 center">
          <IconLeft></IconLeft>
          <span>Orqaga</span>
        </Button>
        <!-- <Input class="transparent" before-icon="search"></Input> -->
        <!--        <div class="clock">-->
        <!--          <span class="time">-->
        <!--            11:42-->
        <!--          </span>-->
        <!--          <svg width="2" height="26" viewBox="0 0 2 26" fill="none" xmlns="http://www.w3.org/2000/svg">-->
        <!--            <path opacity="0.2" d="M1 1V25" stroke="white" stroke-linecap="round"/>-->
        <!--          </svg>-->
        <!--          <div class="date">-->
        <!--            <span>Душанба</span>-->
        <!--            <span>26 декабрь, 2022 йил</span>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
      <div class="right">
        <div class="profile">
          <div class="data">
            <div class="avatar">
              <span class="uppercase">
                {{ user?.full_name?.[0] }}
              </span>
            </div>
            <div class="name">
              {{ user?.full_name }}
            </div>
          </div>
          <icon-down></icon-down>
          <div @click="router.push('/auth/sign-in')" class="dropdown">
            <div class="icon">
              <icon-exit></icon-exit>
            </div>
            <span>Kabinetdan chiqish</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import IconDown from '@/components/icon/Down'
import IconExit from '@/components/icon/Exit'
import IconLeft from '@/components/icon/Left'
import Button from "@/components/g/Button";
import { useMain } from '@/store/main'

import { useRouter, useRoute } from "vue-router";
import { ref, onMounted } from 'vue'

const mainStore = useMain()
const user = ref({})
const router = useRouter()
const route = useRoute()

onMounted(() => {
  const me = localStorage.getItem('me')
  user.value = me && JSON.parse(me) || {}
})

const correctUrl = (url) => {
  return url.split("/").map(el => {
    let key = el.includes(":") ? route.params[el.replace(':', '')] : el
    console.log(key)
    return key
  }).join("/")
}

const back = () => {
  route?.meta?.goBack ? router.go(-1) : router.push(correctUrl(route.meta?.backUrl))
}
</script>
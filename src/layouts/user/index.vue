<template>
    <div class="user-layout">
        <UserHeader></UserHeader>
        <router-view></router-view>
    </div>
</template>

<script setup>
import UserHeader from '@/components/layouts/user/Header.vue'
</script>
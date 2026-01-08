<template>
    <div class="g-breadcrumbs">
        <router-link class="breadcrumb" v-for="(b, idx) in mainStore?.breadcrumbs" :key="idx" :to="b.path">
            <IconCaretRight v-if="idx != 0"></IconCaretRight>
            <span>{{ b?.title }}</span>
        </router-link>
    </div>
</template>

<script setup>
import { useMain } from '@/store/main'
import IconCaretRight from '@/components/icon/CaretRight.vue'

const mainStore = useMain()
</script>
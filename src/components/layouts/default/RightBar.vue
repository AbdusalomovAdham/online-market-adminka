<template>
  <div class="right-bar">
    <div class="right-bar-wrapper">
      <Button class="linear pa-8 radius-8 w-40 h-40 mb-12">
        <icon-question></icon-question>
      </Button>
      <Button class="transparent pa-8 radius-8 w-40 h-40 mb-12">
        <icon-play></icon-play>
      </Button>
      <Button class="transparent pa-8 radius-8 w-40 h-40">
        <icon-bell></icon-bell>
      </Button>
    </div>
  </div>
</template>
<script setup>
import Button from "@/components/g/Button";
import IconQuestion from '@/components/icon/Question'
import IconPlay from '@/components/icon/Play'
import IconBell from '@/components/icon/Bell'
</script>
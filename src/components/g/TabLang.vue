<template>
  <div class="tab-lang">
    <div class="tab-lang-wrapper">
      <div @click="selectLang('oz')" class="item" :class="[modelValue == 'oz'&& 'active']">
        <icon-oz></icon-oz>
        <span>O‘zbekcha</span>
      </div>
<!--      <div @click="selectLang('uz')" class="item" :class="[modelValue == 'uz' && 'active']">-->
<!--        <icon-uz></icon-uz>-->
<!--        <span>Ўзбекча</span>-->
<!--      </div>-->
      <div @click="selectLang('en')" class="item" :class="[modelValue == 'en' && 'active']">
        <icon-ru></icon-ru>
        <span>English</span>
      </div>
      <div @click="selectLang('ru')" class="item" :class="[modelValue == 'ru' && 'active']">
        <icon-ru></icon-ru>
        <span>Русский</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconUz from '@/components/icon/Uz'
import IconOz from '@/components/icon/Oz'
import IconRu from '@/components/icon/Ru'

import {defineProps, defineEmits} from 'vue'

const $props = defineProps({
  modelValue: {
    type: String,
    default: 'oz'
  }
})

const $emits = defineEmits({
  'update:modelValue': null
})

const selectLang = (v) => {
  $emits('update:modelValue', v)
}

</script>
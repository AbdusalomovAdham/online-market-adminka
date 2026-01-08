<template>
  <div v-if="Math.ceil($props.count / $props.limit) > 1" class="g-pagination">
    <div class="g-pagination-wrapper">
      <span><b>{{ Math.ceil($props.count / $props.limit) }}</b> ta sahifa. Jami: <b>{{ $props.count }}</b></span>
      <div class="g-pagination-btns">
        <button class="prev" @click="prev">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15L7 10L12 5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="page">
<!--          {{ $props.page }}-->
          <input v-model="value" type="number">
        </button>

        <button class="next" @click="next">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 15L13 10L8 5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";

const $props = defineProps({
  modelValue: null,
  page: {
    type: Number,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  limit: {
    type: Number,
    required: true
  }
})

const $emits = defineEmits({
  next: null,
  prev: null,
  'update:modelValue': null
})

const value = ref(1)
const timeout = ref(null)

const prev = () => {
  if (+value.value > 1) {
    $emits('update:modelValue', +value.value - 1)
    value.value--
  }
}

const next = () => {
  if (+value.value < Math.ceil($props.count / $props.limit)) {
    $emits('update:modelValue', +value.value + 1)
    value.value++
  }
}

onMounted(() => {
  $props.page && (value.value = $props.page)
})

watch(() => value.value, (v) => {
  clearTimeout(timeout.value)
  timeout.value = setTimeout(() => {
    v && $emits('update:modelValue', v)
  }, 300)
})

watch(() => $props.modelValue, (v) => {
  value.value = v
})

</script>

<style scoped>
/*.g-pagination {*/
/*  background: #fff;*/
/*  padding: 8px 12px;*/
/*  border-radius: 6px;*/
/*  overflow: hidden;*/
/*  margin-top: 8px;*/
/*}*/

.g-pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.g-pagination-btns {
  display: flex;
  gap: 4px;
  align-items: center;
}

.g-pagination-wrapper>span {
  margin-right: 12px;
  color: #fff;
}

.g-pagination-btns>button {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  border: none;
  display: flex;
  color: #fff;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
}

input {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  width: 100%;
  color: #fff;
  background-color: transparent;
}
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
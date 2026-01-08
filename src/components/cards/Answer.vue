<template>
    <div :class="['answer-card', answer.isCorrect && 'correct']">
        <Checkbox v-model="answer.isCorrect" class="mb-8" label="Javob matni"></Checkbox>
        <Textarea v-model="answer.text" placeholder="Javob matnini kiriting"></Textarea>
    </div>
</template>

<script setup>
import Textarea from "@/components/g/Textarea.vue"
import Checkbox from "@/components/g/Checkbox.vue"
import {ref} from "vue"

const answer = ref({
    isCorrect: false,
    text: null
})
</script>
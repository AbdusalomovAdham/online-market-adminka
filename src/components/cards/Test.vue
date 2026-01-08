<template>
    <div @click="startTest" :class="['test-card', data?.access ? 'verified' : 'lock']">
        <div class="access">
            <Verified v-if="data?.access"></Verified>
            <Lock v-else></Lock>
        </div>
        <h3>{{ data?.name }}</h3>
        <div class="price">
            <span>Narxi</span>
            <span>{{ data?.type == 'PRIVATE' ? `${formatMoney(data?.price)} so'm` : 'Bepul' }}</span>
        </div>
        <div class="random-count mb-18">
            <span>Testlar soni</span>
            <span>{{ data?.random_count }} ta</span>
        </div>
        <div class="random-count mb-18">
            <span>Belgilangan vaqt</span>
            <span>{{ formatTime(data?.duration) }}</span>
        </div>
        <div v-if="data?.description" v-html="data?.description" class="description"></div>
    </div>
    <ConfirmModal v-if="newTestConfirm" @confirm="newTest" @cancel="newTestConfirm = false">
        <template v-slot:body>
            <div class="flex center mb-48">
                <h2 class="text-center">Test yechishni hohlaysizmi? 123</h2>
            </div>
        </template>
    </ConfirmModal>
    <GModal v-if="newTestConfirm" @close="newTestConfirm = false">
        <template v-slot:body>
            <div class="flex center mb-48">
                <h2 class="text-center"></h2>
                <div v-html="data?.description"></div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="flex gap-12 center">
                <Button v-if="!confirmBtn" @click="newTest" class="main">Tasdiqlayman</Button>
                <Button @click="newTestConfirm = false">Bakor qilish</Button>
            </div>
        </template>
    </GModal>
    <ConfirmModal v-if="nopermission" :confirmBtn="false"
        title="Sizda ushbu testni yechish imkoniyati mavjud emas. Iltimos adminga murojaat qiling."
        @cancel="nopermission = false"></ConfirmModal>
</template>

<script setup>
import Lock from '@/components/icon/Lock.vue'
import Verified from '@/components/icon/Verified.vue'
import ConfirmModal from '@/components/g/ConfirmModal.vue';
import GModal from '@/components/g/Modal.vue';
import Button from '@/components/g/Button.vue';
import { defineProps, ref } from 'vue'
import api from '@/plugins/axios';
import { useRouter } from 'vue-router';

const newTestConfirm = ref(false)
const router = useRouter()
const $props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
const nopermission = ref(false)
const selecetedTest = ref({})
const startTest = () => {
    if ($props.data?.access) { newTestConfirm.value = true }
    else { nopermission.value = true }
}
const formatMoney = (number) => {
    return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : 0
}

const newTest = async () => {
    try {
        let res = await api.post('/client/user-test/create', {
            test_uid: $props.data?.uid
        })

        router.push(`/user/test/${res?.data?.uid}`)
    } catch (e) {
        console.error(e)
    }
}

const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    let result = [];
    if (hours > 0) result.push(`${hours} soat`);
    if (minutes > 0) result.push(`${minutes} minut`);

    return result.length > 0 ? result.join(' ') : '0 minut';
}


</script>

<style></style>
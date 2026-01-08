<template>
    <g-modal title="Ruxsat berilgan foydalanuvchilar" width="1000" @close="$emits('close')">
        <template v-slot:body>
            <div class="flex nowrap mb-18 gap-12">
                <Select class="w-100p" v-model="selectedUser" placeholder="Foydalanuvchini tanlang"
                    :options="freeUserList" option="full_name" value="id"></Select>
                <Button class="main flex center" @click="addUser">
                    <IconPlus></IconPlus>
                </Button>
            </div>
            <Input v-model="searchUser" class="w-100p mb-18"></Input>
            <div class="table">
                <table>
                    <tr>
                        <th class="w-64 t-center">
                            T/r
                        </th>
                        <th>
                            F.I.O
                        </th>
                        <th>
                            Telefon raqami
                        </th>
                        <th class="w-40"></th>
                    </tr>
                    <tr v-for="(u, idx) in userList" :key="u?.id">
                        <td class="t-center">
                            {{ idx + 1 }}
                        </td>
                        <td>
                            {{ u?.full_name }}
                        </td>
                        <td>
                            {{ u?.phone || '-' }}
                        </td>
                        <td class="flex items-center gap-8">
                            <Button @click="selectUser(u?.id)" class="red" tooltip="O'chirish">
                                <icon-trash></icon-trash>
                            </Button>
                        </td>
                    </tr>
                </table>
            </div>
        </template>
    </g-modal>
    <ConfirmModal v-if="selectedUserId" title="Foydalanuvchini o'chirishni tasdiqlaysizmi?" @confirm="deleteUser"
        @cancel="selectedUserId = null"></ConfirmModal>
</template>

<script setup>
import Button from '@/components/g/Button.vue'
import Select from "@/components/g/Select";
import Input from "@/components/g/Input";
import GModal from "@/components/g/Modal";
import IconPlus from "@/components/icon/Plus";
import IconTrash from "@/components/icon/Trash";
import ConfirmModal from "@/components/g/ConfirmModal";
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue'
import api from '@/plugins/axios'

const $emits = defineEmits({
    'close': null
})
const $props = defineProps({
    testId: null
})
const selectedUser = ref(null)
const selectedUserId = ref(null)
const searchUser = ref(null)
const userSearchInterval = ref(null)
const userList = ref([])
const userCount = ref(null)
const freeUserList = ref([])

const addUser = async () => {
    try {
        if (!selectedUser.value) {
            return
        }

        await api.post('/admin/user-test-permission/create', {
            user_id: +selectedUser.value,
            test_id: +$props.testId,
        })

        selectedUser.value = null

        await fetchUserList()
    } catch (e) {
        console.error(e)
    }
}

const selectUser = (id) => {
    selectedUserId.value = id
}

const deleteUser = async () => {
    try {
        await api.post(`/admin/user-test-permission/delete`, {
            userId: selectedUserId.value,
            testId: +$props.testId,
        })
        selectedUserId.value = null
        await fetchUserList()
    } catch (e) {
        console.error(e)
    }
}

const fetchUserList = async () => {
    try {
        {
            let res = await api.get('/admin/user/list', {
                params: {
                    testId: $props.testId
                }
            })

            userList.value = res?.data?.results || []
            userCount.value = res?.data?.count || 0
        }

        {
            let res = await api.get('/admin/user/list', {
                params: {
                    notTestId: $props.testId
                }
            })

            freeUserList.value = res?.data?.results || []
        }
    } catch (e) {
        console.error(e)
    }
}

onMounted(async () => {
    await fetchUserList()
})

watch(() => searchUser.value, (v) => {
    clearInterval(userSearchInterval.value)
    userSearchInterval.value = setInterval(async () => {
        let res = await api.get('/admin/user/list', {
            params: {
                testId: $props.testId,
                search: v || null
            }
        })

        userList.value = res?.data?.results || []
        userCount.value = res?.data?.count || 0

        clearInterval(userSearchInterval.value)
    }, 500)
})
</script>
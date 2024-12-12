<template>
    <el-table v-loading="loading" :data="filteredDoctors" style="margin: 0 auto" border stripe>
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column label="ФИО">
            <template #default="{ row }">
                {{ `${row.first} ${row.last} ${row.patronymic}` }}
            </template>
        </el-table-column>
        <el-table-column label="Отделение" width="150"
            :filters="specs?.map(spec => ({ text: spec.name, value: spec.id }))" :filter-method="filterBySpecId"
            filter-placement="top-end">
            <template #default="{ row }">
                {{ specs?.find(spec => spec.id === row.spec_id)?.name ?? 'Неизвестно' }}
            </template>
        </el-table-column>
        <el-table-column label="Заведующий" width="150" align="center" :filters="[
            { text: 'Да', value: true },
            { text: 'Нет', value: false }
        ]" :filter-method="filterByChief" filter-placement="bottom-end">
            <template #default="{ row }">
                <el-tag v-if="row.chief">Да</el-tag>
                <el-tag type="danger" v-else>Нет</el-tag>
            </template>
        </el-table-column>
        <el-table-column align="right" width="220">
            <template #header>
                <el-input v-model="search" size="small" placeholder="Введите для поиска..." />
            </template>

            <template #default="{ row }">
                <el-button @click="handleEditOpen(row)" size="small" type="primary" :icon="EditPen" />
                <el-popconfirm width="220" @confirm="handleDeleteDoctor(row)" hide-icon
                    title="Вы уверены что хотите удалить?">
                    <template #reference>
                        <el-button size="small" type="danger" :icon="Delete" />
                    </template>
                    <template #actions="{ confirm, cancel }">
                        <el-button @click="cancel" size="small">Нет</el-button>
                        <el-button @click="confirm" size="small" type="primary">Да</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>

    <EditModal v-if="selDoctor !== null && editModalOpen" v-model="editModalOpen" :edit-data="selDoctor" @close="() => {
        editModalOpen = false
        selDoctor = null
    }" @update="() => {
        editModalOpen = false
        selDoctor = null
        getDoctorsLoc()
    }" />
</template>

<script setup lang="ts">
import type { Doctor } from '@/entities/doctor/model/types';
import { useFilteredTable } from '@/shared/composables/useFilteredTable';
import type { Specialization } from '@/shared/types';
import EditModal from '@/widgets/edit-modal/ui/EditModal.vue';
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { inject, ref, type Ref } from 'vue';

const specs = inject<Ref<Specialization[]>>('specs')

const loading = ref(false)
const editModalOpen = ref(false)

const selDoctor = ref<null | Doctor>(null)

const doctors = ref<Doctor[]>([])
const { search, list: filteredDoctors } =
    useFilteredTable(doctors, (doctor: Doctor) => `${doctor.first}${doctor.last}${doctor.patronymic}`)

getDoctorsLoc()

async function getDoctorsLoc() {
    loading.value = true
    doctors.value = await fetch('/api/doctors').then(res => res.json())
    loading.value = false
}

const filterByChief = (value: boolean, row: Doctor) =>
    row.chief === value

const filterBySpecId = (value: string, row: Doctor) =>
    row.spec_id === value

function handleEditOpen(row: Doctor) {
    selDoctor.value = row
    editModalOpen.value = true
}

async function handleDeleteDoctor(row: Doctor) {
    await fetch(`/api/doctors/${row.id}`, { method: 'DELETE' })
    ElNotification({
        title: 'Изменение данных',
        message: 'Врач успешно удален',
        type: 'success',
        duration: 5000
    })
    await getDoctorsLoc()
}
</script>

<style scoped></style>
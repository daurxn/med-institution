<template>
    <el-table v-loading="loading" :data="filteredNurses" style="margin: 0 auto" border stripe>
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
        <el-table-column align="right" width="220">
            <template #header>
                <el-input v-model="search" size="small" placeholder="Введите для поиска..." />
            </template>

            <template #default="{ row }">
                <el-button @click="handleEditOpen(row)" size="small" type="primary" :icon="EditPen" />
                <el-popconfirm width="220" @confirm="handleDeleteNurse(row)" hide-icon
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

    <EditModal v-if="selNurse !== null && editModalOpen" v-model="editModalOpen" :edit-data="selNurse" @close="() => {
        editModalOpen = false
        selNurse = null
    }" @update="() => {
        editModalOpen = false
        selNurse = null
        getNursesLoc()
    }" />
</template>

<script setup lang="ts">
import type { Nurse } from '@/entities/nurse/model/types';
import { useFilteredTable } from '@/shared/composables/useFilteredTable';
import type { Specialization } from '@/shared/types';
import EditModal from '@/widgets/edit-modal/ui/EditModal.vue';
import { Delete, EditPen } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { inject, ref, type Ref } from 'vue';

const specs = inject<Ref<Specialization[]>>('specs')

const loading = ref(false)
const editModalOpen = ref(false)

const selNurse = ref<null | Nurse>(null)

const nurses = ref<Nurse[]>([])
const { search, list: filteredNurses } =
    useFilteredTable(nurses, (nurse: Nurse) => `${nurse.first}${nurse.last}${nurse.patronymic}`)

getNursesLoc()

async function getNursesLoc() {
    loading.value = true
    nurses.value = await fetch('/api/nurses').then(res => res.json())
    loading.value = false
}

const filterBySpecId = (value: string, row: Nurse) =>
    row.spec_id === value

function handleEditOpen(row: Nurse) {
    selNurse.value = row
    editModalOpen.value = true
}

async function handleDeleteNurse(row: Nurse) {
    await fetch(`/api/nurses/${row.id}`, { method: 'DELETE' })
    ElNotification({
        title: 'Изменение данных',
        message: 'Медсестра успешно удален',
        type: 'success',
        duration: 5000
    })
    await getNursesLoc()
}
</script>

<style scoped></style>
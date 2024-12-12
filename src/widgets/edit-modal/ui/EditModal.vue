<template>
    <el-dialog width="85%" style="max-width: 800px">
        <el-form label-position="top">
            <el-form-item label="Имя">
                <el-input v-model="form.first" />
            </el-form-item>

            <el-form-item label="Фамилия" v-if="form.last">
                <el-input v-model="form.last" />
            </el-form-item>

            <el-form-item label="Отчество">
                <el-input v-model="form.patronymic" />
            </el-form-item>

            <el-form-item label="Специализация">
                <el-select v-model=form.spec_id>
                    <el-option v-for="spec in specs" :key="spec.id" :label="spec.name" :value="spec.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="Заведующий" v-if="isDoctor(form)">
                <el-switch v-model="form.chief" />
            </el-form-item>

            <el-form-item>
                <el-button @click="handleUpdateData" :disabled="!form.first || !form.patronymic"
                    type="primary">Cохранить</el-button>
                <el-button @click="emit('close')" type="info">Отмена</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup lang="ts">
import type { Doctor } from '@/entities/doctor/model/types';
import type { Nurse } from '@/entities/nurse/model/types';
import type { Specialization } from '@/shared/types';
import { ElNotification } from 'element-plus';
import { inject, reactive, type Ref } from 'vue';
import { useRoute } from 'vue-router';

const { editData } = defineProps<{
    editData: Doctor | Nurse
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'update'): void
}>()

const route = useRoute()

const specs = inject<Ref<Specialization[]>>('specs')

const form = reactive<typeof editData>(Object.assign({}, editData))

function isDoctor(obj: Doctor | Nurse): obj is Doctor {
    return 'chief' in obj
}

async function handleUpdateData() {
    if (route.name === 'doctors') {
        await fetch(`/api/doctors/${editData.id}`,
            { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })

    } else if (route.name === 'nurses') {
        await fetch(`/api/nurses/${editData.id}`,
            { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }

    ElNotification({
        title: 'Изменение данных',
        message: 'Ваши данные успешно обновлены',
        type: 'success',
        duration: 5000
    })

    emit('update')
}

</script>

<style scoped></style>
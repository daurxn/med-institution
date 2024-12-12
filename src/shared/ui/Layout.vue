<template>
    <el-container direction="vertical">
        <app-header />

        <el-main :style="{ paddingTop: '80px' }">
            <Suspense>
                <RouterView />
            </Suspense>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue';
</script>

<style scoped></style>
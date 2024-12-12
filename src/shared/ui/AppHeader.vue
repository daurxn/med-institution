<template>
    <el-header :style="{ position: 'fixed', top: 0, zIndex: 10, left: 0, right: 0 }">
        <el-menu :default-active="activeIdx" mode="horizontal">
            <el-menu-item :route="{ name: 'doctors' }" index="1">
                <router-link :to="{ name: 'doctors' }">
                    Врачи
                </router-link>
            </el-menu-item>
            <el-menu-item :route="{ name: 'nurses' }" index="2">
                <router-link :to="{ name: 'nurses' }">
                    Медсестры
                </router-link>
            </el-menu-item>
        </el-menu>
    </el-header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeIdx = ref('1')
</script>

<style scoped>
a:link {
    text-decoration: none;
    padding: 0 2rem;
}

.el-menu-item {
    padding: 0;
}
</style>
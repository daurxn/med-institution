<template>
  <Layout />
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';
import Layout from './shared/ui/Layout.vue';
import type { Specialization } from './shared/types';

const specs = ref<Specialization[]>([])

provide('specs', specs)

init()
async function init() {
  specs.value = await fetch('/api/specs').then(res => res.json())
}
</script>

<style scoped></style>
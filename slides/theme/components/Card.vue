<script setup lang="ts">
defineProps<{ icon: string, title: string }>()
</script>

<template>
  <div class="card">
    <span class="card-icon">{{ icon }}</span>
    <b>{{ title }}</b>
    <small><slot /></small>
  </div>
</template>

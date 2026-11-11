<script setup lang="ts">
defineProps<{ n: string | number }>()
</script>

<template>
  <div class="step">
    <span class="step-n">{{ n }}</span>
    <div><slot /></div>
  </div>
</template>

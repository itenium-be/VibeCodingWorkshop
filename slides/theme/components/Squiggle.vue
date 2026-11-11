<script setup lang="ts">
defineProps<{ flip?: boolean }>()
</script>

<template>
  <svg class="squiggle" :class="{ flip }" viewBox="0 0 70 62">
    <path d="M20 4 C 50 18, 10 36, 38 54" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
    <path d="M26 50 L39 56 L42 42" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ icon: 'wrench' | 'restore' }>()
</script>

<!-- Approximates Lovable's own UI so participants recognise the button on screen. -->
<template>
  <span class="lovable-btn">
    <svg v-if="icon === 'wrench'" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
    <svg v-else viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
    <slot />
  </span>
</template>

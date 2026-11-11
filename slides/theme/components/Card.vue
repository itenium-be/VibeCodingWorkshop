<script setup lang="ts">
defineProps<{ icon: string, title: string, prompts?: number, hours?: number }>()
</script>

<template>
  <div class="card" :class="{ 'card-stamped': prompts }">
    <span class="card-icon">{{ icon }}</span>
    <b>{{ title }}</b>
    <small><slot /></small>
    <div v-if="prompts" class="card-stamp">
      <span><strong>{{ prompts }}</strong>prompts<br>±{{ hours }} uur</span>
    </div>
  </div>
</template>

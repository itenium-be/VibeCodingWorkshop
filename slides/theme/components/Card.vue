<script setup lang="ts">
defineProps<{ icon: string, title: string, prompts?: number, hours?: number, href?: string }>()
</script>

<template>
  <div class="card" :class="{ 'card-stamped': prompts }">
    <a v-if="href" class="card-icon" :href="href" target="_blank">{{ icon }}</a>
    <span v-else class="card-icon">{{ icon }}</span>
    <b>{{ title }}</b>
    <small><slot /></small>
    <div v-if="prompts" class="card-stamp">
      <span><strong>{{ prompts }}</strong>prompts<br>±{{ hours }} uur</span>
    </div>
  </div>
</template>

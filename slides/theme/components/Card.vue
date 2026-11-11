<script setup lang="ts">
defineProps<{ icon: string, title: string, prompts?: number, hours?: number, href?: string }>()
</script>

<template>
  <div class="card" :class="{ 'card-stamped': prompts }">
    <span class="card-icon">{{ icon }}</span>
    <b>{{ title }}</b>
    <small><slot /></small>
    <a v-if="href" class="card-link" :href="href" target="_blank">↗</a>
    <div v-if="prompts" class="card-stamp">
      <span><strong>{{ prompts }}</strong>prompts<br>±{{ hours }} uur</span>
    </div>
  </div>
</template>

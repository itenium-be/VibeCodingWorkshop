<script setup lang="ts">
defineProps<{ icon: string, title: string, prompts?: number, time?: string, words?: number, href?: string, hint?: string, step?: number }>()
</script>

<template>
  <div class="card" :class="{ 'card-stamped': prompts, 'card-hinted': hint, 'card-stepped': step }">
    <span v-if="step" class="card-step">{{ step }}</span>
    <a v-if="href" class="card-icon" :href="href" target="_blank">{{ icon }}</a>
    <span v-else class="card-icon">{{ icon }}</span>
    <b>{{ title }}</b>
    <small><slot /></small>
    <span v-if="words" class="card-words">✍️ {{ words.toLocaleString('nl-BE') }} woorden getypt</span>
    <span v-if="hint" class="card-hint">💡 Hint: {{ hint }}</span>
    <div v-if="prompts" class="card-stamp">
      <span><strong>{{ prompts }}</strong>prompts<br>±{{ time }}</span>
    </div>
  </div>
</template>

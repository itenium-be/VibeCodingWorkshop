<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = defineProps<{ text: string, placeholder?: string, at?: number }>()
const { $clicks } = useSlideContext()
const typed = ref('')
let timer: ReturnType<typeof setInterval> | undefined

watch(() => $clicks.value >= (props.at ?? 1), (on) => {
  clearInterval(timer)
  typed.value = ''
  if (!on) return
  timer = setInterval(() => {
    typed.value = props.text.slice(0, typed.value.length + 1)
    if (typed.value === props.text) clearInterval(timer)
  }, 35)
}, { immediate: true })

onUnmounted(() => clearInterval(timer))
</script>

<!-- The invisible full text reserves the final height, so the slide doesn't shift while typing. -->
<template>
  <span class="type-text">
    <span class="type-text-ghost" aria-hidden="true">{{ text }}</span>
    <span v-if="typed" class="type-text-typed">{{ typed }}<span class="type-text-caret" /></span>
    <span v-else class="type-text-placeholder">{{ placeholder }}</span>
  </span>
</template>

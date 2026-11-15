<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useSlideContext } from '@slidev/client'

// script: click number → text typed out from that click on
const props = defineProps<{ script: Record<number, string>, placeholder?: string }>()
const { $clicks } = useSlideContext()
const typed = ref('')
let timer: ReturnType<typeof setInterval> | undefined

const current = computed(() => {
  const at = Object.keys(props.script).map(Number).filter(n => n <= $clicks.value)
  return at.length ? props.script[Math.max(...at)] : ''
})

watch(current, (text) => {
  clearInterval(timer)
  typed.value = ''
  if (!text) return
  timer = setInterval(() => {
    typed.value = text.slice(0, typed.value.length + 1)
    if (typed.value === text) clearInterval(timer)
  }, 35)
}, { immediate: true })

onUnmounted(() => clearInterval(timer))
</script>

<!-- The invisible texts reserve the tallest height, so the slide doesn't shift while typing. -->
<template>
  <span class="type-text">
    <span v-for="t in script" :key="t" class="type-text-ghost" aria-hidden="true">{{ t }}</span>
    <span v-if="typed" class="type-text-typed">{{ typed }}<span class="type-text-caret" /></span>
    <span v-else class="type-text-placeholder">{{ placeholder }}</span>
  </span>
</template>

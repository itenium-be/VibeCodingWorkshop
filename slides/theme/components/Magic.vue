<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const props = defineProps<{ at: number }>()
const { $clicks } = useSlideContext()
const on = computed(() => $clicks.value >= props.at)
const SPARKS = ['✨', '⭐', '💫', '✨', '🌟', '✨', '⭐', '💫']
const spread = (i: number) => {
  const a = i / SPARKS.length * Math.PI * 2
  return { '--dx': `${Math.cos(a) * 11}rem`, '--dy': `${Math.sin(a) * 7}rem`, 'animation-delay': `${i * 40}ms` }
}
</script>

<!-- v-if remounts on each reveal, so the one-shot animations replay. -->
<template>
  <div v-if="on" class="magic">
    <span class="magic-wand">🪄</span>
    <span v-for="(s, i) in SPARKS" :key="i" class="magic-spark" :style="spread(i)">{{ s }}</span>
  </div>
</template>

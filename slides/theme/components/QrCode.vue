<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import QRCode from 'qrcode'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps<{ url?: string }>()
const { $slidev } = useSlideContext()
const target = computed(() => props.url ?? $slidev.configs.siteUrl as string | undefined)
const svg = ref('')

watchEffect(async () => {
  svg.value = target.value
    ? await QRCode.toString(target.value, { type: 'svg', margin: 1, color: { dark: '#2b2140', light: '#ffffff' } })
    : ''
})
</script>

<template>
  <div class="qr">
    <div class="qr-code" v-html="svg" />
    <div class="qr-url">{{ target?.replace(/^https?:\/\//, '') }}</div>
  </div>
</template>

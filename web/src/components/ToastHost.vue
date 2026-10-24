<script setup>
import { useToastStore } from '../stores/toast.js';
const toast = useToastStore();
</script>
<template>
  <div
    v-if="toast.visible"
    class="toast"
    :class="{ 'toast--error': toast.tone === 'error' }"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <span class="toast-chip">{{ toast.tone }}</span
    ><span class="toast-msg">{{ toast.message }}</span>
  </div>
</template>

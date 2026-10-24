<script setup>
defineProps({
  variant: { type: String, default: 'default' },
  type: { type: String, default: 'button' },
});
</script>
<template>
  <button :type="type" class="button" :class="variant !== 'default' ? `button--${variant}` : ''">
    <slot />
  </button>
</template>

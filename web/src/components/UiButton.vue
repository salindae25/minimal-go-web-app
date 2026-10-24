<script setup>
import { Button } from '@/components/ui/button';

const variants = { default: 'secondary', primary: 'default', quiet: 'ghost' };

defineProps({
  variant: { type: String, default: 'default' },
  type: { type: String, default: 'button' },
});
</script>

<template>
  <Button :type="type" :variant="variants[variant] || 'secondary'" v-bind="$attrs">
    <slot />
  </Button>
</template>

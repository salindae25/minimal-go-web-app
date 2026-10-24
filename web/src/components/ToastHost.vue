<script setup>
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToastStore } from '../stores/toast.js';

const toast = useToastStore();
const badgeVariants = { success: 'default', warning: 'secondary', error: 'destructive' };
const toneClasses = {
  success: 'border-success/50',
  warning: 'border-warning/50',
  error: 'border-destructive/50',
};
</script>

<template>
  <Alert
    v-if="toast.visible"
    class="fixed right-5 bottom-5 z-50 flex w-fit max-w-[calc(100vw-2.5rem)] grid-cols-none items-center gap-2 bg-card px-3 py-2 shadow-lg"
    :class="toneClasses[toast.tone]"
    role="status"
    aria-live="polite"
    aria-atomic="true"
  >
    <Badge class="shrink-0 uppercase" :variant="badgeVariants[toast.tone]">
      {{ toast.tone }}
    </Badge>
    <AlertDescription class="m-0 max-w-[min(320px,calc(100vw-100px))] truncate text-foreground">
      {{ toast.message }}
    </AlertDescription>
  </Alert>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { Button } from '@/components/ui/button';
</script>

<template>
  <div class="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 sm:px-8">
    <div>
      <h1 class="mb-2 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p class="mb-7 max-w-prose text-muted-foreground">
        That address does not match a page in this starter.
      </p>
      <Button :as="RouterLink" to="/">Back to home</Button>
    </div>
  </div>
</template>

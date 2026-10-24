<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

defineProps({ title: { type: String, required: true } });
</script>

<template>
  <Card
    class="gap-0 overflow-hidden rounded-lg border border-border bg-background py-0 text-foreground shadow-none ring-0"
  >
    <CardHeader class="grid rounded-none border-b border-border bg-card px-4 py-2.5">
      <CardTitle class="text-[13px] leading-normal font-semibold">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="p-4"><slot /></CardContent>
  </Card>
</template>

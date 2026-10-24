<script setup>
import { useCounterStore } from '../stores/counter.js';
import UiButton from '../components/UiButton.vue';
import UiPanel from '../components/UiPanel.vue';
const counter = useCounterStore();
</script>
<template>
  <div class="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 sm:px-8">
    <div>
      <h1>Shared state</h1>
      <p class="mb-7 max-w-prose text-muted">
        This Pinia counter remains available in the header as you navigate.
      </p>
    </div>
    <UiPanel title="Counter"
      ><div class="grid gap-4">
        <p class="m-0 text-5xl tabular-nums" aria-live="polite">{{ counter.count }}</p>
        <div class="flex flex-wrap items-center gap-2">
          <UiButton variant="primary" @click="counter.increment">Increment</UiButton
          ><UiButton @click="counter.decrement">Decrement</UiButton
          ><UiButton variant="quiet" @click="counter.reset">Reset</UiButton>
        </div>
      </div></UiPanel
    >
  </div>
</template>

<script setup>
defineProps({ title: { type: String, required: true } });
</script>
<template>
  <section class="panel">
    <header class="panel__header">
      <h2 class="panel__title">{{ title }}</h2>
    </header>
    <div class="panel__body"><slot /></div>
  </section>
</template>

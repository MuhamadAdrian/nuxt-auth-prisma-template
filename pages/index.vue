<script setup lang="ts">
const { setBreadcrumb } = useBreadcrumb();

onBeforeMount(() => {
  setBreadcrumb([
    {
      text: "Home",
      to: "/",
    },
  ]);
});
</script>

<template>
  <AppHeader>Success Authenticated + Middleware Enable</AppHeader>
</template>

<script setup lang="ts">
const breadcrumbStore = useBreadcrumb();

const { breadcrumb } = storeToRefs(breadcrumbStore);
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="w-full">
      <div class="flex items-center p-4 gap-4">
        <SidebarTrigger />
        <AppBreadcrumb v-if="breadcrumb.length" :items="breadcrumb" />
      </div>
      <div class="p-4">
        <slot />
      </div>
    </main>
  </SidebarProvider>
</template>

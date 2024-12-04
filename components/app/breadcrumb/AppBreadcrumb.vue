<script setup lang="ts">
import type { BreadcrumbItem } from "./types";

interface Props {
  items: BreadcrumbItem[];
}

const { items } = defineProps<Props>();

const isLastItem = (index: number) => {
  return index === items.length - 1;
};
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <div
        v-for="(item, index) of items"
        :key="index"
        class="flex items-center gap-4"
      >
        <BreadcrumbItem>
          <BreadcrumbPage v-if="isLastItem(index)">{{
            item.text
          }}</BreadcrumbPage>
          <BreadcrumbLink v-else as-child>
            <NuxtLink :to="item.to"> {{ item.text }} </NuxtLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="!isLastItem(index)" />
      </div>
    </BreadcrumbList>
  </Breadcrumb>
</template>

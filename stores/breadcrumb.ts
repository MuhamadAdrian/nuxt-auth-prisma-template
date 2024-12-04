import type { BreadcrumbItem } from "~/components/app/breadcrumb/types";

export const useBreadcrumb = defineStore("breadcrumb", () => {
  const initialItems: BreadcrumbItem[] = [];
  const breadcrumb = ref<BreadcrumbItem[]>([]);

  const setBreadcrumb = (items: BreadcrumbItem[]) => {
    breadcrumb.value = items;
  };

  onBeforeMount(() => {
    setBreadcrumb(initialItems);
  });

  return {
    breadcrumb,
    setBreadcrumb,
  };
});

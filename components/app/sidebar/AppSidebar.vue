<script setup lang="ts">
import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
} from "lucide-vue-next";
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    group: "Dashboard",
  },
  {
    title: "Student Data",
    url: "/student",
    icon: Inbox,
    group: "Master Data",
  },
  {
    title: "Class Data",
    url: "/student-class",
    icon: Calendar,
    group: "Master Data",
  },
];

async function handleLogout() {
  navigateTo("/auth/logout");
}

const { data: user } = useAuth();

const itemGroups = computed(() => {
  const group = new Set(items.map((item) => item.group));

  const groupsArray = [...group];

  return groupsArray.map((group) => {
    return {
      name: group,
      items: items.filter((item) => item.group === group),
    };
  });
});
</script>

<template>
  <Sidebar collapsible="icon">
    <!-- <SidebarHeader> Application Header </SidebarHeader> -->
    <SidebarSeparator />
    <SidebarContent>
      <SidebarGroup v-for="(group, index) of itemGroups" :key="index">
        <SidebarGroupLabel>{{ group.name }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item of group.items" :key="item.title">
              <SidebarMenuButton as-child>
                <NuxtLink :to="item.url" class="hover:bg-accent">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton class="hover:bg-accent justify-between">
                <div class="flex items-center gap-2">
                  <User2 width="16" /> {{ user?.name }}
                </div>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem>
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleLogout">
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>

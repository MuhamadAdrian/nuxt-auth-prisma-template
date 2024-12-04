<script setup lang="ts">
const { data, signOut } = useAuth();

await signOut({
  callbackUrl: "/auth/login",
});
</script>

<template>
  <div>Logout from {{ data?.email }}...</div>
</template>

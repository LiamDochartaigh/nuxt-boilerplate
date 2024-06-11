<template>
  <LoginForm :alertMessage="alertMessage" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "login",
});

const route = useRoute();
const passwordChanged = route.query.passwordChanged;
const alertMessage = passwordChanged ? "Password changed successfully. Please login with your new password." : "";

</script>


<style></style>

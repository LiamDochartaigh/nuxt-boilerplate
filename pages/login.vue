<template>
  <LoginForm :alertMessage="alertMessage" />
</template>

<script setup lang="ts">
import LoginForm from "../components/LoginForm.vue";

const alertMessage = ref("");

const route = useRoute();

onMounted(() => {
  const passwordChanged = route.query.passwordChanged;
  if(passwordChanged) {
    alertMessage.value = "Password changed successfully. Please login with your new password.";
  }
});

</script>


<style></style>

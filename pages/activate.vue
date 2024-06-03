<template>
  <v-row v-if="!isLoading" class="text-center justify-center">
    <v-col v-if="accountActivated">
      <h1 class="text-h3 font-weight-bold mb-3">Account Activated</h1>
      <p>Your account has been activated. You can now login to your account.</p>
    </v-col>
    <v-col v-else>
      <h1 class="text-h3 font-weight-bold mb-3">Whoops!</h1>
      <p>Either the provided activation token is invalid or this account has already been activated.</p>
      <p>Login to your account and please contact Support if you experience any issues accessing your account.</p>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { activateUser } from "../services/userService";

const isLoading = ref(true);
const accountActivated = ref(false);
const route = useRoute();

const token = route.query.token?.toString() || "";
const userActivated = await activateUser(token);

onMounted(async () => {
  isLoading.value = true;
  isLoading.value = false;
  if (userActivated) {
    accountActivated.value = true;
  } else {
    accountActivated.value = false;
  }
});
</script>

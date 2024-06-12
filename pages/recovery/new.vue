<template>
  <div class="d-flex text-center justify-center">
    <v-card class="ld-small-card">
      <v-card-title class="text-h5 text-center bg-primary"> Reset Your Password </v-card-title>
      <v-form ref="passwordResetForm" v-model="passwordResetValid" @submit.prevent="passwordResetSubmit">
        <v-card-text class="text-center">
          <v-row>
            <v-col cols="12">
              <v-alert v-if="error" type="error" dense closable> Please enter a valid email address.
              </v-alert>
              <v-alert v-if="success" type="success" dense closable>
                We've sent you an email to make sure it's really you. Please check your inbox and click the confirmation
                link.
              </v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="accountEmail" :disabled="requestSent" :rules="emailRules" autocomplete="email"
                label="Email" outlined required></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn :loading="sendingRequest" :disabled="requestSent" class="ld-hvr-shrink pl-5 pr-5 bg-primary mb-2" size="x-large" rounded type="submit">
            Reset Password </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { VForm } from "vuetify/components";
import { resetPasswordRequest } from "~/services/userService";

definePageMeta({
  layout: 'login'
})

const requestSent = ref(false);
const passwordResetValid = ref(false);
const sendingRequest = ref(false);
const accountEmail = ref("");
const passwordResetForm: Ref<InstanceType<typeof VForm> | null> = ref(null);
const emailRules = [(v: string) => !!v || "E-mail is required", (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid"];
const error = ref(false);
const success = ref(false);

const passwordResetSubmit = async () => {
  const isValid = await passwordResetForm.value?.validate();
  if (isValid?.valid) {
    sendingRequest.value = true;
    await resetPasswordRequest(accountEmail.value);
    requestSent.value = true;
    sendingRequest.value = false;
    error.value = false;
    success.value = true;
  }
  else{
    error.value = true;
  }
};
</script>
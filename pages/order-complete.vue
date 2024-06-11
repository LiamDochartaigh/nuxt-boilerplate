<template>
  <template v-if="!orderError">
    <div class="text-center">
      <h1 class="text-h3 font-weight-bold mb-3">Order Completed</h1>
      <p class="mb-3">Thank you. Your order has been completed</p>
    </div>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Product</th>
          <th class="text-left">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in order?.products" :key="item.product_ID">
          <td>{{ item.name }}</td>
          <td>{{ `$${item.unit_Price / 100}` }}</td>
        </tr>
      </tbody>
    </v-table>
  </template>
  <template v-else>
    <div class="text-center">
      <h1 class="text-h3 font-weight-bold mb-3">Order Not Found</h1>
      <p class="mb-3">Sorry, we could not find your order</p>
      <span>Please contact support <a :href="`mailto:${supportEmail}`">{{ supportEmail }}</a></span>
    </div>
  </template>
</template>

<script setup lang="ts">
import { GetOrder } from "../services/orderService";

const route = useRoute();
const order = await (async () => {
  const { session_id } = route.query;
  if ((!session_id && typeof session_id !== "string") || Array.isArray(session_id)) return;

  let retries = 0;
  const maxRetries = 4;
  let retrieveOrder = null;
  while (retries < maxRetries && !retrieveOrder) {
    retrieveOrder = await GetOrder(session_id);
    retries++;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return retrieveOrder;
})();

const orderError = order ? false : true;
const supportEmail = import.meta.env.VITE_APP_SUPPORT_EMAIL;
</script>

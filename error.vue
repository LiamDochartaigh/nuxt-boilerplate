<template>
    <div class="text-center py-12">
        <h1 class="text-h1 font-weight-bold mb-3">{{error?.statusCode}}</h1>
        <h2 class="text-h2 font-weight-bold mb-8">Page Not Found</h2>
        <NuxtLink to="/">
            <v-btn class="ld-hvr-shrink pl-5 pr-5 bg-primary" size="x-large" rounded> Go Home </v-btn>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError
})
</script>
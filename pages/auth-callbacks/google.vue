<template>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import {loginGoogleUser} from '../../services/userService';

const router = useRouter();
const route = useRoute();

onMounted(async () => {
    const code = route.query.code;
    if (code && (typeof code === 'string')) {
        await loginGoogleUser(code);
        router.push({ path: '/home' });
    }
})

</script>
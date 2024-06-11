<template>
</template>

<script setup lang="ts">
import { loginGoogleUser } from '../../services/userService';

const router = useRouter();
const route = useRoute();

async function loginUser() {
    const { code } = route.query;
    if (code && (typeof code === 'string')) {
        await loginGoogleUser(code);
        router.push({ path: '/' });
    }
}

loginUser();
</script>
import { useUserStore } from "~/store"

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  userStore.closeLoginPrompt();
})
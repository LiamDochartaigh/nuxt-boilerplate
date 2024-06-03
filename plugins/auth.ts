import { validateUser } from "~/services/userService";

export default defineNuxtPlugin(async (nuxtApp) => {
  await validateUser();
});

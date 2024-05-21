// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-mongoose"],
  runtimeConfig: {
    db_url: process.env.DB_URL,
  },
})
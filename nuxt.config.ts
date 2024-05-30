import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    env_status: process.env.ENV,
    organization_name: process.env.ORGANIZATION_NAME,
    db_url: process.env.DB_URL,
    db_name: process.env.DB_NAME,
    jwt_secret: process.env.JWT_SECRET,
    mailgun_api_key: process.env.MAILGUN_API_KEY,
    mailgun_domain: process.env.MAILGUN_DOMAIN,
    mailgun_from: process.env.MAILGUN_FROM,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  },
});
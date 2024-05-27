// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    client_url: process.env.CLIENT_URL,
    env: process.env.ENV,
    organization_name: process.env.ORGANIZATION_NAME,
    db_url: process.env.DB_URL,
    db_name: process.env.DB_NAME,
    hash_secret: process.env.HASH_SECRET,
    jwt_secret: process.env.JWT_SECRET,
    mailgun_api_key: process.env.MAILGUN_API_KEY,
    mailgun_domain: process.env.MAILGUN_DOMAIN,
    mailgun_from: process.env.MAILGUN_FROM,
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET
  },
})
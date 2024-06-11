export default defineNuxtConfig({
  plugins: [
    '~/plugins/pinia',
    '~/plugins/auth',
  ],
  devtools: { enabled: true },
  css: ["vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    '~/assets/css/main.css'],
  build: {
    transpile: ["vuetify", "class-validator"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    optimizeDeps: {
      include: ['class-validator > class-validator'],
    },
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      organization_name: process.env.ORGANIZATION_NAME,
    },
    env_status: process.env.ENV,
    base_url: process.env.BASE_URL,
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

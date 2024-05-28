import { defineNuxtModule, addServerPlugin, createResolver } from "@nuxt/kit";
import defu from "defu";
interface MongooseOptions {
  uri: string;
}

export default defineNuxtModule({
  meta: {
    name: "nuxt-mongoose",
    configKey: "mongoose",
  },
  setup(options: MongooseOptions, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    const config = nuxt.options.runtimeConfig as any;
    config.mongoose = defu(config.mongoose || {}, {
      uri: options.uri,
    });

    addServerPlugin(resolve("../server/plugins/mongoose"));
  },
});

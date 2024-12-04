import { NuxtAuthHandler } from "#auth";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().public.authSecret,
  providers: [],
});

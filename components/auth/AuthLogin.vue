<script setup lang="ts">
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-vue-next";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm } from "vee-validate";

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })
);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
});

const { signIn } = useAuth();

const onSubmit = handleSubmit(async (values) => {
  await signIn(
    { ...values },
    {
      callbackUrl: "/",
    }
  );
});
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="email">
        <FormItem class="mb-4">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              type="text"
              placeholder="Your email"
              v-bind="componentField"
              :disabled="isSubmitting"
            />
          </FormControl>
          <FormMessage class="text-xs" />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder="Your password"
              v-bind="componentField"
              :disabled="isSubmitting"
            />
          </FormControl>
          <FormMessage class="text-xs" />
        </FormItem>
      </FormField>
      <Button type="submit" class="w-full mt-2" :disabled="isSubmitting">
        <LoaderIcon v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
        Sign In
      </Button>
    </form>
  </div>
</template>

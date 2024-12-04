import prisma from "@/lib/prisma";
import { hashPassword } from "@/server/utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, password, name } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email is already in use",
    });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return {
    message: "User registered successfully",
    user: { id: user.id, email: user.email, name: user.name },
  };
});

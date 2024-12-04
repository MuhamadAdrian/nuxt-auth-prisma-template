import prisma from "@/lib/prisma";
import { verifyAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const { user: decodedUser }: any = await verifyAuth(event);

    // Retrieve user associated with the token
    const user = await prisma.user.findUnique({
      where: { id: decodedUser?.id },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    // Return the user information
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired token",
    });
  }
});

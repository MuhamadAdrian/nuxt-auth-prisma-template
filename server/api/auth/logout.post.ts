import { verifyAuth } from "~/server/utils/auth";
import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
  await verifyAuth(event);

  try {
    const authHeader = getHeader(event, "authorization");

    await prisma.userSessions.updateMany({
      where: {
        token: authHeader!.split(" ")[1],
      },
      data: {
        is_active: false,
      },
    });

    return {
      message: "Logout successful",
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to log out",
    });
  }
});

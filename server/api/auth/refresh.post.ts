import prisma from "@/lib/prisma";
import { generateToken, verifyAuth } from "@/server/utils/auth";
import { UAParser } from "ua-parser-js";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { refresh_token } = body;

  if (!refresh_token) {
    throw createError({
      statusCode: 400,
      statusMessage: "No refresh token provided",
    });
  }

  const userAgent = event.node.req.headers["user-agent"] || "";

  const userInfo = getUserInformation(userAgent);

  const { user: decodedUser }: any = await verifyAuth(event);

  // Retrieve user associated with the token
  const user = await prisma.user.findUnique({
    where: { id: decodedUser?.id },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "User not found",
    });
  }

  if (!JWT_SECRET) {
    throw createError({
      statusCode: 500,
      statusMessage: "Server misconfiguration: JWT_SECRET is missing",
    });
  }

  if (!REFRESH_SECRET) {
    throw createError({
      statusCode: 500,
      statusMessage: "Server misconfiguration: REFRESH_SECRET is missing",
    });
  }

  const ip = event.node.req.headers["x-forwarded-for"] as string;

  const userInfoObj = {
    user_agent: event.node.req.headers["user-agent"] || "",
    ip,
    os:
      userInfo.os.name && userInfo.os.version
        ? `${userInfo.os.name} ${userInfo.os.version}`
        : null,
    device_name:
      userInfo.device.model && userInfo.device.type && userInfo.device.vendor
        ? `${userInfo.device.type} ${userInfo.device.vendor} ${userInfo.device.model}`
        : null,
  };

  const token = generateToken(
    { id: user.id, email: user.email, ...userInfoObj },
    JWT_SECRET,
    "1h"
  );
  const refreshToken = generateToken(
    { id: user.id, email: user.email, ...userInfoObj },
    REFRESH_SECRET,
    "2h"
  );

  const { ip: ipAddress, ...restUserInfoObj } = userInfoObj;

  const userSession = await prisma.userSessions.findFirst({
    where: {
      user_id: user.id,
      ...restUserInfoObj,
    },
  });

  if (!userSession) {
    await prisma.userSessions.create({
      data: {
        ...userInfoObj,
        user_id: user.id,
        is_active: true,
        token: `Bearer ${token}`,
        refresh_token: `Bearer ${refreshToken}`,
      },
    });
  } else {
    await prisma.userSessions.update({
      where: {
        id: userSession.id,
      },
      data: {
        token,
        is_active: true,
        refresh_token: refreshToken,
        updated_at: new Date(),
      },
    });
  }

  return {
    message: "Refresh token successful",
    token,
    refresh_token: refreshToken,
    user: { id: user.id, email: user.email, name: user.name, ...userInfoObj },
  };
});

function getUserInformation(userAgent: string) {
  const parser = new UAParser(userAgent);

  return parser.getResult();
}

import prisma from "@/lib/prisma";
import { verifyPassword, generateToken } from "@/server/utils/auth";
import { UAParser } from "ua-parser-js";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }

  const userAgent = event.node.req.headers["user-agent"] || "";

  const userInfo = getUserInformation(userAgent);

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password",
    });
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password",
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

  // setCookie(event, "token", token, {
  //   httpOnly: false,
  //   secure: false,
  //   path: "/",
  //   sameSite: "strict",
  // });

  return {
    message: "Login successful",
    token,
    refresh_token: refreshToken,
    user: { id: user.id, email: user.email, name: user.name, ...userInfoObj },
  };
});

function getUserInformation(userAgent: string) {
  const parser = new UAParser(userAgent);

  return parser.getResult();
}

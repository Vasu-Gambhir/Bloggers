import { verify } from "hono/jwt";
import { MiddlewareHandler } from "hono";
import { Variables } from "../types/context";
import { EnvBindings } from "../types/env";

export const authMiddleware: MiddlewareHandler<{
  Bindings: EnvBindings;
  Variables: Variables;
}> = async (c, next) => {
  try {
    const Header = c.req.header("Authorization") || "";
    if (!Header) {
      return c.json({ message: "Unauthorized" }, { status: 403 });
    }

    const token = Header.replace("Bearer ", "");
    if (!token) {
      return c.json({ message: "Unauthorized" }, { status: 403 });
    }

    const payload = await verify(token, c.env.JWT_SECRET);

    if (!payload.userId) {
      return c.json({ message: "Unauthorized" }, { status: 403 });
    }
    c.set("userId", payload.userId as string);
    await next();
  } catch (error) {
    console.log(error);
    return c.json({ message: "Invalid token" }, 403);
  }
};

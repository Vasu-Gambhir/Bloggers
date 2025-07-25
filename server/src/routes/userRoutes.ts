import { Hono } from "hono";
import { jwt, sign, verify } from "hono/jwt";
import { EnvBindings } from "../types/env";
import { getPrisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { Variables } from "../types/context";
import { signinInput, signupInput } from "@vasu248/blog-app-commons";

const userRoutes = new Hono<{ Bindings: EnvBindings; Variables: Variables }>();

userRoutes.post("/signup", async (c) => {
  try {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);

    if (!success) {
      return c.json({ message: "Invalid Inputs" }, { status: 411 });
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const foundUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (foundUser) {
      return c.json(
        {
          message:
            "user with this email already exist, Please try logging in or using a different email",
        },
        { status: 403 }
      );
    }
    //   const isValid = await bcrypt.compare(hashedPassword, password)
    const createdUser = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name,
      },
    });

    if (!createdUser.id) {
      return c.json({ message: "Error in creating new user" }, { status: 401 });
    }

    const token = await sign({ userId: createdUser.id }, c.env.JWT_SECRET);
    if (!token) {
      return c.json({ message: "Error in generating token" }, { status: 401 });
    }

    return c.json(
      {
        message: "User created successfully",
        token,
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return c.json(
      { message: "Error in creating new user" + error },
      { status: 401 }
    );
  }
});

userRoutes.post("/signin", async (c) => {
  try {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);

    if (!success) {
      return c.json({ message: "Invalid Inputs" }, { status: 411 });
    }
    const foundUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!foundUser) {
      return c.json({ message: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(body.password, foundUser.password);
    if (!isMatch) {
      return c.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = await sign(
      { userId: foundUser.id },
      c.env.JWT_SECRET // Make sure this is in your .env
    );

    if (!token) {
      return c.json({ message: "Error in generating token" }, { status: 401 });
    }

    return c.json(
      {
        message: "Signed in successfully",
        token,
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return c.json(
      { message: "Error in signing in user" + error },
      { status: 401 }
    );
  }
});

export default userRoutes;
